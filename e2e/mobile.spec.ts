import { expect, test, type Page } from "@playwright/test";

// Platform-layer details that make the app feel native on phones. What only a
// real device can show (safe areas, tap delay, keyboards) isn't testable here;
// these lock in the tags and attributes that drive it.

test.use({ viewport: { width: 375, height: 812 } });

const signInAsDemo = async (page: Page) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.waitForURL("/");
};

const themeColors = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll('meta[name="theme-color"]')).map((meta) => ({
      color: meta.getAttribute("content"),
      media: meta.getAttribute("media"),
    }))
  );

test("viewport allows safe areas without moving the bottom nav for the keyboard", async ({
  page,
}) => {
  await page.goto("/login");
  const viewport = await page
    .locator('meta[name="viewport"]')
    .getAttribute("content");
  expect(viewport).toContain("viewport-fit=cover");
  expect(viewport).not.toContain("interactive-widget");
  expect(viewport).not.toContain("user-scalable=no");
});

test("browser chrome matches the top of each page", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Try the demo" }).waitFor();
  expect(await themeColors(page)).toContainEqual({
    color: "#201F24",
    media: "(max-width: 1023px)",
  });

  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.waitForURL("/");
  await page.getByRole("heading", { name: "Overview" }).waitFor();
  expect(await themeColors(page)).toEqual([{ color: "#F8F4F0", media: null }]);
});

test("login fields get the right keyboard and autofill, and the app's own errors", async ({
  page,
}) => {
  await page.goto("/login");
  const email = page.getByLabel("Email");
  await expect(email).toHaveAttribute("type", "email");
  await expect(email).toHaveAttribute("autocapitalize", "none");
  await expect(email).toHaveAttribute("autocomplete", "email");
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "autocomplete",
    "current-password"
  );

  // The browser doesn't block submission with its own bubble: zod's message shows.
  await email.fill("not-an-email");
  await page.getByLabel("Password", { exact: true }).fill("secret");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Invalid email")).toBeVisible();
});

test("amounts open a decimal pad and accept cents", async ({ page }) => {
  await signInAsDemo(page);
  await page.goto("/pots");
  await page
    .getByRole("article", { name: "Savings" })
    .getByRole("button", { name: "+ Add Money" })
    .click();

  const amount = page.getByLabel("Amount to Add");
  await expect(amount).toHaveAttribute("inputmode", "decimal");
  await amount.fill("12.50");
  expect(await amount.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(
    true
  );
});

test("full-height layouts keep a 100vh fallback for browsers without dvh", async ({
  page,
}) => {
  await signInAsDemo(page);
  const content = page.getByRole("main");
  await expect(content).toHaveClass(/(^|\s)min-h-screen(\s|$)/);
  await expect(content).toHaveClass(/supports-\[min-height:100dvh\]:min-h-dvh/);
});
