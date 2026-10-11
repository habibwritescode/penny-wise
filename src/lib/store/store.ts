import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import createAuthSlice, { IAuthSlice } from "@/lib/store/slices/auth";
import createPotSlice, { IPotSlice } from "@/lib/store/slices/pot";
import createBillSlice, { IBillSlice } from "@/lib/store/slices/bill";
import createBudgetSlice, { IBudgetSlice } from "@/lib/store/slices/budget";
import createTransactionSlice, {
  ITransactionSlice,
} from "@/lib/store/slices/transaction";
import { COLOURS } from "@/utils/constants";
import { toLocalDate, todayLocal, type LocalDate } from "@/utils/local-date";
import { nextDueDate } from "@/modules/recurring-bills/schedule";
import type { IBillOccurrence, IRecurringBill, ITransaction } from "@/utils/types";
import { appStorage } from "@/lib/store/idb-storage";

export type BoundStoreT = ITransactionSlice &
  IBudgetSlice &
  IAuthSlice &
  IPotSlice &
  IBillSlice;

type Themed = { theme: string };

// v0 stored themes as colour names ("Navy Grey"); v1 stores hex values.
const toHexTheme = <T extends Themed>(item: T): T => {
  const hex = COLOURS[item.theme as keyof typeof COLOURS];
  return hex ? { ...item, theme: hex } : item;
};

// v1 marked recurring bills with a flag on the transaction; v2 has real
// bills. Each flagged transaction becomes a monthly bill on that day of the
// month, with the transaction kept as its paid occurrence, so no history is
// lost. The schedule starts at the next due date after the upgrade: these were
// never bills before, so catching up every month since the transaction would
// invent a backlog of "overdue" bills nobody owed.
type V1Transaction = ITransaction & { recurring?: boolean };

const billsFromRecurringTransactions = (
  transactions: V1Transaction[] = [],
  today: LocalDate
) => {
  const bills: IRecurringBill[] = [];
  const occurrences: IBillOccurrence[] = [];

  for (const transaction of transactions.filter((t) => t.recurring)) {
    const paidOn = toLocalDate(transaction.date);
    const bill: IRecurringBill = {
      id: crypto.randomUUID(),
      name: transaction.name,
      category: transaction.category,
      amount: transaction.amount,
      cadence: "monthly",
      anchorDate: paidOn,
      avatar: transaction.avatar,
    };
    bill.anchorDate = nextDueDate(bill, today);
    bills.push(bill);
    occurrences.push({
      id: crypto.randomUUID(),
      billId: bill.id,
      dueDate: paidOn,
      amount: transaction.amount,
      transactionId: transaction.id,
    });
  }

  return { bills, occurrences };
};

// Each step upgrades one version, and they run in order, so data saved at any
// older version reaches the current shape.
export const migrateStore = (
  persisted: unknown,
  version: number,
  today: LocalDate = todayLocal()
) => {
  let state = persisted as Partial<BoundStoreT>;

  // Only set keys the saved data has: loading merges the result over the
  // defaults, so an explicit `pots: undefined` would wipe them.
  if (version < 1) {
    const { budgets, pots } = state;
    if (budgets) state = { ...state, budgets: budgets.map(toHexTheme) };
    if (pots) state = { ...state, pots: pots.map(toHexTheme) };
  }

  if (version < 2) {
    state = {
      ...state,
      ...billsFromRecurringTransactions(
        state.transactions as V1Transaction[],
        today
      ),
    };
  }

  return state as BoundStoreT;
};

const useBoundStore = create<BoundStoreT>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createTransactionSlice(...a),
        ...createBudgetSlice(...a),
        ...createPotSlice(...a),
        ...createBillSlice(...a),
      }),
      {
        name: "client-store",
        storage: createJSONStorage(() => appStorage),
        version: 2,
        migrate: migrateStore,
        // Rehydrated in _app after mount so the first client render matches the server HTML.
        skipHydration: true,
      }
    )
  )
);

export default useBoundStore;

// Loads saved data at most once. Calling persist.rehydrate() twice (e.g. React
// StrictMode running effects twice in development) starts two async reads; the
// slower one finishes last and overwrites anything written in between, such as
// bill occurrences generated as soon as the first read completed.
let hydration: Promise<void> | undefined;
const rehydrate = () => useBoundStore.persist.rehydrate() as Promise<void>;
export const hydrateStore = () =>
  (hydration ??=
    process.env.NODE_ENV === "production"
      ? rehydrate()
      : // Dev-only stress-test data (src/lib/dev); never in the production bundle.
        import("@/lib/dev/fixture-mode")
          .then(({ loadFixture }) => loadFixture(useBoundStore))
          .then((loaded) => (loaded ? undefined : rehydrate())));
