import { expect, test, type Page } from "@playwright/test";

// A fixed "today" so the demo bills (dated relative to the first visit) are
// predictable: Aqua Flow Utilities is due 3 days earlier and unpaid.
const TODAY = new Date(2026, 9, 7, 9, 0);

const signInAsDemo = async (page: Page) => {
  await page.clock.install({ time: TODAY });
  await page.goto("/login");
  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.waitForURL("/");
};

const billRow = (page: Page, name: string) =>
  page.getByRole("row").filter({ hasText: name });

test("an overdue bill is clearly shown and can be marked as paid", async ({
  page,
}) => {
  await signInAsDemo(page);

  // Overview: the overdue line appears on the Recurring Bills card.
  const overviewCard = page.getByRole("region", { name: "Recurring Bills" });
  await expect(overviewCard.getByText("Overdue")).toBeVisible();
  await expect(overviewCard).toContainText("$85.50");

  // Recurring Bills page: in the "Needs paying" panel and badged in the table.
  await page.goto("/recurring-bills");
  const panel = page.getByRole("region", { name: "Needs paying" });
  await expect(panel).toContainText("Aqua Flow Utilities");
  await expect(panel).toContainText("Due 4 Oct 2026");
  await expect(billRow(page, "Aqua Flow Utilities")).toContainText("Overdue");
  await expect(billRow(page, "Spark Electric Solutions")).toContainText("Paid");

  // Pay it, then undo from the toast: the bill is due again.
  const payButton = panel.getByRole("button", {
    name: "Mark Aqua Flow Utilities as paid",
  });
  await payButton.click();
  const toast = page
    .locator("[data-sonner-toast]")
    .filter({ hasText: "Aqua Flow Utilities marked as paid" });
  await expect(toast).toBeVisible();
  await toast.getByRole("button", { name: "Undo" }).click();
  await expect(panel).toContainText("Aqua Flow Utilities");
  await expect(billRow(page, "Aqua Flow Utilities")).toContainText("Overdue");

  // Pay it for real.
  await payButton.click();
  await expect(panel).toHaveCount(0);
  await expect(billRow(page, "Aqua Flow Utilities")).toContainText("Paid");

  // Exactly one matching expense transaction was created.
  await page.goto("/transactions");
  const payments = page.getByRole("row").filter({ hasText: "Aqua Flow Utilities" });
  await expect(payments).toHaveCount(1);
  await expect(payments).toContainText("-$85.50");

  // And the overview no longer shows anything overdue.
  await page.goto("/");
  await expect(overviewCard.getByText("Overdue")).toHaveCount(0);
});

test("a bill can be added, edited without rewriting history, and deleted", async ({
  page,
}) => {
  await signInAsDemo(page);
  await page.goto("/recurring-bills");

  // Add a monthly bill due today (the date picker defaults to today).
  await page.getByRole("button", { name: "Add New Bill" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Bill Name").fill("Gym Membership");
  await dialog.getByLabel("Category").click();
  await page.getByRole("option", { name: "Lifestyle" }).click();
  await dialog.getByLabel("Amount").fill("30");
  await dialog.getByLabel("Repeats").click();
  await page.getByRole("option", { name: "Monthly" }).click();

  // The next due date can't be in the past (it would invent overdue bills).
  await dialog.getByLabel("Next Due Date").click();
  const calendar = page.getByRole("grid");
  await expect(calendar.getByRole("gridcell", { name: "6", exact: true })).toBeDisabled();
  await expect(calendar.getByRole("gridcell", { name: "7", exact: true })).toBeEnabled();
  // Toggle the calendar closed (Escape would close the whole dialog).
  await dialog.getByLabel("Next Due Date").click();
  await expect(calendar).toHaveCount(0);

  await dialog.getByRole("button", { name: "Add Bill" }).click();
  await expect(dialog).toHaveCount(0);

  const row = billRow(page, "Gym Membership");
  await expect(row).toContainText("Monthly · 7 Oct 2026");
  await expect(row).toContainText("Due today");
  const panel = page.getByRole("region", { name: "Needs paying" });
  await expect(panel.getByRole("listitem").filter({ hasText: "Gym Membership" })).toContainText(
    "$30.00"
  );

  // Edit the amount: the bill changes, the occurrence already due does not.
  await row.getByRole("button", { name: "Actions for Gym Membership" }).click();
  await page.getByRole("menuitem", { name: "Edit Bill" }).click();
  await expect(dialog.getByLabel("Bill Name")).toHaveValue("Gym Membership");
  await dialog.getByLabel("Amount").fill("35");
  await dialog.getByRole("button", { name: "Save Changes" }).click();
  await expect(dialog).toHaveCount(0);

  await expect(row).toContainText("$35.00");
  await expect(panel.getByRole("listitem").filter({ hasText: "Gym Membership" })).toContainText(
    "$30.00"
  );

  // Delete it, undo from the toast, then delete it for good.
  const deleteGym = async () => {
    await row.getByRole("button", { name: "Actions for Gym Membership" }).click();
    await page.getByRole("menuitem", { name: "Delete Bill" }).click();
    await page.getByRole("button", { name: "Yes, Confirm Deletion" }).click();
    await expect(row).toHaveCount(0);
  };
  await deleteGym();
  await page
    .locator("[data-sonner-toast]")
    .filter({ hasText: "Gym Membership deleted" })
    .getByRole("button", { name: "Undo" })
    .click();
  await expect(row).toContainText("$35.00");

  await deleteGym();
  await expect(panel.getByText("Gym Membership")).toHaveCount(0);
});

test("reopening the app after a due date shows the new bill without re-adding it", async ({
  page,
}) => {
  await signInAsDemo(page);
  await page.goto("/recurring-bills");
  const panel = page.getByRole("region", { name: "Needs paying" });
  await expect(panel).not.toContainText("Pixel Playground"); // due in 3 days

  // Four days later the user comes back.
  await page.clock.setSystemTime(new Date(2026, 9, 11, 9, 0));
  await page.reload();

  await expect(panel).toContainText("Pixel Playground");
  await expect(billRow(page, "Pixel Playground")).toContainText("Overdue");
});
