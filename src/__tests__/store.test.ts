import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "zustand/vanilla";

import type { BoundStoreT } from "@/lib/store/store";
import { hydrateStore, migrateStore } from "@/lib/store/store";
import { toLocalDate } from "@/utils/local-date";
import { createBillSeed } from "@/lib/store/seed";
import {
  isDueSoon,
  nextDueDate,
  occurrenceStatus,
} from "@/modules/recurring-bills/schedule";
import { getBillRows } from "@/modules/recurring-bills/utils";
import createAuthSlice from "@/lib/store/slices/auth";
import createBillSlice from "@/lib/store/slices/bill";
import createBudgetSlice from "@/lib/store/slices/budget";
import createPotSlice from "@/lib/store/slices/pot";
import createTransactionSlice from "@/lib/store/slices/transaction";

// Same slices as the app store, without persistence.
const makeStore = () =>
  createStore<BoundStoreT>()((...a) => ({
    ...createAuthSlice(...a),
    ...createTransactionSlice(...a),
    ...createBudgetSlice(...a),
    ...createPotSlice(...a),
    ...createBillSlice(...a),
  }));

let store: ReturnType<typeof makeStore>;

beforeEach(() => {
  store = makeStore();
});

describe("budget slice", () => {
  it("lowers a budget maximum on update", () => {
    store.getState().updateBudget("Entertainment", {
      maximum: 20,
      theme: "#277C78",
    });

    const budget = store
      .getState()
      .budgets.find((item) => item.category === "Entertainment");
    expect(budget?.maximum).toBe(20);
  });

  it("does not overwrite an existing budget on create", () => {
    store.getState().createBudget({
      category: "Bills",
      maximum: 1,
      theme: "#C94736",
    });

    const bills = store
      .getState()
      .budgets.filter((item) => item.category === "Bills");
    expect(bills).toEqual([
      { category: "Bills", maximum: 750, theme: "#82C9D7" },
    ]);
  });
});

describe("pot slice", () => {
  it("does not wipe an existing pot's total on create", () => {
    store.getState().createPot({
      name: "Savings",
      target: 10,
      total: 0,
      theme: "#C94736",
    });

    const savings = store.getState().pots.find((p) => p.name === "Savings");
    expect(savings?.total).toBe(159);
    expect(store.getState().pots).toHaveLength(2);
  });

  it("updates target and theme but keeps the total", () => {
    store.getState().updatePot("Savings", { target: 5000, theme: "#C94736" });

    expect(store.getState().pots[0]).toEqual({
      name: "Savings",
      target: 5000,
      total: 159,
      theme: "#C94736",
    });
  });
});

describe("migrateStore", () => {
  it("converts v0 colour-name themes to hex", () => {
    const migrated = migrateStore(
      {
        budgets: [{ category: "Bills", maximum: 10, theme: "Navy Grey" }],
        pots: [{ name: "Trip", target: 10, total: 0, theme: "#277C78" }],
      },
      0
    );

    expect(migrated.budgets[0].theme).toBe("#97A0AC");
    expect(migrated.pots[0].theme).toBe("#277C78");
  });
});

describe("auth slice", () => {
  it("starts signed out", () => {
    expect(store.getState().user).toBeNull();
  });

  it("signs in and out without touching finance data", () => {
    const { budgets, pots, transactions } = store.getState();

    store.getState().signIn({ name: "Habib", email: "habib@mail.com" });
    expect(store.getState().user).toEqual({
      name: "Habib",
      email: "habib@mail.com",
    });

    store.getState().signOut();
    expect(store.getState().user).toBeNull();
    expect(store.getState().budgets).toBe(budgets);
    expect(store.getState().pots).toBe(pots);
    expect(store.getState().transactions).toBe(transactions);
  });
});

