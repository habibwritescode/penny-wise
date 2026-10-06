import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createAuthSlice, { IAuthSlice } from "@/lib/store/slices/auth";
import createPotSlice, { IPotSlice } from "@/lib/store/slices/pot";
import createBudgetSlice, { IBudgetSlice } from "@/lib/store/slices/budget";
import createTransactionSlice, {
  ITransactionSlice,
} from "@/lib/store/slices/transaction";
import { COLOURS } from "@/utils/constants";

export type BoundStoreT = ITransactionSlice &
  IBudgetSlice &
  IAuthSlice &
  IPotSlice;

type Themed = { theme: string };

// v0 stored themes as colour names ("Navy Grey"); v1 stores hex values.
const toHexTheme = <T extends Themed>(item: T): T => {
  const hex = COLOURS[item.theme as keyof typeof COLOURS];
  return hex ? { ...item, theme: hex } : item;
};

export const migrateStore = (persisted: unknown, version: number) => {
  const state = persisted as Partial<BoundStoreT>;

  if (version < 1) {
    return {
      ...state,
      budgets: state.budgets?.map(toHexTheme),
      pots: state.pots?.map(toHexTheme),
    } as BoundStoreT;
  }

  return state as BoundStoreT;
};

const useBoundStore = create<BoundStoreT>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createTransactionSlice(...a),
        ...createBudgetSlice(...a),
        ...createPotSlice(...a),
      }),
      {
        name: "client-store",
        version: 1,
        migrate: migrateStore,
        // Rehydrated in _app after mount so the first client render matches the server HTML.
        skipHydration: true,
      }
    )
  )
);

export default useBoundStore;
