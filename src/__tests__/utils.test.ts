import { describe, expect, it } from "vitest";

import { calculatePercent } from "@/utils/math";
import {
  CATEGORY_FILTER_OPTIONS,
  filterAndSortTransactions,
  getRecurringBills,
} from "@/modules/transactions/utils";
import { getBillsSummary } from "@/modules/recurring-bills/utils";
import { getVisiblePages } from "@/components/data-table/data-table-pagination";
import getThemeOptions from "@/utils/theme-options";
import getInitials from "@/utils/getInitials";
import { positiveAmount } from "@/utils/schema";
import { formatTransactionAmount } from "@/utils/formatCurrency";
import { ITransaction } from "@/utils/types";

const transaction = (overrides: Partial<ITransaction>): ITransaction => ({
  id: "1",
  name: "Test",
  amount: 10,
  category: "General",
  date: "2024-08-10T00:00:00Z",
  recurring: false,
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

  it("searches by name, case-insensitively", () => {
    const result = filterAndSortTransactions({
      transactions,
      sortFilter: "ascending",
      searchValue: "cIn",
    });
    expect(result.map((item) => item.name)).toEqual(["Cinema"]);
  });
});

describe("getBillsSummary", () => {
  it("splits recurring bills into paid, upcoming and due soon", () => {
    const bills = getRecurringBills([
      transaction({ id: "a", amount: 10, recurring: true, date: "2024-08-02T00:00:00Z" }),
      transaction({ id: "b", amount: 20, recurring: true, date: "2024-08-12T00:00:00Z" }),
      transaction({ id: "c", amount: 40, recurring: true, date: "2024-08-28T00:00:00Z" }),
      transaction({ id: "d", amount: 99, recurring: true, type: "Income" }),
    ]);

    const summary = getBillsSummary(bills, new Date("2024-09-10T12:00:00Z"));

    expect(summary.paid).toEqual({ count: 1, total: 10 });
    expect(summary.upcoming).toEqual({ count: 2, total: 60 });
    expect(summary.dueSoon).toEqual({ count: 1, total: 20 });
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
