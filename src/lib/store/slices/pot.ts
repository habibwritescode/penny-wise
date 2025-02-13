import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";
import { IPot } from "@/utils/types";

type State = {
  pots: IPot[];
};

type Action = {
  createPot: (pot: IPot) => void;
  deletePot: (name: string) => void;
  updatePotTotal: (total: number, name: string) => void;
};

export type IPotSlice = State & Action;

export const initialState = {
  pots: [
    {
      name: "Savings",
      target: 2000.0,
      total: 159.0,
      theme: "#277C78",
    },
    {
      name: "Concert Ticket",
      target: 150.0,
      total: 110.0,
      theme: "#626070",
    },
  ],
};

const createPotSlice: StateCreator<BoundStoreT, [], [], IPotSlice> = (
  set
  //   get
) => ({
  ...initialState,
  createPot: (values) =>
    set((state: State) => {
      const oldItems = state.pots;
      const existingItem = oldItems.find((pot) => pot.name === values.name);

      if (existingItem) {
        const newItems = oldItems.map((item) => {
          if (item.name !== values.name) return item;

          return {
            ...values,
          };
        });

        return { pots: newItems };
      } else {
        return {
          pots: [...oldItems, values],
        };
      }
    }),

  deletePot: (name) =>
    set((state: State) => {
      const oldItems = state.pots;
      const newItems = oldItems.filter((pot) => pot.name !== name);

      return { pots: newItems };
    }),
  updatePotTotal: (total, name) =>
    set((state: State) => {
      const oldItems = state.pots;

      const newItems = oldItems.map((item) => {
        if (item.name !== name) return item;

        return {
          ...item,
          total,
        };
      });

      return { pots: newItems };
    }),
});

export default createPotSlice;
