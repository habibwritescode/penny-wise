import { beforeEach, describe, expect, it } from "vitest";
import { createStore } from "zustand/vanilla";

import type { BoundStoreT } from "@/lib/store/store";
import { migrateStore } from "@/lib/store/store";
import createAuthSlice from "@/lib/store/slices/auth";
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
