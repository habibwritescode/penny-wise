import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";

type State = {
  isLoggedIn: boolean;
};

type Action = {
  //   signIn?: () => void;
};

export type IAuthSlice = State & Action;

export const initialState = {
  isLoggedIn: false,
};

const createAuthSlice: StateCreator<BoundStoreT, [], [], IAuthSlice> = (
  set
  //   get
) => ({
  ...initialState,
  // signIn: (item) => set(() => ({ ...item })),
});

export default createAuthSlice;
