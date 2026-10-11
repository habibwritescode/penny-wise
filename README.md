# Pennywise

A personal finance app for tracking transactions, budgets, savings pots and
recurring bills. It runs entirely in the browser. There's no backend, and your
data stays on your device. Sign-in is a demo too. The app checks and stores no
credentials, so any email and password work. See Limitations.

Live demo at [penny-wise-fawn.vercel.app](https://penny-wise-fawn.vercel.app).
Click **Try the demo** to start with sample data.

## Where this came from

Pennywise started as the "Personal finance app" challenge from
[Frontend Mentor](https://www.frontendmentor.io/challenges). The challenge
supplies the design and a sample dataset, and the core screens follow that
brief: overview, transactions, budgets, pots and recurring bills.

Built beyond the brief:

- **Recurring-bill automation.** Each bill is a stored record with a cadence
  of weekly, every 2 weeks, monthly, quarterly or yearly. Each due date
  creates a bill to pay. The app flags overdue bills and lists them under
  "Needs paying", and marking one paid records the matching expense. When
  you come back to the app, it creates any bills you missed.
- **Persistence in IndexedDB.** On first load the app moves older
  localStorage data across once. If storage is unavailable, as in some
  private-browsing modes, the app keeps data in memory and shows a warning.
- **Demo sign-in** with a route guard, so the app behaves like a signed-in
  product without pretending to be secure. See Limitations.
- **Undo.** Deleting a pot, budget or bill, marking a bill paid, and adding
  or withdrawing money each show a toast with Undo, which puts things back
  exactly where they were.
- **Animation only where something changes.** Things that appear, disappear
  or change state during a visit animate for 100 to 300ms, using strong
  ease-out curves defined once as CSS variables. Examples: cards fading out
  on delete, panels expanding, dialogs, toasts and press feedback on buttons.
  Nothing animates on page load, and with Reduce Motion on, movement becomes
  a fade.
- **Phone-specific behaviour.** Forms open as bottom sheets you can drag
  closed. The layout clears the notch and the home indicator, and the
  browser's toolbar colour matches each page. Taps respond on press, with no
  grey flash and no hover state left behind. Amount fields open a decimal
  keypad, and email fields don't capitalise the first letter.
- **Responsive and accessibility work** beyond the provided designs. Layouts
  are tested from 320px wide to desktop. The sidebar starts collapsed on
  smaller laptops and names its icons in tooltips. Form fields and icon-only
  nav links have labels, and statuses don't rely on colour alone.
- **Tests.** Unit tests cover the money, date and persistence logic, and
  browser tests cover the main flows and layouts.

## Features

- **Overview.** Shows the balance, income and expenses, with summaries of
  pots, recent transactions, budgets and recurring bills.
- **Transactions.** Search, sort, filter by category, page through and add
  transactions.
- **Budgets.** Set a spending limit per category and see progress and the
  latest spending.
- **Pots.** Save towards goals, and add or withdraw money.
- **Recurring bills.** Add, edit and delete bills, see which are paid, due
  soon or overdue, and mark them as paid.

## Tech stack

Next.js 14 with the Pages Router, React 18, TypeScript, Tailwind CSS with
shadcn/ui, Zustand, React Hook Form with zod, Recharts, TanStack Table,
`idb-keyval`, Sonner for toasts and Vaul for bottom sheets. Tests use Vitest
with `fake-indexeddb`, and Playwright.

## Getting started

Requires Node.js 20 or later, because Playwright needs 20. The app was
developed on Node 22.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command            | What it does                                                       |
| ------------------ | ------------------------------------------------------------------ |
| `npm run dev`      | Development server on port 3000                                    |
| `npm run build`    | Production build, which also type-checks                           |
| `npm start`        | Serve the production build                                         |
| `npm run lint`     | ESLint                                                             |
| `npm test`         | Unit tests with Vitest                                             |
| `npm run test:tz`  | Unit tests again in UTC−8 and UTC+13, to catch timezone date bugs |
| `npm run test:e2e` | Browser tests with Playwright, using your installed Chrome         |

Two notes on running these alongside the dev server:

- `npm run test:e2e` starts its own dev server on port 3100 and builds into
  `.next-e2e`, so it doesn't interfere with a running `npm run dev`.
- Don't run `npm run build` while `npm run dev` is running. Both write to
  `.next`, and the dev server starts failing to load pages. To check the
  build alongside a running dev server, use
  `NEXT_DIST_DIR=.next-build npm run build`. Don't use `.next-e2e`, because
  the browser tests' dev server writes there.

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
```

## Architecture decisions

I wrote these after building, from trade-offs that came up along the way.

**One saved snapshot, not a database per entity.** Zustand's `persist`
saves the whole store as one versioned record in IndexedDB, through a small
storage adapter. Separate object stores per entity would look more like a
"real" database, but they would mean replacing `persist` with a hand-written
sync layer. At personal-finance data sizes a snapshot is fast, and the
existing schema versions and migrations keep working unchanged.

**Never lose data when changing storage.** The app copies existing
localStorage data into IndexedDB and deletes the old copy only after the
IndexedDB write succeeds. If IndexedDB can't be opened, or a later write
fails because of quota, for example, the app keeps working in memory and
says so instead of failing silently.

**Load saved data exactly once.** In development, React runs effects twice.
Loading from IndexedDB twice meant the slower load could finish last and
overwrite bills generated in between. A browser test that reopens the app on
a later day caught this. Loading now goes through `hydrateStore()`, which
only ever starts once.

**Dates are calendar days, not timestamps.** A bill is due on a day, not at an
instant. All recurrence logic uses `YYYY-MM-DD` strings and never converts to
UTC, a common cause of off-by-one-day bugs. The date tests run in two
opposite timezones to prove it.

**Schedules count from the first due date.** The n-th due date is the first
due date plus n periods, clamped to the end of the month. It is never the
previous due date plus one period. Otherwise a bill due on the 31st drifts to
the 28th after February and never comes back.

**Statuses are worked out, not stored.** The store saves only bills and
their generated occurrences. The app calculates paid, overdue, due today and
due soon each time it shows them, so they can't fall out of sync with the
data.

**Edits don't rewrite history.** Changing a bill's amount affects bills
generated from then on, and anything already due keeps the amount it had.
Changing the cadence restarts the schedule from the latest due date. Deleting
a bill removes its unpaid due dates but keeps payments as ordinary
transactions.

**Catch-up is capped.** A weekly bill left for years could have hundreds of
missed due dates. Each run generates at most 24 per bill, oldest first, and
the next run continues, so nothing is skipped and the order stays correct.

**Demo data is dated from your first visit.** Fixed sample dates go stale or
create dozens of catch-up bills. Instead, a new visitor gets bills dated
relative to their first visit: one paid, one overdue, one due soon and one
further out.

**Undo as well as confirmation.** Deletes still ask first, as the design
specifies. People soon click through a confirmation without reading it, so
every change that loses something also offers Undo. Frequent, small actions
such as marking a bill paid or adding money skip the question and rely on
Undo alone. This works because each action keeps what it removed, such as a
bill's unpaid due dates or a pot's place in the list, for the toast to
restore. "Reset demo data" on the error screen can't be undone, so it only
asks.

**Layout decided by CSS, not JavaScript.** Breakpoints set the sidebar's
starting width until you toggle it. It is collapsed below 1280px and expanded
above, so the first paint is already right and nothing jumps or animates on
load. JavaScript only sets screen-reader state and chooses between a dialog
and a bottom sheet, and neither is open on load.

**Logic is pure, and time is passed in.** Schedule maths, statuses and
summaries are plain functions that take "today" as an argument, so tests set
the date themselves. Browser tests use a fixed clock for the same reason.

## Limitations

- **No backend.** Data lives in one browser on one device, and clearing site
  data removes it.
- **Sign-in is a demo.** Any email and password work. The app checks and
  stores nothing, and protects pages only on the client. It demonstrates the
  sign-in flow and provides no security.
- **"Due soon" is a flat 5 days** for every cadence, which covers most of a
  weekly bill's cycle. It stays that way until it causes a problem in real
  use.
- **Mobile behaviour is verified in emulation only.** Browser tests check the
  tags and layouts, but touch feel, safe areas and the keyboard need a real
  phone.
