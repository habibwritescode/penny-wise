# Pennywise

A personal finance app for tracking transactions, budgets, savings pots and
recurring bills. It runs entirely in the browser: there's no backend, and your
data stays on your device.

**Live demo:** [penny-wise-fawn.vercel.app](https://penny-wise-fawn.vercel.app)
(click **Try the demo**; any email and password also work).

## Where this came from

Pennywise started as the **"Personal finance app" challenge from
[Frontend Mentor](https://www.frontendmentor.io/challenges)**. The challenge
supplies the design and a sample dataset; the core screens (overview,
transactions, budgets, pots and recurring bills) follow that brief.

Built beyond the brief:

- **Recurring-bill automation.** Bills are real entities with a cadence
  (weekly, every 2 weeks, monthly, quarterly, yearly). Each due date
  generates a bill to pay, overdue bills are flagged and listed under
  "Needs paying", and marking one paid records the matching expense.
  Missed bills are caught up when you come back to the app.
- **Real persistence in IndexedDB**, with a one-time move of older
  localStorage data and an in-memory fallback (with a visible warning) when
  storage is unavailable, e.g. in some private-browsing modes.
- **Demo sign-in** with a route guard, so the app behaves like a signed-in
  product without pretending to be secure (see Limitations).
- **Undo for every change you might regret.** Deleting a pot, budget or
  bill, marking a bill paid, and adding or withdrawing money each show a
  toast with Undo, which puts things back exactly where they were.
- **Motion with a purpose.** Things that appear, disappear or change state
  during a visit animate briefly (100–300ms, strong ease-out curves defined
  once as CSS variables): cards fading out on delete, panels expanding,
  dialogs and toasts, press feedback on buttons. Nothing animates on page
  load, and with Reduce Motion on, movement becomes a fade.
- **Feels native on phones.** Forms open as bottom sheets you can drag
  closed; the layout clears the notch and home indicator; the browser's
  toolbar colour matches each page; taps respond immediately without a grey
  flash or a stuck hover state; amount fields open a decimal keypad and
  email fields don't auto-capitalise. What can only be confirmed on a real
  phone is listed in [docs/device-testing.md](docs/device-testing.md).
- **Responsive and accessibility work** beyond the provided designs: tested
  layouts from 320px to desktop, a sidebar that starts collapsed on smaller
  laptops (with tooltips naming its icons), labelled form fields and
  icon-only nav links, and statuses that don't rely on colour alone.
- **Tests**: unit tests for the money, date and persistence logic, plus
  browser tests for the main flows and layouts.

## Features

- **Overview**: balance, income and expenses, with summaries of pots,
  recent transactions, budgets and recurring bills.
- **Transactions**: search, sort, filter by category, paginate, add.
- **Budgets**: spending limits per category with progress and latest spending.
- **Pots**: savings goals with add/withdraw.
- **Recurring bills**: add, edit and delete bills; see what's paid, due soon
  and overdue; mark bills as paid.

## Tech stack

Next.js 14 (Pages Router), React 18, TypeScript, Tailwind CSS with shadcn/ui,
Zustand, React Hook Form + zod, Recharts, TanStack Table, `idb-keyval`,
Sonner (toasts) and Vaul (bottom sheets).
Tests use Vitest (with `fake-indexeddb`) and Playwright.

## Getting started

Requires Node.js 20 or later (Playwright needs 20; developed on Node 22).

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command            | What it does                                                              |
| ------------------ | ------------------------------------------------------------------------- |
| `npm run dev`      | Development server on port 3000                                           |
| `npm run build`    | Production build (also type-checks)                                       |
| `npm start`        | Serve the production build                                                |
| `npm run lint`     | ESLint                                                                    |
| `npm test`         | Unit tests (Vitest)                                                       |
| `npm run test:tz`  | Unit tests again in UTC−8 and UTC+13, to catch timezone date bugs        |
| `npm run test:e2e` | Browser tests (Playwright) using your installed Chrome                    |

Two things worth knowing:

- `npm run test:e2e` starts its own dev server on port 3100 and builds into
  `.next-e2e`, so it doesn't interfere with a running `npm run dev`.
- Don't run `npm run build` while `npm run dev` is running: both write to
  `.next`, and the dev server starts failing to load pages. To check the
  build alongside a running dev server, use
  `NEXT_DIST_DIR=.next-build npm run build` (not `.next-e2e`, which the
  browser tests' dev server writes to).

## Project structure

```
src/pages/             Thin route files; each renders a module page
src/modules/<feature>/ Feature pages, components and logic (overview,
                       transactions, budgets, pots, recurring-bills, auth)
src/components/        Shared components (src/components/ui: shadcn/ui)
src/lib/store/         Zustand store, slices, IndexedDB storage, hooks
src/utils/             Types, constants, formatters, date helpers
src/__tests__/         Unit tests
e2e/                   Playwright tests
docs/                  Checklists that need a human, e.g. real-device testing
plans/                 Animation audit plans and their results
tasks/                 Spec, plan and task list for the latest build phase
```

## Architecture decisions

Written after building, from the trade-offs that actually came up.

**One saved snapshot, not a database per entity.** The whole store is saved
as a single versioned record in IndexedDB through Zustand's `persist`, using a
small storage adapter. Separate object stores per entity would look more like
a "real" database, but it would mean replacing `persist` with a hand-written
sync layer. At personal-finance data sizes a snapshot is fast, and it keeps
the existing schema versions and migrations working unchanged.

**Never lose data when changing storage.** Existing localStorage data is
copied into IndexedDB, and the old copy is deleted only after the IndexedDB
write succeeds. If IndexedDB can't be opened, or a write fails later (for
example, quota), the app keeps working in memory and says so, instead of
failing silently.

**Load saved data exactly once.** In development, React runs effects twice.
Loading from IndexedDB twice meant the slower load could finish last and
overwrite bills generated in between. A browser test that reopens the app on
a later day caught this, so loading now goes through `hydrateStore()`, which
only ever starts once.

**Dates are calendar days, not timestamps.** A bill is due on a day, not at an
instant. All recurrence logic uses `YYYY-MM-DD` strings and never touches UTC,
which is a classic source of off-by-one-day bugs. The date tests run in two
opposite timezones to prove it.

**Schedules count from the first due date.** The n-th due date is "first due
date + n periods", clamped to the end of the month, never "previous due date
+ 1 period". Otherwise a bill due on the 31st drifts to the 28th after
February and never comes back.

**Statuses are worked out, not stored.** Only bills and their generated
occurrences are saved. Paid, overdue, due today and due soon are calculated
when shown, so they can't fall out of sync with the data.

**Edits don't rewrite history.** Changing a bill's amount affects bills
generated from then on; anything already due keeps the amount it had. Changing
the cadence restarts the schedule from the latest due date. Deleting a bill
removes its unpaid due dates but keeps payments as ordinary transactions.

**Catch-up is capped.** A weekly bill left for years could have hundreds of
missed due dates. Each run generates at most 24 per bill, oldest first, and
the next run continues, so nothing is skipped and the order stays correct.

**Demo data is dated from your first visit.** Fixed sample dates go stale or
create dozens of catch-up bills. Instead, a new visitor gets bills dated
relative to their first visit: one paid, one overdue, one due soon and one
further out.

**Undo as well as confirmation.** Deletes still ask first, as the design
specifies, but a confirmation is soon clicked through without reading, so
every change that loses something also offers Undo. Frequent, small actions
(marking a bill paid, adding money) skip the question and rely on Undo
alone. It works because each action keeps what it removed (a bill's unpaid
due dates, a pot's place in the list) for the toast to restore. "Reset demo
data" on the error screen can't be undone, so it only asks.

**Layout decided by CSS, not JavaScript.** The sidebar's starting width
comes from breakpoints (collapsed below 1280px, expanded above) until you
toggle it, so the first paint is already right and nothing jumps or animates
on load. JavaScript only follows along for screen-reader state and for
choosing a dialog or a bottom sheet, which are never open on load.

**Logic is pure; time is passed in.** Schedule maths, statuses and summaries
are plain functions that take "today" as an argument, so tests control time
completely. Browser tests use a fixed clock for the same reason.

## Limitations

- **No backend.** Data lives in one browser on one device; clearing site data
  removes it.
- **Sign-in is a demo.** Any email and password work, nothing is checked or
  stored, and pages are protected only on the client. It shows the flow, not
  security.
- **"Due soon" is a flat 5 days** for every cadence, which covers most of a
  weekly bill's cycle. Left as is until it proves a problem in real use.
- **Mobile behaviour is verified in emulation only.** Browser tests check the
  tags and layouts, but touch feel, safe areas and the keyboard need a real
  phone; see [docs/device-testing.md](docs/device-testing.md).
