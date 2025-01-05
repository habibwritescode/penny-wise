import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";
import { IBudget } from "@/utils/types";

type State = {
  budgets: IBudget[];
};

type Action = {
  //   createBudget?: (budget: IBudget) => void;
};

export type IBudgetSlice = State & Action;

export const initialState = {
  budgets: [],
};

const createBudgetSlice: StateCreator<BoundStoreT, [], [], IBudgetSlice> = (
  set
  //   get
) => ({
  ...initialState,
  // createBudget: (item) => set(() => ({ ...item })),
});

export default createBudgetSlice;