describe("bill slice", () => {
  const rent = {
    name: "Rent",
    category: "Bills",
    amount: 1000,
    cadence: "monthly" as const,
    anchorDate: "2025-01-31",
  };

  const addRent = () => {
    store.getState().addBill(rent);
    return store.getState().bills.at(-1)!;
  };
  const occurrencesOf = (billId: string) =>
    store.getState().occurrences.filter((o) => o.billId === billId);

  it("adds a bill with an id", () => {
    const bill = addRent();
    expect(bill).toMatchObject(rent);
    expect(bill.id).toEqual(expect.any(String));
  });

  it("generates due occurrences, and generating again adds nothing", () => {
    const bill = addRent();
    store.getState().generateDue("2025-03-31");
    expect(occurrencesOf(bill.id).map((o) => o.dueDate)).toEqual([
      "2025-01-31",
      "2025-02-28",
      "2025-03-31",
    ]);

    const before = store.getState().occurrences;
    store.getState().generateDue("2025-03-31");
    expect(store.getState().occurrences).toBe(before);
  });

  it("applies an amount change only to occurrences generated afterwards", () => {
    const bill = addRent();
    store.getState().generateDue("2025-02-28");
    store.getState().updateBill(bill.id, { amount: 1200 });
    store.getState().generateDue("2025-03-31");

    expect(occurrencesOf(bill.id).map((o) => o.amount)).toEqual([1000, 1000, 1200]);
  });

  it("re-anchors a cadence change at the last generated occurrence", () => {
    const bill = addRent();
    store.getState().generateDue("2025-02-28");
    store.getState().updateBill(bill.id, { cadence: "weekly" });

    const updated = store.getState().bills.find((b) => b.id === bill.id)!;
    expect(updated.anchorDate).toBe("2025-02-28");

    store.getState().generateDue("2025-03-14");
    expect(occurrencesOf(bill.id).map((o) => o.dueDate)).toEqual([
      "2025-01-31",
      "2025-02-28",
      "2025-03-07",
      "2025-03-14",
    ]);
  });

  it("keeps the anchor on a cadence change before anything was generated", () => {
    const bill = addRent();
    store.getState().updateBill(bill.id, { cadence: "quarterly" });
    expect(store.getState().bills.find((b) => b.id === bill.id)!.anchorDate).toBe(
      "2025-01-31"
    );
  });

  it("marks an occurrence paid with exactly one linked expense transaction", () => {
    const bill = addRent();
    store.getState().generateDue("2025-01-31");
    const [occurrence] = occurrencesOf(bill.id);
    const transactionsBefore = store.getState().transactions.length;

    store.getState().markPaid(occurrence.id, "2025-02-02");
    store.getState().markPaid(occurrence.id, "2025-02-03"); // second call is a no-op

    const transactions = store.getState().transactions;
    expect(transactions).toHaveLength(transactionsBefore + 1);
    const payment = transactions.at(-1)!;
    expect(payment).toMatchObject({
      name: "Rent",
      category: "Bills",
      amount: 1000,
      type: "Expense",
    });
    expect(toLocalDate(payment.date)).toBe("2025-02-02");
    expect(occurrencesOf(bill.id)[0].transactionId).toBe(payment.id);
  });

  it("deletes a bill and its occurrences but keeps payment transactions", () => {
    const bill = addRent();
    store.getState().generateDue("2025-02-28");
    const [first] = occurrencesOf(bill.id);
    store.getState().markPaid(first.id, "2025-01-31");
    const transactions = store.getState().transactions;

    store.getState().deleteBill(bill.id);

    expect(store.getState().bills.find((b) => b.id === bill.id)).toBeUndefined();
    expect(occurrencesOf(bill.id)).toEqual([]);
    expect(store.getState().transactions).toEqual(transactions);
  });
});

