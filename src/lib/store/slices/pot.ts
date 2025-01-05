import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";
import { IPot } from "@/utils/types";

type State = {
  pots: IPot[];
};

type Action = {
  //   createPot: (pot: IPot) => void;
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
    {
      name: "Gift",
      target: 150.0,
      total: 110.0,
      theme: "#82C9D7",
    },
    {
      name: "New Laptop",
      target: 1000.0,
      total: 10.0,
      theme: "#F2CDAC",
    },
    {
      name: "Holiday",
      target: 1440.0,
      total: 531.0,
      theme: "#826CB0",
    },
  ],
};

const createPotSlice: StateCreator<BoundStoreT, [], [], IPotSlice> = (
  set
  //   get
) => ({
  ...initialState,
  // createPot: (item) => set(() => ({ ...item })),
});

export default createPotSlice;
