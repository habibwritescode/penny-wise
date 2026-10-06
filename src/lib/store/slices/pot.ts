import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";
import { IPot } from "@/utils/types";

type State = {
  pots: IPot[];
};

type Action = {
  createPot: (pot: IPot) => void;
  updatePot: (name: string, values: Pick<IPot, "target" | "theme">) => void;
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
      const exists = state.pots.some((pot) => pot.name === values.name);
      if (exists) return state;

      return { pots: [...state.pots, values] };
    }),

  updatePot: (name, values) =>
    set((state: State) => ({
      pots: state.pots.map((pot) =>
        pot.name === name ? { ...pot, ...values } : pot
      ),
    })),

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
