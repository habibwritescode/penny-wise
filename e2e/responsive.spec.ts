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
  await page.getByRole("button", { name: "+ Add Transaction" }).click();

  const box = await page.getByRole("dialog").boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(568);
});
