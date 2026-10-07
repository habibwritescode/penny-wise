import { expect, test, type Page } from "@playwright/test";

const PAGES = ["/", "/transactions", "/budgets", "/pots", "/recurring-bills"];
const WIDTHS = [375, 640, 768, 1024, 1280];

const signInAsDemo = async (page: Page) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.waitForURL("/");
};

const horizontalOverflow = (page: Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await signInAsDemo(page);

    for (const path of PAGES) {
      await page.goto(path);
      await page.getByRole("heading", { level: 1 }).waitFor();
      expect(await horizontalOverflow(page), `${path} at ${width}px`).toBe(0);
    }
  });
}

test("auth pages fit on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ["/login", "/sign-up"]) {
    await page.goto(path);
    await page.getByRole("heading", { level: 1 }).waitFor();
    expect(await horizontalOverflow(page), path).toBe(0);
  }
});

test("tall dialogs stay on screen on a short phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 568 });
  await signInAsDemo(page);
  await page.goto("/transactions");
  await page.getByRole("button", { name: "Add Transaction" }).click();

  // On phones it's a bottom sheet that slides up, so wait for it to settle.
  const dialog = page.getByRole("dialog");
  await expect
    .poll(async () => {
      const box = await dialog.boundingBox();
      return box && Math.round(box.y + box.height);
    })
    .toBe(568);
  expect((await dialog.boundingBox())!.y).toBeGreaterThanOrEqual(0);
});

test("forms open as a bottom sheet on phones and a dialog on larger screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await signInAsDemo(page);
  await page.goto("/pots");
  await page.getByRole("button", { name: "Add New Pot" }).click();
  const sheet = page.getByRole("dialog", { name: "Add New Pot" });
  await expect(sheet).toHaveAttribute("data-vaul-drawer", "");
  await sheet.getByRole("button", { name: "Close" }).click();
  await expect(sheet).toBeHidden();

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.getByRole("button", { name: "Add New Pot" }).click();
  const dialog = page.getByRole("dialog", { name: "Add New Pot" });
  await expect(dialog).toBeVisible();
  await expect(dialog).not.toHaveAttribute("data-vaul-drawer", "");
});

test("every page has exactly one main landmark", async ({ page }) => {
  for (const path of ["/login", "/sign-up"]) {
    await page.goto(path);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await expect(page.getByRole("main"), path).toHaveCount(1);
  }
  await signInAsDemo(page);
  for (const path of PAGES) {
    await page.goto(path);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await expect(page.getByRole("main"), path).toHaveCount(1);
  }
});

test("tables fit narrow phones without scrolling sideways", async ({ page }) => {
  await signInAsDemo(page);
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 });
    for (const path of ["/transactions", "/recurring-bills"]) {
      await page.goto(path);
      await page.getByRole("heading", { level: 1 }).waitFor();
      const overflow = await page.evaluate(() => {
        const wrapper = document.querySelector("table")!.parentElement!;
        return wrapper.scrollWidth - wrapper.clientWidth;
      });
      expect(overflow, `${path} at ${width}px`).toBe(0);
    }
  }
});

test("the sidebar starts collapsed on small laptops and expanded on wide screens", async ({
  page,
}) => {
  const sidebarWidth = () =>
    page
      .getByRole("complementary")
      .evaluate((aside) => Math.round(aside.getBoundingClientRect().width));

  await page.setViewportSize({ width: 1440, height: 900 });
  await signInAsDemo(page);
  await expect(page.getByRole("button", { name: "Minimize Menu" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );
  expect(await sidebarWidth()).toBe(300);

  await page.setViewportSize({ width: 1024, height: 768 });
  const expand = page.getByRole("button", { name: "Expand Menu" });
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expect.poll(sidebarWidth).toBe(88);

  // Choosing a width overrides the breakpoint.
  await expand.click();
  await expect(page.getByRole("button", { name: "Minimize Menu" })).toBeVisible();
  await expect.poll(sidebarWidth).toBe(300);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Minimize Menu" }).click();
  await expect.poll(sidebarWidth).toBe(88);
});

test("the collapsed sidebar names its icons in tooltips", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await signInAsDemo(page);
  const sidebar = page.getByRole("complementary");

  await sidebar.getByRole("link", { name: "Budgets" }).hover();
  await expect(page.getByRole("tooltip", { name: "Budgets" })).toBeVisible();
  // Glide down like a real pointer: a one-step jump lands inside Radix's
  // "moving toward the open tooltip" grace area, which keeps Budgets open.
  const pots = (await sidebar.getByRole("link", { name: "Pots" }).boundingBox())!;
  await page.mouse.move(pots.x + pots.width / 2, pots.y + pots.height / 2, { steps: 8 });
  await expect(page.getByRole("tooltip", { name: "Pots" })).toBeVisible();

  // Expanded, the labels are visible, so no tooltips.
  await sidebar.getByRole("button", { name: "Expand Menu" }).click();
  await sidebar.getByRole("link", { name: "Budgets" }).hover();
  await page.waitForTimeout(800);
  await expect(page.getByRole("tooltip")).toHaveCount(0);
});
