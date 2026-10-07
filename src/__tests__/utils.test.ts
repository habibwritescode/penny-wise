import { describe, expect, it } from "vitest";

import { calculatePercent } from "@/utils/math";
import {
  CATEGORY_FILTER_OPTIONS,
  filterAndSortTransactions,
} from "@/modules/transactions/utils";
import { getVisiblePages } from "@/components/data-table/data-table-pagination";
import getThemeOptions from "@/utils/theme-options";
import getInitials from "@/utils/getInitials";
import nameFromEmail from "@/utils/nameFromEmail";
import { positiveAmount } from "@/utils/schema";
import { formatTransactionAmount } from "@/utils/formatCurrency";
import { ITransaction } from "@/utils/types";

const transaction = (overrides: Partial<ITransaction>): ITransaction => ({
  id: "1",
  name: "Test",
  amount: 10,
  category: "General",
  date: "2024-08-10T00:00:00Z",
  type: "Expense",
  ...overrides,
});

describe("calculatePercent", () => {
  it("returns part as a percentage of total, capped at 100", () => {
    expect(calculatePercent(25, 50)).toBe(50);
    expect(calculatePercent(80, 50)).toBe(100);
    expect(calculatePercent(10, 0)).toBe(0);
  });
});

describe("filterAndSortTransactions", () => {
  const transactions = [
    transaction({ id: "1", name: "Bistro", category: "Dining Out" }),
    transaction({ id: "2", name: "Cinema", category: "Entertainment" }),
  ];

  it("matches every category offered in the filter", () => {
    const values = CATEGORY_FILTER_OPTIONS.map((option) => option.value);
    expect(values).toContain("Dining Out");

    const result = filterAndSortTransactions({
      transactions,
      sortFilter: "latest",
      categoryFilter: "Dining Out",
    });
    expect(result.map((item) => item.name)).toEqual(["Bistro"]);
  });

  it("sorts highest/lowest by signed amount: income above expenses", () => {
    const mixed = [
      transaction({ id: "a", name: "Rent", amount: 900, type: "Expense" }),
      transaction({ id: "b", name: "Salary", amount: 2000, type: "Income" }),
      transaction({ id: "c", name: "Coffee", amount: 4, type: "Expense" }),
      transaction({ id: "d", name: "Refund", amount: 20, type: "Income" }),
    ];
    const names = (sortFilter: string) =>
      filterAndSortTransactions({ transactions: mixed, sortFilter }).map((t) => t.name);

    expect(names("highest")).toEqual(["Salary", "Refund", "Coffee", "Rent"]);
    expect(names("lowest")).toEqual(["Rent", "Coffee", "Refund", "Salary"]);
  });

  it("searches by name, case-insensitively", () => {
    const result = filterAndSortTransactions({
      transactions,
      sortFilter: "ascending",
      searchValue: "cIn",
    });
    expect(result.map((item) => item.name)).toEqual(["Cinema"]);
  });
});

describe("getVisiblePages", () => {
  it("shows every page when there are few", () => {
    expect(getVisiblePages(3, 2)).toEqual([1, 2, 3]);
  });

  it("collapses distant pages into ellipses", () => {
    expect(getVisiblePages(10, 5)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });
});

describe("getThemeOptions", () => {
  it("disables used colours except the item's own", () => {
    const options = getThemeOptions(
      [{ theme: "#277C78" }, { theme: "#82C9D7" }],
      "#82C9D7"
    );
    const byValue = Object.fromEntries(options.map((o) => [o.value, o]));

    expect(byValue["#277C78"].disabled).toBe(true);
    expect(byValue["#82C9D7"].disabled).toBe(false);
    expect(byValue["#C94736"].disabled).toBe(false);
  });
});

describe("positiveAmount", () => {
  it("rejects empty, zero, negative and non-numeric input", () => {
    for (const value of ["", "0", "-5", "abc"]) {
      expect(positiveAmount.safeParse(value).success).toBe(false);
    }
    expect(positiveAmount.safeParse("12.5").success).toBe(true);
  });

  it("rejects exponents, extra decimals and amounts over the cap", () => {
    for (const value of ["3e12", "12.345", "1000000.01", "3000000000000"]) {
      expect(positiveAmount.safeParse(value).success).toBe(false);
    }
    expect(positiveAmount.safeParse("1000000").success).toBe(true);
    expect(positiveAmount.safeParse("0.01").success).toBe(true);
  });
});

describe("formatting", () => {
  it("signs amounts by transaction type", () => {
    expect(formatTransactionAmount({ amount: 65, type: "Expense" })).toBe("-$65.00");
    expect(formatTransactionAmount({ amount: 120, type: "Income" })).toBe("+$120.00");
  });

  it("builds initials from up to two words", () => {
    expect(getInitials("Urban Services Hub")).toBe("US");
    expect(getInitials("emma")).toBe("E");
  });
});

describe("nameFromEmail", () => {
  it("turns the local part into a display name", () => {
    expect(nameFromEmail("habib.afolabi@mail.com")).toBe("Habib Afolabi");
    expect(nameFromEmail("jane_doe-smith@x.io")).toBe("Jane Doe Smith");
    expect(nameFromEmail("sam@x.io")).toBe("Sam");
  });
});
