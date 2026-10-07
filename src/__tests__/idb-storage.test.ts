import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IDBDatabase, IDBFactory } from "fake-indexeddb";

import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  createIdbStorage,
  withLocalStorageMove,
} from "@/lib/store/idb-storage";

// A factory whose open() fails the way private browsing / disabled storage does.
const failingFactory = () =>
  ({
    open: () => {
      throw new DOMException("IndexedDB disabled", "InvalidStateError");
    },
  }) as unknown as IDBFactory;

describe("createIdbStorage", () => {
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());

  it("round-trips values through IndexedDB", async () => {
    const indexedDB = new IDBFactory();
    const storage = createIdbStorage({ indexedDB });

    await storage.setItem("key", "value");
    expect(await storage.getItem("key")).toBe("value");
    expect(storage.getMode()).toBe("indexeddb");

    // A second adapter on the same database sees the data: it really was persisted.
    const reopened = createIdbStorage({ indexedDB });
    expect(await reopened.getItem("key")).toBe("value");

    await storage.removeItem("key");
    expect(await reopened.getItem("key")).toBeNull();
  });

  it("returns null for a missing key", async () => {
    const storage = createIdbStorage({ indexedDB: new IDBFactory() });
    expect(await storage.getItem("missing")).toBeNull();
  });

  it("falls back to memory when IndexedDB can't be opened", async () => {
    const storage = createIdbStorage({ indexedDB: failingFactory() });

    await storage.setItem("key", "value");
    expect(await storage.getItem("key")).toBe("value");
    expect(storage.getMode()).toBe("memory");
    expect(warn).toHaveBeenCalledOnce();
  });

  it("falls back to memory when there is no IndexedDB at all", async () => {
    const storage = createIdbStorage({ indexedDB: undefined });

    await storage.setItem("key", "value");
    expect(await storage.getItem("key")).toBe("value");
    expect(storage.getMode()).toBe("memory");
  });

  it("keeps the session's data when a write fails after startup", async () => {
    const indexedDB = new IDBFactory();
    const storage = createIdbStorage({ indexedDB });
    await storage.setItem("key", "first");

    // Simulate a later failure (e.g. quota exceeded) on every transaction.
    const transaction = vi
      .spyOn(IDBDatabase.prototype, "transaction")
      .mockImplementation(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });

    await storage.setItem("key", "second");
    expect(storage.getMode()).toBe("memory");
    expect(await storage.getItem("key")).toBe("second");

    transaction.mockRestore();
  });

  it("notifies subscribers once when switching to memory", async () => {
    const storage = createIdbStorage({ indexedDB: failingFactory() });
    const listener = vi.fn();
    const unsubscribe = storage.subscribe(listener);

    await storage.setItem("a", "1");
    await storage.setItem("b", "2");

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("does not touch IndexedDB until the first operation", () => {
    const open = vi.fn();
    createIdbStorage({ indexedDB: { open } as unknown as IDBFactory });
    expect(open).not.toHaveBeenCalled();
  });
});

// Minimal localStorage stand-in for the move tests.
const fakeLocalStorage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    removeItem: (key: string) => void data.delete(key),
    has: (key: string) => data.has(key),
  };
};

describe("withLocalStorageMove", () => {
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());

  it("moves existing localStorage data into IndexedDB, then removes it", async () => {
    const indexedDB = new IDBFactory();
    const legacy = fakeLocalStorage({ "client-store": '{"v":1}' });
    const storage = withLocalStorageMove(createIdbStorage({ indexedDB }), legacy);

    expect(await storage.getItem("client-store")).toBe('{"v":1}');
    expect(legacy.has("client-store")).toBe(false);

    // The data now lives in IndexedDB on its own.
    const fresh = createIdbStorage({ indexedDB });
    expect(await fresh.getItem("client-store")).toBe('{"v":1}');
  });

  it("keeps the localStorage copy if the IndexedDB write fails", async () => {
    const legacy = fakeLocalStorage({ "client-store": '{"v":1}' });
    const storage = withLocalStorageMove(
      createIdbStorage({ indexedDB: failingFactory() }),
      legacy
    );

    // The user still gets their data for this session...
    expect(await storage.getItem("client-store")).toBe('{"v":1}');
    // ...and nothing is lost.
    expect(legacy.has("client-store")).toBe(true);
  });

  it("prefers IndexedDB data and leaves localStorage alone once moved", async () => {
    const indexedDB = new IDBFactory();
    await createIdbStorage({ indexedDB }).setItem("client-store", '{"v":2}');
    const legacy = fakeLocalStorage({ "client-store": '{"v":1}' });

    const storage = withLocalStorageMove(createIdbStorage({ indexedDB }), legacy);

    expect(await storage.getItem("client-store")).toBe('{"v":2}');
    expect(legacy.has("client-store")).toBe(true);
  });

  it("returns null when neither store has data", async () => {
    const storage = withLocalStorageMove(
      createIdbStorage({ indexedDB: new IDBFactory() }),
      fakeLocalStorage()
    );
    expect(await storage.getItem("client-store")).toBeNull();
  });

  it("works without localStorage (e.g. blocked by the browser)", async () => {
    const storage = withLocalStorageMove(
      createIdbStorage({ indexedDB: new IDBFactory() }),
      undefined
    );
    expect(await storage.getItem("client-store")).toBeNull();
  });
});

describe("persist + IndexedDB adapter", () => {
  it("hydrates asynchronously: not ready until IndexedDB has been read", async () => {
    const indexedDB = new IDBFactory();
    await createIdbStorage({ indexedDB }).setItem(
      "test-store",
      JSON.stringify({ state: { count: 5 }, version: 0 })
    );

    const store = createStore<{ count: number }>()(
      persist(() => ({ count: 0 }), {
        name: "test-store",
        storage: createJSONStorage(() => createIdbStorage({ indexedDB })),
        skipHydration: true,
      })
    );

    const hydration = store.persist.rehydrate();
    expect(store.persist.hasHydrated()).toBe(false);
    expect(store.getState().count).toBe(0);

    await hydration;
    expect(store.persist.hasHydrated()).toBe(true);
    expect(store.getState().count).toBe(5);
  });
});
