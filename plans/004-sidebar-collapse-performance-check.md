# 004 — Measure the sidebar collapse on a slow CPU (refactor only on evidence)

- **Status**: DONE (pass)
- **Commit**: 5e8f960 + uncommitted working-tree changes as of 2026-10-07 (the code excerpts below are the source of truth; if they don't match, STOP)
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: measurement only; 1 temporary script (deleted afterwards). No source changes unless the user decides after Step 3.

## Problem

Collapsing or expanding the desktop sidebar animates layout properties, so the
browser re-lays-out the whole page on every frame of the 300ms motion:

```ts
/* src/utils/constants.ts:39-40 — current */
export const SIDEBAR_COLLAPSE =
  "transition-[width,margin-left,padding-left,transform] duration-300 ease-in-out-strong motion-reduce:transition-none";
```

```tsx
/* src/components/layout/main-layout.tsx:31-36 — current: the page content's left margin animates */
<main
  className={cn(
    "w-full min-h-screen p-4 sm:p-10 mb-[80px] lg:mb-0",
    isSidebarExpanded ? "lg:ml-[300px]" : "lg:ml-[88px]",
    SIDEBAR_COLLAPSE
  )}
>
```

At full speed on a fast development machine this measured **0 dropped frames**
(every frame ~17ms on the Overview page). It has not been measured on a slow
device. The motion rules prefer animating only `transform` and `opacity`, but
every transform-only alternative here changes the layout model and makes the
page content move in one visible jump at one end of the motion. That is a
product trade-off, so this plan **measures first and stops for a decision**
rather than refactoring blindly.

## Target

A measured answer: with the CPU slowed 4× and 6×, how many frames during the
collapse and the expand take longer than 33ms (below 30fps), on the three
heaviest pages (Overview, Budgets, Transactions) at 1440×900.

Decision rule:
- **Pass** (no source change): at 4× slowdown, at most 2 frames over 33ms per
  collapse or expand on every page. Mark this plan DONE with the numbers.
- **Fail**: anything worse. STOP, record the numbers in this file under
  "Results", and report to the user. Do not refactor without their decision.

## Repo conventions to follow

- Browser checks use Playwright (`@playwright/test`) with the local Chrome
  (`channel: "chrome"`), configured in `playwright.config.ts`, which starts its
  own dev server on port 3100 with `NEXT_DIST_DIR=.next-e2e`.
- Existing specs sign in with the demo button, e.g. `e2e/feedback.spec.ts:3-8`:
  ```ts
  await page.goto("/login");
  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.waitForURL("/");
  ```
- The sidebar toggle's accessible names are "Minimize Menu" (expanded) and
  "Expand Menu" (collapsed).

## Steps

1. Create a temporary spec `e2e/_sidebar-perf.spec.ts`:
   ```ts
   import { test } from "@playwright/test";

   for (const rate of [4, 6]) {
     for (const path of ["/", "/budgets", "/transactions"]) {
       test(`sidebar ${path} at ${rate}x`, async ({ page }) => {
         await page.setViewportSize({ width: 1440, height: 900 });
         await page.goto("/login");
         await page.getByRole("button", { name: "Try the demo" }).click();
         await page.waitForURL("/");
         await page.goto(path);
         await page.getByRole("heading", { level: 1 }).waitFor();
         await page.waitForTimeout(1500);

         const cdp = await page.context().newCDPSession(page);
         await cdp.send("Emulation.setCPUThrottlingRate", { rate });

         const measure = async (button: string) => {
           await page.evaluate(() => {
             (window as any).__f = [];
             let last = performance.now();
             const tick = (t: number) => {
               (window as any).__f.push(t - last);
               last = t;
               if ((window as any).__f.length < 40) requestAnimationFrame(tick);
             };
             requestAnimationFrame(tick);
           });
           await page.getByRole("button", { name: button }).click();
           await page.waitForTimeout(2000);
           const frames: number[] = await page.evaluate(() => (window as any).__f);
           const slow = frames.filter((f) => f > 33).length;
           console.log(`${path} ${rate}x ${button}: frames>33ms=${slow} max=${Math.round(Math.max(...frames))}ms`);
         };

         await measure("Minimize Menu");
         await measure("Expand Menu");
       });
     }
   }
   ```
2. Run it: `npx playwright test e2e/_sidebar-perf.spec.ts --workers=1` and copy
   the printed lines.
3. Delete `e2e/_sidebar-perf.spec.ts`.
4. Add a `## Results` section to the end of this plan file with the printed
   lines, the date, and the machine (from `sysctl -n machdep.cpu.brand_string`
   on macOS). Then apply the decision rule from **Target**: set **Status** to
   `DONE (pass)` or `BLOCKED (needs decision)`.

## Boundaries

- Do NOT modify any file under `src/`.
- Do NOT commit the temporary spec.
- Do NOT add dependencies.
- If the toggle names or class strings differ from the excerpts, STOP and report.

## Verification

- **Mechanical**: the temporary spec no longer exists (`ls e2e/`), and
  `git status` shows only this plan file changed.
- **Feel check** (optional, recommended): in Chrome DevTools → Performance →
  CPU 4× slowdown, record a collapse on Overview, and confirm the frames chart
  shows no long red frames during the 300ms motion; visually, the sidebar should
  not stutter.
- **Done when**: Results are recorded and the Status reflects the decision rule.

## Results

Measured 2026-10-07 on an Apple M1 (headless Chrome via Playwright), after the
Tailwind content-glob fix recorded in plan 002, so the content's `margin-left`
genuinely animates during these runs (an earlier full-speed measurement did not
include it):

```
/ 4x Minimize Menu: frames>33ms=0 max=17ms
/ 4x Expand Menu: frames>33ms=0 max=17ms
/budgets 4x Minimize Menu: frames>33ms=0 max=17ms
/budgets 4x Expand Menu: frames>33ms=0 max=17ms
/transactions 4x Minimize Menu: frames>33ms=0 max=17ms
/transactions 4x Expand Menu: frames>33ms=0 max=17ms
/ 6x Minimize Menu: frames>33ms=0 max=17ms
/ 6x Expand Menu: frames>33ms=0 max=17ms
/budgets 6x Minimize Menu: frames>33ms=0 max=17ms
/budgets 6x Expand Menu: frames>33ms=0 max=17ms
/transactions 6x Minimize Menu: frames>33ms=0 max=17ms
/transactions 6x Expand Menu: frames>33ms=0 max=17ms
```

Decision rule: at most 2 frames over 33ms at 4× → **pass**, even at 6×. No
source change. The temporary spec was deleted. CPU throttling in Chrome
approximates a slower device but isn't one; a check on a real low-end phone or
laptop is the remaining caveat.
