import { describe, expect, it } from "vitest";

import {
  MAX_OCCURRENCES_PER_RUN,
  generateDueOccurrences,
  isDueSoon,
  nextDueDate,
  nthDueDate,
  occurrenceStatus,
} from "@/modules/recurring-bills/schedule";
import type { Cadence, IBillOccurrence, IRecurringBill } from "@/utils/types";

const bill = (overrides: Partial<IRecurringBill> = {}): IRecurringBill => ({
  id: "bill-1",
  name: "Rent",
  category: "Bills",
  amount: 1000,
  cadence: "monthly",
  anchorDate: "2025-01-31",
  ...overrides,
});

// Deterministic ids so results can be compared exactly.
const counterIds = () => {
  let n = 0;
  return () => `occ-${++n}`;
};

const dueDates = (occurrences: IBillOccurrence[]) =>
  occurrences.map((occurrence) => occurrence.dueDate);

describe("nthDueDate", () => {
  const first = (cadence: Cadence, anchor: string, count: number) =>
    Array.from({ length: count }, (_, n) => nthDueDate(anchor, cadence, n));

  it("weekly and biweekly step by 7 and 14 days", () => {
    expect(first("weekly", "2025-12-24", 3)).toEqual(["2025-12-24", "2025-12-31", "2026-01-07"]);
    expect(first("biweekly", "2025-02-20", 3)).toEqual(["2025-02-20", "2025-03-06", "2025-03-20"]);
  });

  it("monthly clamps short months without drifting off the 31st", () => {
    expect(first("monthly", "2025-01-31", 5)).toEqual([
      "2025-01-31",
      "2025-02-28",
      "2025-03-31",
      "2025-04-30",
      "2025-05-31",
    ]);
  });

  it("quarterly steps three months, with the same clamping", () => {
    expect(first("quarterly", "2025-11-30", 4)).toEqual([
      "2025-11-30",
      "2026-02-28",
      "2026-05-30",
      "2026-08-30",
    ]);
  });

  it("yearly keeps 29 Feb in leap years and uses 28 Feb otherwise", () => {
    expect(first("yearly", "2024-02-29", 5)).toEqual([
      "2024-02-29",
      "2025-02-28",
      "2026-02-28",
      "2027-02-28",
      "2028-02-29",
    ]);
  });
});

describe("generateDueOccurrences", () => {
  it("generates an occurrence once its due date arrives", () => {
    const result = generateDueOccurrences(bill(), [], "2025-01-31", counterIds());
    expect(result).toEqual([
      { id: "occ-1", billId: "bill-1", dueDate: "2025-01-31", amount: 1000 },
    ]);
  });

  it("generates nothing before the first due date", () => {
    expect(generateDueOccurrences(bill(), [], "2025-01-30")).toEqual([]);
  });

  it("catches up every missed period", () => {
    const result = generateDueOccurrences(bill(), [], "2025-04-30");
    expect(dueDates(result)).toEqual([
      "2025-01-31",
      "2025-02-28",
      "2025-03-31",
      "2025-04-30",
    ]);
  });

  it("is idempotent: existing occurrences are never generated again", () => {
    const first = generateDueOccurrences(bill(), [], "2025-02-28");
    expect(generateDueOccurrences(bill(), first, "2025-02-28")).toEqual([]);

    const later = generateDueOccurrences(bill(), first, "2025-03-31");
    expect(dueDates(later)).toEqual(["2025-03-31"]);
  });

  it("only considers occurrences of the same bill", () => {
    const other: IBillOccurrence = {
      id: "x",
      billId: "bill-2",
      dueDate: "2025-01-31",
      amount: 5,
    };
    expect(dueDates(generateDueOccurrences(bill(), [other], "2025-01-31"))).toEqual([
      "2025-01-31",
    ]);
  });

  it(`caps a run at ${MAX_OCCURRENCES_PER_RUN}, oldest first, and continues next run`, () => {
    const weekly = bill({ cadence: "weekly", anchorDate: "2024-01-01" });
    const today = "2025-12-31"; // ~104 weekly occurrences since the anchor

    const firstRun = generateDueOccurrences(weekly, [], today);
    expect(firstRun).toHaveLength(MAX_OCCURRENCES_PER_RUN);
    expect(firstRun[0].dueDate).toBe("2024-01-01");

    const secondRun = generateDueOccurrences(weekly, firstRun, today);
    expect(secondRun).toHaveLength(MAX_OCCURRENCES_PER_RUN);
    expect(secondRun[0].dueDate).toBe(nthDueDate("2024-01-01", "weekly", 24));
  });

  it("snapshots the bill's current amount", () => {
    const result = generateDueOccurrences(bill({ amount: 42.5 }), [], "2025-01-31");
    expect(result[0].amount).toBe(42.5);
  });
});

describe("nextDueDate", () => {
  it("is the first due date after today", () => {
    expect(nextDueDate(bill(), "2025-01-30")).toBe("2025-01-31");
    expect(nextDueDate(bill(), "2025-01-31")).toBe("2025-02-28");
    expect(nextDueDate(bill(), "2025-03-15")).toBe("2025-03-31");
  });
});

describe("statuses", () => {
  const occurrence = (overrides: Partial<IBillOccurrence> = {}): IBillOccurrence => ({
    id: "o",
    billId: "bill-1",
    dueDate: "2025-06-10",
    amount: 10,
    ...overrides,
  });

  it("derives paid, overdue and due-today", () => {
    expect(occurrenceStatus(occurrence({ transactionId: "t" }), "2025-07-01")).toBe("paid");
    expect(occurrenceStatus(occurrence(), "2025-06-11")).toBe("overdue");
    expect(occurrenceStatus(occurrence(), "2025-06-10")).toBe("due-today");
  });

  it("treats the next due date as due soon within 5 days", () => {
    expect(isDueSoon("2025-06-15", "2025-06-10")).toBe(true); // 5 days
    expect(isDueSoon("2025-06-16", "2025-06-10")).toBe(false); // 6 days
    expect(isDueSoon("2025-06-11", "2025-06-10")).toBe(true); // tomorrow
    expect(isDueSoon("2025-06-10", "2025-06-10")).toBe(false); // today is due-today
  });
});
