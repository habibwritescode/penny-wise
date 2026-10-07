# 003 — Replace the press shrink with an opacity cue under reduced motion

- **Status**: DONE (2026-10-07)
- **Commit**: 5e8f960 + uncommitted working-tree changes as of 2026-10-07 (the code excerpts below are the source of truth; if they don't match, STOP)
- **Severity**: LOW
- **Category**: Accessibility
- **Estimated scope**: 2 files, 2 one-line edits

## Problem

Buttons and the mobile bottom-nav tabs shrink slightly while pressed. That
movement still runs when the user has asked for reduced motion, while every
other movement in the app is reduced.

```ts
/* src/components/ui/button.tsx:8 — current (base classes of every Button) */
"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[color,background-color,border-color,transform] duration-150 ease-out-strong active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
```

```ts
/* src/components/bottom-nav.tsx:13-14 — current */
const contentClass =
  "flex flex-col justify-center items-center w-full gap-1 h-full transition-transform duration-150 ease-out-strong active:scale-[0.97]";
```

## Target

Reduced motion means gentler, not no feedback: keep a visible press cue without
movement. Under `prefers-reduced-motion: reduce`, pressing does not scale and
instead dims slightly (no transition needed for an instant press cue):

- Button base: add `motion-reduce:active:scale-100 motion-reduce:active:opacity-80`
- Bottom-nav tab content: add `motion-reduce:active:scale-100 motion-reduce:active:opacity-70`

Without reduced motion, nothing changes: still `active:scale-[0.97]` with
`transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1)` (the
`ease-out-strong` token).

## Repo conventions to follow

- Reduced motion is handled with Tailwind's `motion-reduce:` variant on the same
  element, e.g. `src/components/ui/progress.tsx:29`
  (`... ease-out-strong motion-reduce:transition-none`). Stacked variants
  (`motion-reduce:active:...`) are supported by this Tailwind version (3.4).

## Steps

1. `src/components/ui/button.tsx:8`: insert
   `motion-reduce:active:scale-100 motion-reduce:active:opacity-80` directly after
   `active:scale-[0.97]` in the base class string. Change nothing else.
2. `src/components/bottom-nav.tsx:14`: append
   ` motion-reduce:active:scale-100 motion-reduce:active:opacity-70` to the end of
   the `contentClass` string (inside the quotes). Update the comment on line 12 to:
   `// Pressing a tab scales it slightly (dims instead with reduced motion), so the tap feels acknowledged.`

## Boundaries

- Do NOT change the non-reduced press behaviour or any duration/easing.
- Do NOT touch other components.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run test:e2e`: all pass.
- **Feel check** (`npm run dev`, sign in with "Try the demo"):
  - Normal: press and hold any button (e.g. "+ Add New Pot"): it shrinks slightly.
  - DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, then press
    and hold the same button: it does **not** shrink; it dims instead.
  - At 375px wide (bottom nav visible), repeat both checks on a nav tab.
- **Done when**: under reduced motion no pressable element scales, and every one still gives a visible press cue.

## Execution notes (2026-10-07)

Executed as written. Pressed-state computed styles at 375px:
- No preference: button `matrix(0.97, …)` opacity 1; nav tab `matrix(0.97, …)` opacity 1.
- Reduced motion: button `matrix(1, …)` opacity 0.8; nav tab `matrix(1, …)` opacity 0.7.
