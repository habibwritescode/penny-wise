import { del, get, promisifyRequest, set, type UseStore } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

export type StorageMode = "indexeddb" | "memory";

export type IdbStorage = StateStorage & {
  getItem: (name: string) => Promise<string | null>;
  setItem: (name: string, value: string) => Promise<void>;
  removeItem: (name: string) => Promise<void>;
  getMode: () => StorageMode;
  // Called once, when the adapter falls back to memory.
  subscribe: (listener: () => void) => () => void;
};

type Options = {
  // Injectable so tests can pass fake-indexeddb; undefined means unavailable.
  indexedDB?: IDBFactory;
  dbName?: string;
  storeName?: string;
};

// Same as idb-keyval's createStore, but with the factory passed in:
// idb-keyval's own version always uses the global indexedDB.
const createStore = (
  factory: IDBFactory,
  dbName: string,
  storeName: string
): UseStore => {
  const request = factory.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbPromise = promisifyRequest(request);

  return (txMode, callback) =>
    dbPromise.then((db) =>
      callback(db.transaction(storeName, txMode).objectStore(storeName))
    );
};

/**
 * Zustand StateStorage backed by IndexedDB. If IndexedDB can't be opened, or
 * any operation fails (private browsing, storage disabled, quota), it switches
 * to an in-memory map for the rest of the session instead of failing silently,
 * and notifies subscribers so the UI can say changes won't be saved.
 */
export const createIdbStorage = ({
  indexedDB = globalThis.indexedDB,
  dbName = "penny-wise",
  storeName = "state",
}: Options = {}): IdbStorage => {
  let mode: StorageMode = "indexeddb";
  let store: UseStore | null = null;
  // Mirrors everything read or written, so a mid-session fallback keeps the data.
  const memory = new Map<string, string>();
  const listeners = new Set<() => void>();

  const switchToMemory = (error: unknown) => {
    if (mode === "memory") return;
    mode = "memory";
    console.warn("IndexedDB unavailable; changes won't be saved.", error);
    listeners.forEach((listener) => listener());
  };

  // Opened lazily: this module is also imported on the server, where there is
  // no IndexedDB and nothing is ever read or written.
  const getStore = () => {
    if (!indexedDB) throw new Error("IndexedDB is not available");
    store ??= createStore(indexedDB, dbName, storeName);
    return store;
  };

  const run = async <T>(
    operation: (store: UseStore) => Promise<T>,
    fallback: () => T
  ): Promise<T> => {
    if (mode === "memory") return fallback();
    try {
      return await operation(getStore());
    } catch (error) {
      switchToMemory(error);
      return fallback();
    }
  };

  return {
    getItem: (name) =>
      run(
        async (store) => {
          const value = (await get<string>(name, store)) ?? null;
          if (value !== null) memory.set(name, value);
          return value;
        },
        () => memory.get(name) ?? null
      ),
    setItem: (name, value) => {
      memory.set(name, value);
      return run(
        (store) => set(name, value, store),
        () => undefined
      );
    },
    removeItem: (name) => {
      memory.delete(name);
      return run(
        (store) => del(name, store),
        () => undefined
      );
    },
    getMode: () => mode,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

type LegacyStorage = Pick<Storage, "getItem" | "removeItem">;

/**
 * One-time move from localStorage (where the store used to persist): if
 * IndexedDB has nothing for a key but localStorage does, copy it across.
 * The localStorage copy is deleted only once the IndexedDB write succeeded,
 * so a failed move never loses data.
 */
export const withLocalStorageMove = (
  storage: IdbStorage,
  legacy: LegacyStorage | undefined
): IdbStorage => ({
  ...storage,
  getItem: async (name) => {
    const value = await storage.getItem(name);
    if (value !== null || !legacy) return value;

    const legacyValue = legacy.getItem(name);
    if (legacyValue === null) return null;

    await storage.setItem(name, legacyValue);
    if (storage.getMode() === "indexeddb") legacy.removeItem(name);
    return legacyValue;
  },
});

// Accessing localStorage can throw (e.g. Safari with storage blocked).
const getLocalStorage = (): LegacyStorage | undefined => {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
};

// The app's single storage instance, shared by the store and the banner.
export const appStorage = withLocalStorageMove(
  createIdbStorage(),
  getLocalStorage()
);
