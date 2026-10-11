// Dev-only datasets for stress-testing the UI (see dev-data-toggle.tsx).
// Every value is something a real user could enter, or a limit the forms
// enforce (names: 40 characters; amounts: $1,000,000 each).
import { CATEGORIES, COLOURS } from "@/utils/constants";
import {
  addDays,
  addMonths,
  localDateToTimestamp,
  todayLocal,
} from "@/utils/local-date";
import type {
  IBudget,
  IPot,
  IRecurringBill,
  ITransaction,
  IUser,
} from "@/utils/types";
import type { BoundStoreT } from "@/lib/store/store";

export const DATA_MODES = ["worst", "empty", "one", "huge"] as const;
export type DataMode = (typeof DATA_MODES)[number];

type Fixture = Pick<
  BoundStoreT,
  "user" | "transactions" | "budgets" | "pots" | "bills" | "occurrences"
>;

const avatar = (file: string) => `./assets/images/avatars/${file}.jpg`;
const hex = Object.values(COLOURS);

const worst = (): Fixture => {
  const today = todayLocal();
  const on = (days: number) => localDateToTimestamp(addDays(today, days));

  const user: IUser = {
    // 31 characters, under the sign-up limit of 40.
    name: "Aleksandra Wiśniewska-Kowalczyk",
    email: "aleksandra.wisniewska-kowalczyk@northwind-industries-holdings.example.com",
  };

  // Newest first, so the first rows on screen each carry a different failure.
  const transactions: ITransaction[] = [
    {
      id: "w1",
      // 40 characters, the name limit.
      name: "Bartholomew Fitzgerald-Northwind Ind Ltd",
      category: "Personal Care",
      amount: 1_000_000,
      date: on(0),
      type: "Income",
    },
    {
      id: "w2",
      name: "Jo",
      // The image was removed from the server.
      avatar: avatar("jo-deleted"),
      category: "General",
      amount: 0.01,
      date: on(-1),
      type: "Expense",
    },
    {
      id: "w3",
      // A real card-statement descriptor: one long unbroken token.
      name: "PAYPAL *NORTHWINDINDUSTRIESHOLDINGS",
      category: "Shopping",
      amount: 999_999.99,
      date: on(-1),
      type: "Expense",
    },
    {
      id: "w4",
      name: "🍕 Pizza Night",
      category: "Dining Out",
      amount: 48.5,
      date: on(-2),
      type: "Expense",
    },
    {
      id: "w5",
      name: "株式会社ヤマダデンキ",
      category: "Shopping",
      amount: 129_800,
      date: on(-3),
      type: "Expense",
    },
    {
      id: "w6",
      name: "مطعم الشام",
      category: "Dining Out",
      amount: 36,
      date: on(-4),
      type: "Expense",
    },
    {
      id: "w8",
      name: "Dr. med. dent. Schönberger-Wüstenhöfer",
      category: "Personal Care",
      amount: 1_000_000,
      date: on(-6),
      type: "Income",
    },
    {
      id: "w9",
      name: "Sun Park",
      avatar: avatar("sun-park"),
      category: "Entertainment",
      amount: 1_000_000,
      date: on(-400),
      type: "Income",
    },
  ];

  // Every category budgeted: the most budgets the form allows.
  const budgets: IBudget[] = CATEGORIES.map((category, index) => ({
    category,
    maximum: [0.01, 1_000_000, 50, 999_999.99][index % 4],
    theme: hex[index],
  }));

  const potNames = [
    "Emergency fund for the roof and boilers",
    "PC",
    "Jo's wedding 💍",
    "Ремонт квартиры",
    "Taxes",
  ];
  // Every colour used: the most pots the form allows.
  const pots: IPot[] = hex.map((theme, index) => ({
    name: potNames[index] ?? `Savings goal ${index + 1}`,
    target: [1_000_000, 0.01, 2_500, 1_000_000, 100][index % 5],
    total: [0, 1_500_000, 2_499.99, 1_000_000, 0][index % 5],
    theme,
  }));

  const bills: IRecurringBill[] = [
    {
      id: "wb1",
      // 39 characters, under the bill-name limit of 40.
      name: "Northwind Industries Holdings Insurance",
      category: "Bills",
      amount: 1_000_000,
      cadence: "weekly",
      // Unpaid for over a year: more due dates than one catch-up run makes.
      anchorDate: addDays(today, -400),
    },
    {
      id: "wb2",
      name: "Jo",
      category: "Entertainment",
      amount: 0.01,
      cadence: "yearly",
      anchorDate: today,
      avatar: avatar("jo-deleted"),
    },
    {
      id: "wb3",
      name: "株式会社ヤマダデンキ",
      category: "Shopping",
      amount: 999_999.99,
      cadence: "quarterly",
      anchorDate: addDays(today, 1),
    },
    {
      id: "wb4",
      name: "🍕 Pizza subscription",
      category: "Dining Out",
      amount: 19.99,
      cadence: "biweekly",
      anchorDate: addMonths(today, 11),
    },
  ];

  return { user, transactions, budgets, pots, bills, occurrences: [] };
};

const empty = (): Fixture => ({
  user: { name: "Jo", email: "jo@example.com" },
  transactions: [],
  budgets: [],
  pots: [],
  bills: [],
  occurrences: [],
});

const one = (): Fixture => {
  const today = todayLocal();
  return {
    user: { name: "Jo", email: "jo@example.com" },
    transactions: [
      {
        id: "o1",
        name: "Corner Shop",
        category: "Groceries",
        amount: 1,
        date: localDateToTimestamp(today),
        type: "Expense",
      },
    ],
    budgets: [{ category: "Groceries", maximum: 1, theme: hex[0] }],
    pots: [{ name: "Holiday", target: 1, total: 1, theme: hex[1] }],
    bills: [
      {
        id: "ob1",
        name: "Phone",
        category: "Bills",
        amount: 1,
        cadence: "monthly",
        anchorDate: addDays(today, -1),
      },
    ],
    occurrences: [],
  };
};

const huge = (): Fixture => {
  const today = todayLocal();
  const base = worst();
  const transactions: ITransaction[] = Array.from({ length: 1000 }, (_, i) => ({
    id: `h${i}`,
    name: `Payee ${i + 1}`,
    category: CATEGORIES[i % CATEGORIES.length],
    amount: (i % 97) * 13.37 + 0.5,
    date: localDateToTimestamp(addDays(today, -Math.floor(i / 3))),
    type: i % 5 === 0 ? "Income" : "Expense",
  }));
  const bills: IRecurringBill[] = Array.from({ length: 200 }, (_, i) => ({
    id: `hb${i}`,
    name: `Subscription ${i + 1}`,
    category: CATEGORIES[i % CATEGORIES.length],
    amount: 4.99 + i,
    cadence: (["weekly", "biweekly", "monthly", "quarterly", "yearly"] as const)[i % 5],
    anchorDate: addDays(today, (i % 60) - 30),
  }));
  return { ...base, transactions, bills, occurrences: [] };
};

export const fixtures: Record<DataMode, () => Fixture> = { worst, empty, one, huge };
