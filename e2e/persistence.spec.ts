import { expect, test, type Page } from "@playwright/test";

const signInAsDemo = async (page: Page) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.waitForURL("/");
};

// Reads the persisted store straight from IndexedDB, bypassing the app.
const readIndexedDbStore = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<string | null>((resolve, reject) => {
        const open = indexedDB.open("penny-wise");
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          if (!db.objectStoreNames.contains("state")) return resolve(null);
          const get = db
            .transaction("state")
            .objectStore("state")
            .get("client-store");
          get.onsuccess = () => resolve(get.result ?? null);
        };
      })
  );

test("data survives a reload via IndexedDB", async ({ page }) => {
  await signInAsDemo(page);
  await page.goto("/pots");

  const savings = page.getByRole("article", { name: "Savings" });
  await savings.getByRole("button", { name: "+ Add Money" }).click();
  await page.getByLabel("Amount to Add").fill("10");
  await page.getByRole("button", { name: "Confirm Addition" }).click();
  await expect(savings).toContainText("$169.00");

  await page.reload();
  await expect(page.getByRole("article", { name: "Savings" })).toContainText(
    "$169.00"
  );

  // It's IndexedDB holding the data, not localStorage.
  expect(await readIndexedDbStore(page)).toContain('"total":169');
  expect(
    await page.evaluate(() => localStorage.getItem("client-store"))
  ).toBeNull();
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("existing localStorage data is moved into IndexedDB", async ({ page }) => {
  const legacy = JSON.stringify({
    state: {
      user: { name: "Returning User", email: "returning@example.com" },
      pots: [{ name: "Holiday Fund", target: 500, total: 42, theme: "#277C78" }],
    },
    version: 1,
  });
  // Seed the old storage before any app code runs, as an existing visitor would have.
  await page.addInitScript((value) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("client-store", value);
      sessionStorage.setItem("seeded", "1");
    }
  }, legacy);

  await page.goto("/pots");
  await expect(page.getByText("Holiday Fund")).toBeVisible();

  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("client-store")))
    .toBeNull();
  expect(await readIndexedDbStore(page)).toContain("Holiday Fund");
});

test("shows a banner and keeps working when IndexedDB is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = () => {
      throw new DOMException("IndexedDB disabled", "InvalidStateError");
    };
  });
  // Phone size from the start (resizing mid-test would catch the layout's
  // margin transition part-way through).
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto("/login");
  const banner = page.getByRole("status");
  await expect(banner).toContainText("Changes won't be saved");

  // The app still works for the session.
  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.waitForURL("/");
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(banner).toBeVisible();

  // On a phone it sits above the bottom nav without causing sideways scroll.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(overflow).toBe(0);
  const bannerBox = await banner.boundingBox();
  const navBox = await page
    .getByRole("link", { name: "Overview" })
    .last()
    .boundingBox();
  expect(bannerBox!.y + bannerBox!.height).toBeLessThanOrEqual(navBox!.y);
});

test("corrupted saved data shows a way out instead of a blank page", async ({
  page,
}) => {
  await signInAsDemo(page);
  await expect.poll(() => readIndexedDbStore(page)).not.toBeNull();

  // Corrupt one bill's date directly in IndexedDB, then reopen the app.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const open = indexedDB.open("penny-wise");
        open.onsuccess = () => {
          const store = open.result
            .transaction("state", "readwrite")
            .objectStore("state");
          const get = store.get("client-store");
          get.onsuccess = () => {
            const saved = JSON.parse(get.result);
            saved.state.bills[0].anchorDate = "not-a-date";
            store.put(JSON.stringify(saved), "client-store").onsuccess = () =>
              resolve();
          };
        };
      })
  );
  await page.reload();

  const alert = page.getByRole("alert").filter({ hasText: "Something went wrong" });
  await expect(alert).toBeVisible();

  // Resetting deletes everything, so it asks first; Cancel backs out.
  // dispatchEvent: in dev, Next's error overlay (<nextjs-portal>) covers the
  // page shortly after a caught error and would intercept real clicks. It
  // doesn't exist in production builds.
  const press = (name: string) =>
    alert.getByRole("button", { name }).dispatchEvent("click");
  await press("Reset demo data");
  await press("Cancel");
  await expect(alert.getByRole("button", { name: "Reload" })).toBeVisible();
  await press("Reset demo data");
  await expect(alert).toContainText("Delete everything saved in this browser?");
  await press("Yes, reset");
  // Saved data (including the sign-in) is gone: back to a fresh start.
  await page.waitForURL("/login");
  await expect(page.getByRole("button", { name: "Try the demo" })).toBeVisible();
});
