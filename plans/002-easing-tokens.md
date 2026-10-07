# 002 — Define the easing curves once, as CSS variables

- **Status**: DONE (2026-10-07)
- **Commit**: 5e8f960 + uncommitted working-tree changes as of 2026-10-07 (the code excerpts below are the source of truth; if they don't match, STOP)
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files, ~25 small edits, no behaviour change

## Problem

The app's strong ease-out curve is typed out by hand in 11 places, and a
"pop" curve in 2 more. A future adjustment means finding and editing every copy,
and they will drift apart.

```css
/* src/styles/globals.css — current, every occurrence */
136:      opacity 200ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
142:      opacity 100ms cubic-bezier(0.23, 1, 0.32, 1);
173:    opacity 200ms cubic-bezier(0.23, 1, 0.32, 1),
174:    transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
180:    opacity 150ms cubic-bezier(0.23, 1, 0.32, 1),
181:    transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
187:    opacity 400ms cubic-bezier(0.34, 1.56, 0.64, 1),
188:    transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
194:    opacity 150ms cubic-bezier(0.23, 1, 0.32, 1),
195:    transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
204:    grid-template-rows 200ms cubic-bezier(0.23, 1, 0.32, 1),
205:    opacity 200ms cubic-bezier(0.23, 1, 0.32, 1);
```

```ts
/* tailwind.config.ts:22-27 — current */
transitionTimingFunction: {
  // Entering and responding: starts fast, so it feels instant.
  "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
  // Moving on screen (e.g. collapsing the sidebar).
  "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
},
```

## Target

Three variables, defined once in the live `:root` block, used everywhere:

```css
/* target: src/styles/globals.css, inside the existing `@layer base { :root { ... } }` at line 38-39 */
    /* Motion curves. Tailwind's ease-out-strong / ease-in-out-strong use these. */
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entering, responding */
    --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* moving on screen */
    --ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);   /* rare celebration only */
```

```ts
/* target: tailwind.config.ts */
transitionTimingFunction: {
  // Entering and responding: starts fast, so it feels instant.
  "out-strong": "var(--ease-out)",
  // Moving on screen (e.g. collapsing the sidebar).
  "in-out-strong": "var(--ease-in-out)",
},
```

Every `cubic-bezier(0.23, 1, 0.32, 1)` in `globals.css` becomes `var(--ease-out)`,
and every `cubic-bezier(0.34, 1.56, 0.64, 1)` becomes `var(--ease-pop)`.
Durations, delays and properties stay exactly as they are.

## Repo conventions to follow

- Design tokens live as CSS custom properties in `src/styles/globals.css` inside
  `@layer base { :root { ... } }` (starting at line 38-39), e.g.
  `--background: 30, 36%, 96%;`, and Tailwind reads them via `theme.extend`
  (e.g. `colors.beige[100]: "hsl(var(--beige-100))"` in `tailwind.config.ts`).
  Follow the same pattern for the curves.

## Steps

1. In `src/styles/globals.css`, add the three variables from **Target** at the
   end of the existing `:root { ... }` block that begins at line 39 (the one
   inside `@layer base`, not the commented-out block near the top of the file).
2. In `src/styles/globals.css`, replace every `cubic-bezier(0.23, 1, 0.32, 1)`
   with `var(--ease-out)` (10 occurrences: lines 136, 142, 173, 174, 180, 181,
   194, 195, 204, 205) and every `cubic-bezier(0.34, 1.56, 0.64, 1)` with
   `var(--ease-pop)` (lines 187, 188). Do not touch anything else on those lines.
3. In `tailwind.config.ts`, change the two values in `transitionTimingFunction`
   to `"var(--ease-out)"` and `"var(--ease-in-out)"` as in **Target**. Keep the
   comments and the keys (`out-strong`, `in-out-strong`) unchanged.

## Boundaries

- Do NOT rename the Tailwind keys `out-strong` / `in-out-strong`; many components use `ease-out-strong` / `ease-in-out-strong`.
- Do NOT change any duration, delay or transitioned property.
- Do NOT touch `@starting-style` or `@media (prefers-reduced-motion)` blocks except where they contain one of the listed curves.
- Do NOT add dependencies.

## Verification

- **Mechanical**:
  - `grep -n "cubic-bezier" src/styles/globals.css tailwind.config.ts` prints only the three variable definitions.
  - `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run test:e2e`: all pass.
  - `NEXT_DIST_DIR=.next-build npm run build` succeeds, and the built CSS
    (`.next-build/static/css/*.css`) contains `--ease-out:cubic-bezier(.23,1,.32,1)`
    and `var(--ease-out)`.
- **Feel check**: nothing should look different. Spot-check in DevTools →
  Animations at 10%: opening a select (ease-out-strong via Tailwind), the
  sidebar collapse (ease-in-out-strong), a card entering after "Add New Pot"
  (`.enter-fade-scale`), and "Goal reached" popping in (`.enter-pop`) all keep
  their curves.
- **Done when**: no hand-typed curve remains outside the `:root` definitions and behaviour is unchanged.

## Execution notes (2026-10-07)

Executed as written: 10 ease-out and 2 pop curves replaced; the only
`cubic-bezier` left are the three `:root` definitions; the built CSS contains
`--ease-out:cubic-bezier(0.23,1,0.32,1)` with 12 `var(--ease-out)` uses.

**Pre-existing bug found during the feel check (fixed, outside this plan's
steps):** Tailwind's `content` globs in `tailwind.config.ts` did not include
`src/utils` or `src/lib`. `SIDEBAR_COLLAPSE` lives in `src/utils/constants.ts`,
so `transition-[width,margin-left,padding-left,transform]` and
`ease-in-out-strong` were never generated: the sidebar ran on
`transition: all 0.3s ease` and the page content's `margin-left` did not
animate at all. Added `./src/utils/**/*.{js,ts,jsx,tsx}` and
`./src/lib/**/*.{js,ts,jsx,tsx}` to `content`. Verified: the aside and nav
items now compute `transition: width, margin-left, padding-left, transform
0.3s cubic-bezier(0.77, 0, 0.175, 1)`, the content `main` uses the same, and a
10%-speed capture shows the content moving smoothly with the sidebar.