describe("migrateStore v1 -> v2", () => {
  const recurringTx = {
    id: "tx-1",
    name: "Urban Services Hub",
    category: "General",
    amount: 65,
    date: new Date(2025, 7, 17, 21, 8).toISOString(),
    recurring: true,
    type: "Expense" as const,
    avatar: "./assets/images/avatars/urban-services-hub.jpg",
  };

  it("turns recurring transactions into monthly bills paid by that transaction", () => {
    const migrated = migrateStore(
      { transactions: [recurringTx, { ...recurringTx, id: "tx-2", recurring: false }] },
      1,
      "2026-10-07"
    );

    expect(migrated.bills).toEqual([
      {
        id: expect.any(String),
        name: "Urban Services Hub",
        category: "General",
        amount: 65,
        cadence: "monthly",
        // Next monthly date after the upgrade, not the old transaction's date:
        // these were never bills before, so there's no backlog to catch up.
        anchorDate: "2026-10-17",
        avatar: recurringTx.avatar,
      },
    ]);
    expect(migrated.occurrences).toEqual([
      {
        id: expect.any(String),
        billId: migrated.bills[0].id,
        dueDate: "2025-08-17",
        amount: 65,
        transactionId: "tx-1",
      },
    ]);
    // Nothing is lost: the transactions themselves are untouched.
    expect(migrated.transactions).toHaveLength(2);
  });

  it("creates no overdue backlog when upgrading long after the transaction", () => {
    const today = "2026-10-07";
    const migrated = migrateStore({ transactions: [recurringTx] }, 1, today);
    const upgraded = makeStore();
    upgraded.setState({
      transactions: migrated.transactions,
      bills: migrated.bills,
      occurrences: migrated.occurrences,
    });

    upgraded.getState().generateDue(today);

    const [row] = getBillRows(
      upgraded.getState().bills,
      upgraded.getState().occurrences,
      today
    );
    expect(row.unpaid).toEqual([]);
    expect(row.status).toBe("paid");
    expect(row.dueDate).toBe("2026-10-17");
  });

  it("gives v1 data without transactions empty bills", () => {
    const migrated = migrateStore({ pots: [] }, 1);
    expect(migrated.bills).toEqual([]);
    expect(migrated.occurrences).toEqual([]);
  });

  it("chains from v0: themes become hex and bills are created", () => {
    const migrated = migrateStore(
      {
        budgets: [{ category: "Bills", maximum: 10, theme: "Navy Grey" }],
        transactions: [recurringTx],
      },
      0
    );
    expect(migrated.budgets[0].theme).toBe("#97A0AC");
    expect(migrated.bills).toHaveLength(1);
  });
});

describe("demo bill seed", () => {
  const today = "2025-06-15";

  it("shows a paid, an overdue and a due-soon bill on first run", () => {
    const seed = createBillSeed(today);
    const seeded = createStore<BoundStoreT>()((...a) => ({
      ...createAuthSlice(...a),
      ...createTransactionSlice(...a),
      ...createBudgetSlice(...a),
      ...createPotSlice(...a),
      ...createBillSlice(...a),
    }));
    seeded.setState({
      bills: seed.bills,
      occurrences: seed.occurrences,
      transactions: seed.payments,
    });

    seeded.getState().generateDue(today);
    const { bills, occurrences, transactions } = seeded.getState();
    const statuses = occurrences.map((o) => occurrenceStatus(o, today));

    expect(statuses).toContain("paid");
    expect(statuses).toContain("overdue");
    expect(bills.some((bill) => isDueSoon(nextDueDate(bill, today), today))).toBe(true);

    // The paid occurrence links to a real payment transaction.
    const paid = occurrences.find((o) => o.transactionId)!;
    expect(transactions.some((t) => t.id === paid.transactionId)).toBe(true);
  });
});

describe("hydrateStore", () => {
  it("loads saved data at most once, however often it's called", async () => {
    // No IndexedDB in Node: the adapter falls back to memory and warns.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const first = hydrateStore();
    expect(hydrateStore()).toBe(first);
    await first;
    warn.mockRestore();
  });
});
