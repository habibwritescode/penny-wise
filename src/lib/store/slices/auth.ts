import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";
import { IUser } from "@/utils/types";

// Demo auth: no backend, so we only keep who is "signed in". Passwords are
// validated by the forms and never stored.

type State = {
  user: IUser | null;
};

type Action = {
  signIn: (user: IUser) => void;
  signOut: () => void;
};

export type IAuthSlice = State & Action;

export const initialState: State = {
  user: null,
};

const createAuthSlice: StateCreator<BoundStoreT, [], [], IAuthSlice> = (
  set
) => ({
  ...initialState,
  signIn: (user) => set({ user }),
  signOut: () => set({ user: null }),
});

export default createAuthSlice;
