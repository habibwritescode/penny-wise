// Dev-only: loads a stress-test dataset instead of saved data when the URL
// has ?data=worst|empty|one|huge (?data=demo goes back). The choice is kept
// in sessionStorage because links between pages drop the query string.
import { createJSONStorage } from "zustand/middleware";

import type useBoundStore from "@/lib/store/store";
import { DATA_MODES, fixtures, type DataMode } from "./fixtures";

const KEY = "pennywise-data-mode";

const isMode = (value: string | null): value is DataMode =>
  DATA_MODES.includes(value as DataMode);

export const currentDataMode = (): DataMode | null => {
  try {
    const param = new URLSearchParams(window.location.search).get("data");
    if (param === "demo") sessionStorage.removeItem(KEY);
    else if (isMode(param)) sessionStorage.setItem(KEY, param);
    const saved = sessionStorage.getItem(KEY);
    return isMode(saved) ? saved : null;
  } catch {
    return null;
  }
};

// Swaps storage for memory first, so a fixture never reads or overwrites the
// data saved in IndexedDB.
export const loadFixture = async (store: typeof useBoundStore) => {
  const mode = currentDataMode();
  if (!mode) return false;

  const memory = new Map<string, string>();
  store.persist.setOptions({
    storage: createJSONStorage(() => ({
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => void memory.set(key, value),
      removeItem: (key) => void memory.delete(key),
    })),
  });
  store.setState(fixtures[mode]());
  await store.persist.rehydrate();
  return true;
};
