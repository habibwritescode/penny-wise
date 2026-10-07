import { CATEGORIES } from "@/utils/constants";
import type { LocalDate } from "@/utils/local-date";

export interface IUser {
  name: string;
  email: string;
}

export interface IBudget {
  category: string;
  maximum: number;
  theme: string;
}

export type TransactionType = "Income" | "Expense";

export interface ITransaction {
  id: string;
  avatar?: string;
  amount: number;
  name: string;
  category: string;
  date: string;
  type: TransactionType;
}

export type Category = (typeof CATEGORIES)[number];

export interface IPot {
  name: string;
  target: number;
  total: number;
  theme: string;
}

export const SORT_OPTIONS = [
  { name: "Latest", value: "latest" },
  { name: "Oldest", value: "oldest" },
  { name: "A to Z", value: "ascending" },
  { name: "Z to A", value: "descending" },
  { name: "Highest", value: "highest" },
  { name: "Lowest", value: "lowest" },
];

export type SortFilter =
  | "latest"
  | "oldest"
  | "descending"
  | "ascending"
  | "highest"
  | "lowest";
  
export type Cadence = "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";

export interface IRecurringBill {
  id: string;
  name: string;
  category: string;
  // Current amount; applies to occurrences generated from now on.
  amount: number;
  cadence: Cadence;
  // First due date; every later due date is computed from it.
  anchorDate: LocalDate;
  avatar?: string;
}

export interface IBillOccurrence {
  id: string;
  billId: string;
  dueDate: LocalDate;
  // Snapshot of the bill's amount when this occurrence was generated.
  amount: number;
  // Set when paid; the linked expense transaction.
  transactionId?: string;
}

export type OccurrenceStatus = "paid" | "overdue" | "due-today";
