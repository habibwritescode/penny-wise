import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";
import { ITransaction } from "@/utils/types";

type State = {
  transactions: ITransaction[];
};

type Action = {
  createTransaction: (transaction: ITransaction) => void;
};

export type ITransactionSlice = State & Action;

export const initialState = {
  transactions: [
    {
      id: "123",
      avatar: "./assets/images/avatars/sun-park.jpg",
      amount: 120.0,
      name: "Sun Park",
      category: "General",
      date: "2025-08-17T16:12:05Z",
      recurring: false,
      type: "Income" as const,
    },
    {
      id: "456",
      avatar: "./assets/images/avatars/urban-services-hub.jpg",
      amount: 65.0,
      name: "Urban Services Hub",
      category: "General",
      date: "2025-08-17T21:08:09Z",
      recurring: true,
      type: "Expense" as const,
    },
  ],
};

const createTransactionSlice: StateCreator<
  BoundStoreT,
  [],
  [],
  ITransactionSlice
> = (
  set
  // get
) => ({
  ...initialState,
  createTransaction: (values) =>
    set((state: State) => {
      const oldItems = state.transactions;
      const exist = oldItems.find(
        (transaction) => transaction.id === values.id
      );

      if (exist) {
        const newItems = oldItems.map((item) =>
          item.id === values.id ? { ...values } : item
        );
        return { transactions: newItems };
      } else {
        return {
          transactions: [...oldItems, values],
        };
      }
    }),
});

export default createTransactionSlice;
