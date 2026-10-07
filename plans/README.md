# Animation improvement plans

Written by an animation audit of the whole app (2026-10-07, commit 5e8f960 plus
uncommitted animation work). Each plan is self-contained: hand it to any agent.

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | [Keep the add/withdraw preview bar's segments in sync](001-progress-bar-segments-in-sync.md) | MEDIUM | DONE |
| 002 | [Define the easing curves once, as CSS variables](002-easing-tokens.md) | LOW | DONE |
| 003 | [Replace the press shrink with an opacity cue under reduced motion](003-reduced-motion-press-feedback.md) | LOW | DONE |
| 004 | [Measure the sidebar collapse on a slow CPU](004-sidebar-collapse-performance-check.md) | LOW | DONE (pass) |

## Recommended order

1. **001** — the only finding a user would notice.
2. **003** — a two-line accessibility fix.
3. **002** — token consolidation. Run it after 001 and 003 so their edits keep
   using the `ease-out-strong` Tailwind token (which 002 repoints to the new
   variable) rather than adding hand-typed curves.
4. **004** — measurement only; it changes no source code and can run anytime.

## Dependencies

- 001 and 003 are independent of each other.
- 002 touches `globals.css` and `tailwind.config.ts`; neither 001 nor 003 edits
  those files, so there are no conflicts, but run 002 last among the code
  changes to keep its diff a pure find-and-replace.
- 004 has no dependencies and changes no source files.

## Not planned (vetted out during the audit)

- The chart redrawing while the sidebar resizes the page: the chart container is
  capped at 240px in every layout, so it never resizes.
- Row and panel collapse animating `grid-template-rows`: occasional and
  documented; the only CSS way to animate unknown heights.
- The `enter-pop` overshoot in an otherwise crisp app: documented, deliberate,
  for one rare celebration.
- Dialogs scaling from the centre: correct for modals.
- Keyframe-based shadcn overlays (no mid-animation retargeting): at 100–200ms a
  restart is imperceptible; not worth rewriting the primitives.

## Follow-ups found while executing

- **Fixed:** Tailwind's `content` globs missed `src/utils` and `src/lib`, so
  class strings defined there (the sidebar's transition) were never generated.
  See plan 002's execution notes.
- **Fixed:** there were two nested `<main>` landmarks (`src/pages/_app.tsx`
  wrapped every page in a font `<main>` while the layouts render their own).
  The outer one is now a `<div>`; `e2e/responsive.spec.ts` checks every app and
  auth page has exactly one `main`.
