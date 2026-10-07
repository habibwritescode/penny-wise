import { describe, expect, it } from "vitest";

import {
  getBillRows,
  monthlyAmount,
  sortBillRows,
  summariseBills,
} from "@/modules/recurring-bills/utils";
import type { IBillOccurrence, IRecurringBill } from "@/utils/types";

const today = "2025-06-15";

const bill = (id: string, overrides: Partial<IRecurringBill> = {}): IRecurringBill => ({
  id,
  name: id,
  category: "Bills",
  amount: 10,
  cadence: "monthly",
  anchorDate: "2025-01-01",
  ...overrides,
});

const occurrence = (
  billId: string,
  dueDate: string,
  overrides: Partial<IBillOccurrence> = {}
): IBillOccurrence => ({ id: `${billId}-${dueDate}`, billId, dueDate, amount: 10, ...overrides });

describe("getBillRows", () => {
  it("derives one status per bill, most urgent first", () => {
    const bills = [
      bill("overdue", { anchorDate: "2025-06-10" }),
      bill("today", { anchorDate: "2025-06-15" }),
      bill("soon", { anchorDate: "2025-06-18" }),
      bill("paid", { anchorDate: "2025-06-01" }),
      bill("later", { anchorDate: "2025-06-30" }),
    ];
    const occurrences = [
      occurrence("overdue", "2025-06-10"),
      occurrence("today", "2025-06-15"),
      occurrence("paid", "2025-06-01", { transactionId: "t" }),
    ];

    const rows = getBillRows(bills, occurrences, today);
    const statusOf = (id: string) => rows.find((r) => r.bill.id === id)!.status;

    expect(statusOf("overdue")).toBe("overdue");
    expect(statusOf("today")).toBe("due-today");
    expect(statusOf("soon")).toBe("due-soon");
    expect(statusOf("paid")).toBe("paid");
    expect(statusOf("later")).toBe("upcoming");
  });

  it("shows the outstanding due date for overdue bills, the next one otherwise", () => {
    const rows = getBillRows(
      [bill("a", { anchorDate: "2025-05-15" }), bill("b", { anchorDate: "2025-05-20" })],
      [
        occurrence("a", "2025-05-15", { transactionId: "t" }),
        occurrence("a", "2025-06-15", { transactionId: "t2" }),
        occurrence("b", "2025-05-20"),
      ],
      today
    );
    expect(rows.find((r) => r.bill.id === "a")!.dueDate).toBe("2025-07-15");
    expect(rows.find((r) => r.bill.id === "b")!.dueDate).toBe("2025-05-20");
  });

  it("is overdue while any earlier occurrence is unpaid, even if a later one was paid", () => {
    const rows = getBillRows(
      [bill("a", { anchorDate: "2025-04-15" })],
      [
        occurrence("a", "2025-04-15"),
        occurrence("a", "2025-05-15", { transactionId: "t" }),
        occurrence("a", "2025-06-15", { transactionId: "t2" }),
      ],
      today
    );
    expect(rows[0].status).toBe("overdue");
    expect(rows[0].outstanding).toBe(10);
  });

  it("is upcoming when nothing has been generated yet and it isn't due soon", () => {
    expect(getBillRows([bill("a", { anchorDate: "2025-08-01" })], [], today)[0].status).toBe(
      "upcoming"
    );
  });
});

describe("summariseBills", () => {
  it("counts and totals paid, upcoming, due soon and overdue bills", () => {
    const rows = getBillRows(
      [
        bill("paid", { anchorDate: "2025-06-01", amount: 100 }),
        bill("soon", { anchorDate: "2025-06-18", amount: 20 }),
        bill("later", { anchorDate: "2025-06-30", amount: 5 }),
        bill("overdue", { anchorDate: "2025-06-10", amount: 40 }),
      ],
      [
        occurrence("paid", "2025-06-01", { transactionId: "t", amount: 100 }),
        occurrence("overdue", "2025-06-10", { amount: 40 }),
      ],
      today
    );

    expect(summariseBills(rows)).toEqual({
      monthlyTotal: 165,
      paid: { count: 1, total: 100 },
      upcoming: { count: 2, total: 25 },
      dueSoon: { count: 1, total: 20 },
      overdue: { count: 1, total: 40 },
    });
  });
});

describe("monthly totals", () => {
  it("converts each cadence to its monthly equivalent", () => {
    expect(monthlyAmount(bill("w", { cadence: "weekly", amount: 12 }))).toBeCloseTo(52);
    expect(monthlyAmount(bill("b", { cadence: "biweekly", amount: 12 }))).toBeCloseTo(26);
    expect(monthlyAmount(bill("m", { cadence: "monthly", amount: 12 }))).toBe(12);
    expect(monthlyAmount(bill("q", { cadence: "quarterly", amount: 12 }))).toBe(4);
    expect(monthlyAmount(bill("y", { cadence: "yearly", amount: 12 }))).toBe(1);
  });

  it("totals bills of different cadences per month, not by adding raw amounts", () => {
    const rows = getBillRows(
      [
        bill("rent", { cadence: "monthly", amount: 1000, anchorDate: "2025-07-01" }),
        bill("insurance", { cadence: "yearly", amount: 1200, anchorDate: "2025-07-01" }),
      ],
      [],
      today
    );
    expect(summariseBills(rows).monthlyTotal).toBe(1100);
  });
});

describe("sortBillRows", () => {
  const rows = getBillRows(
    [
      bill("Water", { anchorDate: "2025-06-20", amount: 30 }),
      bill("Internet", { anchorDate: "2025-06-17", amount: 50 }),
      bill("Gym", { anchorDate: "2025-06-25", amount: 20 }),
    ],
    [],
    today
  );
  const names = (sorted: typeof rows) => sorted.map((r) => r.bill.name);

  it("sorts by due date, soonest first", () => {
    expect(names(sortBillRows(rows, "due"))).toEqual(["Internet", "Water", "Gym"]);
  });

  it("sorts by name and amount", () => {
    expect(names(sortBillRows(rows, "ascending"))).toEqual(["Gym", "Internet", "Water"]);
    expect(names(sortBillRows(rows, "descending"))).toEqual(["Water", "Internet", "Gym"]);
    expect(names(sortBillRows(rows, "highest"))).toEqual(["Internet", "Water", "Gym"]);
  });

  it("filters by name, case-insensitively", () => {
    expect(names(sortBillRows(rows, "due", "wAt"))).toEqual(["Water"]);
  });
});
