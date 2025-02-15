import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createAuthSlice, { IAuthSlice } from "@/lib/store/slices/auth";
import createPotSlice, { IPotSlice } from "@/lib/store/slices/pot";
import createBudgetSlice, { IBudgetSlice } from "@/lib/store/slices/budget";
import createTransactionSlice, {
  ITransactionSlice,
} from "@/lib/store/slices/transaction";

export type BoundStoreT = ITransactionSlice &
  IBudgetSlice & 
  IAuthSlice &
  IPotSlice;

const useBoundStore = create<BoundStoreT>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createTransactionSlice(...a),
        ...createBudgetSlice(...a),
        ...createPotSlice(...a),
      }),
      { name: "client-store" }
    )
  )
);

export default useBoundStore;
