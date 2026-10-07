import { compareLocalDates, type LocalDate } from "@/utils/local-date";
import type {
  Cadence,
  IBillOccurrence,
  IRecurringBill,
} from "@/utils/types";
import { isDueSoon, nextDueDate, occurrenceStatus } from "./schedule";

// ---------------------------------------------------------------------------
// Recurring bills (v2 model): one row per bill, derived from its occurrences.

export type BillStatus = "overdue" | "due-today" | "due-soon" | "paid" | "upcoming";

export interface IBillRow {
  bill: IRecurringBill;
  status: BillStatus;
  // Oldest unpaid due date when something is outstanding, otherwise the next one.
  dueDate: LocalDate;
  // Unpaid occurrences, oldest first, and what they add up to.
  unpaid: IBillOccurrence[];
  outstanding: number;
}

export const getBillRows = (
  bills: IRecurringBill[],
  occurrences: IBillOccurrence[],
  today: LocalDate
): IBillRow[] =>
  bills.map((bill) => {
    const own = occurrences
      .filter((occurrence) => occurrence.billId === bill.id)
      .sort((a, b) => compareLocalDates(a.dueDate, b.dueDate));
    const unpaid = own.filter((occurrence) => !occurrence.transactionId);
    const outstanding = unpaid.reduce((sum, o) => sum + o.amount, 0);

    // Anything unpaid wins: the oldest unpaid occurrence is overdue or due today.
    if (unpaid.length) {
      const oldest = unpaid[0];
      return {
        bill,
        unpaid,
        outstanding,
        dueDate: oldest.dueDate,
        status: occurrenceStatus(oldest, today) as BillStatus,
      };
    }

    const next = nextDueDate(bill, today);
    const status: BillStatus = isDueSoon(next, today)
      ? "due-soon"
      : own.length
        ? "paid"
        : "upcoming";
    return { bill, unpaid, outstanding, dueDate: next, status };
  });

// How many times a cadence occurs per month on average (weekly: 52/12).
const PER_MONTH: Record<Cadence, number> = {
  weekly: 52 / 12,
  biweekly: 26 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
};

// A bill's cost expressed per month, so bills of different cadences can be
// added up meaningfully.
export const monthlyAmount = (bill: IRecurringBill) =>
  bill.amount * PER_MONTH[bill.cadence];

const group = (rows: IBillRow[], amount: (row: IBillRow) => number) => ({
  count: rows.length,
  total: rows.reduce((sum, row) => sum + amount(row), 0),
});

export const summariseBills = (rows: IBillRow[]) => {
  const withStatus = (...statuses: BillStatus[]) =>
    rows.filter((row) => statuses.includes(row.status));
  const billAmount = (row: IBillRow) => row.bill.amount;

  return {
    monthlyTotal: rows.reduce((sum, row) => sum + monthlyAmount(row.bill), 0),
    paid: group(withStatus("paid"), billAmount),
    upcoming: group(withStatus("due-soon", "upcoming"), billAmount),
    dueSoon: group(withStatus("due-soon"), billAmount),
    overdue: group(withStatus("overdue", "due-today"), (row) => row.outstanding),
  };
};

const byDueDate = (a: IBillRow, b: IBillRow) =>
  compareLocalDates(a.dueDate, b.dueDate);

export const BILL_SORT_OPTIONS = [
  { name: "Due date", value: "due" },
  { name: "A to Z", value: "ascending" },
  { name: "Z to A", value: "descending" },
  { name: "Highest", value: "highest" },
  { name: "Lowest", value: "lowest" },
] as const;

export type BillSort = (typeof BILL_SORT_OPTIONS)[number]["value"];

const comparators: Record<BillSort, (a: IBillRow, b: IBillRow) => number> = {
  due: byDueDate,
  ascending: (a, b) => a.bill.name.localeCompare(b.bill.name),
  descending: (a, b) => b.bill.name.localeCompare(a.bill.name),
  highest: (a, b) => b.bill.amount - a.bill.amount,
  lowest: (a, b) => a.bill.amount - b.bill.amount,
};

// "due" puts the soonest-due (or longest-overdue) bills first.
export const sortBillRows = (
  rows: IBillRow[],
  sort: BillSort,
  search = ""
) => {
  const query = search.trim().toLowerCase();
  const filtered = query
    ? rows.filter((row) => row.bill.name.toLowerCase().includes(query))
    : rows;
  return [...filtered].sort(comparators[sort]);
};

export const CADENCE_LABELS: Record<Cadence, string> = {
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export const STATUS_LABELS: Record<BillStatus, string> = {
  overdue: "Overdue",
  "due-today": "Due today",
  "due-soon": "Due soon",
  paid: "Paid",
  upcoming: "Upcoming",
};
