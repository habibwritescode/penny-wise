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
  transactions: [],
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
