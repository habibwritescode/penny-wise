import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";
import { IBudget } from "@/utils/types";

type State = {
  budgets: IBudget[];
};

type Action = {
  createBudget: (budget: IBudget) => void;
  updateBudget: (
    category: string,
    values: Pick<IBudget, "maximum" | "theme">
  ) => void;
  deleteBudget: (category: string) => void;
};

export type IBudgetSlice = State & Action;

export const initialState = {
  budgets: [
    {
      category: "Entertainment",
      maximum: 50.0,
      theme: "#277C78",
    },
    {
      category: "Bills",
      maximum: 750.0,
      theme: "#82C9D7",
    },
  ],
};

const createBudgetSlice: StateCreator<BoundStoreT, [], [], IBudgetSlice> = (
  set
  //   get
) => ({
  ...initialState,
  createBudget: (values) =>
    set((state: State) => {
      const exists = state.budgets.some(
        (budget) => budget.category === values.category
      );
      if (exists) return state;

      return { budgets: [...state.budgets, values] };
    }),

  updateBudget: (category, values) =>
    set((state: State) => ({
      budgets: state.budgets.map((budget) =>
        budget.category === category ? { ...budget, ...values } : budget
      ),
    })),

  deleteBudget: (category) =>
    set((state: State) => {
      const oldItems = state.budgets;
      const newItems = oldItems.filter(
        (budget) => budget.category !== category
      );

      return { budgets: newItems };
    }),
});

export default createBudgetSlice;
