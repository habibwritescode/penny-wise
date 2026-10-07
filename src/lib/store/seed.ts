import {
  addDays,
  localDateToTimestamp,
  todayLocal,
  type LocalDate,
} from "@/utils/local-date";
import type { IBillOccurrence, IRecurringBill, ITransaction } from "@/utils/types";

const avatar = (file: string) => `./assets/images/avatars/${file}.jpg`;

/**
 * Demo bills dated around the visitor's first run, so the recurring-bill
 * feature is visible straight away: one already paid, one overdue, one due
 * soon and one further out. Fixed dates would go stale (or catch up dozens of
 * occurrences). The paid bill's payment lives in the transactions slice, so
 * both come from here to stay consistent.
 */
export const createBillSeed = (today: LocalDate) => {
  const paidDueDate = addDays(today, -10);

  const bills: IRecurringBill[] = [
    {
      id: "seed-spark-electric",
      name: "Spark Electric Solutions",
      category: "Bills",
      amount: 100,
      cadence: "monthly",
      anchorDate: paidDueDate,
      avatar: avatar("spark-electric-solutions"),
    },
    {
      id: "seed-aqua-flow",
      name: "Aqua Flow Utilities",
      category: "Bills",
      amount: 85.5,
      cadence: "monthly",
      anchorDate: addDays(today, -3), // generated on load, unpaid: overdue
      avatar: avatar("aqua-flow-utilities"),
    },
    {
      id: "seed-pixel-playground",
      name: "Pixel Playground",
      category: "Entertainment",
      amount: 10,
      cadence: "weekly",
      anchorDate: addDays(today, 3), // due soon
      avatar: avatar("pixel-playground"),
    },
    {
      id: "seed-nimbus-data",
      name: "Nimbus Data Storage",
      category: "Bills",
      amount: 9.99,
      cadence: "quarterly",
      anchorDate: addDays(today, 20),
      avatar: avatar("nimbus-data-storage"),
    },
  ];

  const payments: ITransaction[] = [
    {
      id: "seed-payment-spark-electric",
      avatar: avatar("spark-electric-solutions"),
      name: "Spark Electric Solutions",
      category: "Bills",
      amount: 100,
      date: localDateToTimestamp(paidDueDate),
      type: "Expense",
    },
  ];

  const occurrences: IBillOccurrence[] = [
    {
      id: "seed-occurrence-spark-electric",
      billId: "seed-spark-electric",
      dueDate: paidDueDate,
      amount: 100,
      transactionId: "seed-payment-spark-electric",
    },
  ];

  return { bills, occurrences, payments };
};

// Only used as initial state, i.e. for a visitor with nothing saved yet.
export const billSeed = createBillSeed(todayLocal());
