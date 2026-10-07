import { StateCreator } from "zustand";
import type { BoundStoreT } from "@/lib/store/store";
import { generateDueOccurrences } from "@/modules/recurring-bills/schedule";
import { billSeed } from "@/lib/store/seed";
import { localDateToTimestamp, type LocalDate } from "@/utils/local-date";
import type { IBillOccurrence, IRecurringBill, ITransaction } from "@/utils/types";

type State = {
  bills: IRecurringBill[];
  occurrences: IBillOccurrence[];
};

type BillChanges = Partial<
  Pick<IRecurringBill, "name" | "category" | "amount" | "cadence" | "avatar">
>;

type Action = {
  addBill: (bill: Omit<IRecurringBill, "id">) => void;
  updateBill: (id: string, changes: BillChanges) => void;
  deleteBill: (id: string) => void;
  generateDue: (today: LocalDate) => void;
  markPaid: (occurrenceId: string, today: LocalDate) => void;
};

export type IBillSlice = State & Action;

export const initialState: State = {
  bills: billSeed.bills,
  occurrences: billSeed.occurrences,
};

const lastGeneratedDueDate = (occurrences: IBillOccurrence[], billId: string) =>
  occurrences
    .filter((occurrence) => occurrence.billId === billId)
    .map((occurrence) => occurrence.dueDate)
    .sort()
    .at(-1);

const createBillSlice: StateCreator<BoundStoreT, [], [], IBillSlice> = (
  set,
  get
) => ({
  ...initialState,

  addBill: (bill) =>
    set((state) => ({
      bills: [...state.bills, { ...bill, id: crypto.randomUUID() }],
    })),

  // Edits never rewrite history: generated occurrences keep their amount and
  // due date. A new amount applies to occurrences generated from now on; a new
  // cadence restarts the schedule from the last generated due date.
  updateBill: (id, changes) =>
    set((state) => ({
      bills: state.bills.map((bill) => {
        if (bill.id !== id) return bill;

        const cadenceChanged =
          changes.cadence !== undefined && changes.cadence !== bill.cadence;
        const anchorDate = cadenceChanged
          ? (lastGeneratedDueDate(state.occurrences, id) ?? bill.anchorDate)
          : bill.anchorDate;

        return { ...bill, ...changes, anchorDate };
      }),
    })),

  // Payment transactions stay: they're real spending, now ordinary transactions.
  deleteBill: (id) =>
    set((state) => ({
      bills: state.bills.filter((bill) => bill.id !== id),
      occurrences: state.occurrences.filter(
        (occurrence) => occurrence.billId !== id
      ),
    })),

  generateDue: (today) => {
    const { bills, occurrences } = get();
    const created = bills.flatMap((bill) =>
      generateDueOccurrences(bill, occurrences, today)
    );
    // Leave state untouched when nothing is due, so subscribers don't re-render.
    if (created.length) set({ occurrences: [...occurrences, ...created] });
  },

  markPaid: (occurrenceId, today) => {
    const { bills, occurrences, transactions } = get();
    const occurrence = occurrences.find((o) => o.id === occurrenceId);
    const bill = bills.find((b) => b.id === occurrence?.billId);
    if (!occurrence || !bill || occurrence.transactionId) return;

    const payment: ITransaction = {
      id: crypto.randomUUID(),
      avatar: bill.avatar,
      name: bill.name,
      category: bill.category,
      amount: occurrence.amount,
      date: localDateToTimestamp(today),
      type: "Expense",
    };

    // One update, so the payment and its link can never get out of step.
    set({
      transactions: [...transactions, payment],
      occurrences: occurrences.map((o) =>
        o.id === occurrenceId ? { ...o, transactionId: payment.id } : o
      ),
    });
  },
});

export default createBillSlice;
