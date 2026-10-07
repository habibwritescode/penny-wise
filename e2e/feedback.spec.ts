import { expect, test, type Page } from "@playwright/test";

const signInAsDemo = async (page: Page) => {
  await page.clock.install({ time: new Date(2026, 9, 7, 9, 0) });
  await page.goto("/login");
  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.waitForURL("/");
};

const toast = (page: Page, text: string) =>
  page.locator("[data-sonner-toast]").filter({ hasText: text });

test("adding money is confirmed and can be undone", async ({ page }) => {
  await signInAsDemo(page);
  await page.goto("/pots");
  const savings = page.getByRole("article", { name: "Savings" });

  await savings.getByRole("button", { name: "+ Add Money" }).click();
  await page.getByLabel("Amount to Add").fill("10");
  await page.getByRole("button", { name: "Confirm Addition" }).click();
  await expect(savings).toContainText("$169.00");

  await toast(page, "Added $10.00 to Savings").getByRole("button", { name: "Undo" }).click();
  await expect(savings).toContainText("$159.00");
});

test("reaching a savings goal is celebrated once", async ({ page }) => {
  await signInAsDemo(page);
  await page.goto("/pots");
  const concert = page.getByRole("article", { name: "Concert Ticket" });
  await expect(concert.getByText("Goal reached")).toHaveCount(0);

  // $110 of $150: adding $40 crosses the target.
  await concert.getByRole("button", { name: "+ Add Money" }).click();
  await page.getByLabel("Amount to Add").fill("40");
  await page.getByRole("button", { name: "Confirm Addition" }).click();

  await expect(toast(page, "Savings goal reached")).toBeVisible();
  const badge = concert.getByText("Goal reached");
  await expect(badge).toBeVisible();
  await expect(badge).toHaveClass(/enter-pop/);

  // On a later visit the badge is simply there: no celebration on page load.
  await page.reload();
  const badgeAfterReload = page
    .getByRole("article", { name: "Concert Ticket" })
    .getByText("Goal reached");
  await expect(badgeAfterReload).toBeVisible();
  await expect(badgeAfterReload).not.toHaveClass(/enter-pop/);
});

test("deleting a budget can be undone, back in its original place", async ({
  page,
}) => {
  await signInAsDemo(page);
  await page.goto("/budgets");
  // Budget card titles (the summary card has a level-3 heading too).
  const headings = page
    .getByRole("heading", { level: 3 })
    .filter({ hasNotText: "Spending Summary" });
  await headings.first().waitFor();
  const before = await headings.allTextContents();

  await page.getByRole("button", { name: "Actions" }).first().click();
  await page.getByRole("menuitem", { name: "Delete Budget" }).click();
  await page.getByRole("button", { name: "Yes, Confirm Deletion" }).click();
  await expect(headings).toHaveCount(before.length - 1);

  await toast(page, `${before[0]} budget deleted`)
    .getByRole("button", { name: "Undo" })
    .click();
  await expect(headings).toHaveText(before);
});

test("new cards animate in, existing ones don't", async ({ page }) => {
  await signInAsDemo(page);
  await page.goto("/pots");
  const savings = page.getByRole("article", { name: "Savings" });
  await expect(savings).not.toHaveClass(/enter-fade-scale/);

  await page.getByRole("button", { name: "+ Add New Pot" }).click();
  await page.getByLabel("Pot Name").fill("Holiday");
  await page.getByLabel("Target").fill("500");
  await page.getByLabel("Theme").click();
  await page.getByRole("option", { name: "Red" }).click();
  await page.getByRole("button", { name: "Add Pot" }).click();

  await expect(toast(page, "Holiday created")).toBeVisible();
  await expect(page.getByRole("article", { name: "Holiday" })).toHaveClass(
    /enter-fade-scale/
  );
});

test("validation messages and new transactions give feedback", async ({
  page,
}) => {
  await signInAsDemo(page);
  await page.goto("/transactions");
  await page.getByRole("button", { name: "+ Add Transaction" }).click();
  const dialog = page.getByRole("dialog");

  // Submitting empty: messages appear (with their entrance).
  await dialog.getByRole("button", { name: "Add Transaction" }).click();
  const required = dialog.getByText("Required").first();
  await expect(required).toBeVisible();
  await expect(required).toHaveClass(/enter-message/);

  await dialog.getByLabel("Name of Recipient/Sender").fill("Corner Shop");
  await dialog.getByLabel("Amount").fill("12.50");
  await dialog.getByLabel("Type").click();
  await page.getByRole("option", { name: "Expense" }).click();
  await dialog.getByLabel("Category").click();
  await page.getByRole("option", { name: "Groceries" }).click();
  await dialog.getByRole("button", { name: "Add Transaction" }).click();

  await expect(toast(page, "Transaction added")).toContainText(
    "Corner Shop · -$12.50"
  );
});

// Radix overlays only stack correctly when they share one copy of
// @radix-ui/react-dismissable-layer; mismatched versions close both at once.
for (const width of [375, 1024]) {
  test(`Escape closes an open select, not the whole form (${width}px)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await signInAsDemo(page);
    await page.goto("/transactions");
    await page.getByRole("button", { name: "Add Transaction" }).click();
    const form = page.getByRole("dialog", { name: "Add Transaction" });

    await form.getByRole("combobox").first().click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(form).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(form).toBeHidden();
  });
}
