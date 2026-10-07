# 001 — Keep the add/withdraw preview bar's segments in sync

- **Status**: DONE (2026-10-07)
- **Commit**: 5e8f960 + uncommitted working-tree changes as of 2026-10-07 (the code excerpts below are the source of truth; if they don't match, STOP)
- **Severity**: MEDIUM
- **Category**: Performance / sync
- **Estimated scope**: 2 files changed + 1 new test file, ~80 lines

## Problem

The "Add to / Withdraw from <pot>" dialog shows a two-part preview bar: a dark
segment for the amount that stays in the pot, and a coloured segment for the
amount being added (green) or withdrawn (red). The two parts are separate
layers that move in different ways:

```tsx
/* src/components/multi-part-progress.tsx:16-33 — current */
const currentWidth = (current / target) * 100;
const changeWidth = (change / target) * 100;

return (
  <div className="relative w-full h-2 rounded-[4px] bg-beige-100 overflow-hidden">
    <Progress
      value={currentWidth}
      color="#201F24"
      className="h-2 absolute top-0 left-0"
    />

    <Progress
      value={changeWidth}
      color={changeColor}
      className="h-2 rounded-none absolute top-0"
      indicatorClassName="rounded-r"
      style={{ left: `${currentWidth + 0.4}%` }}
    />
  </div>
);
```

Each `Progress` fill animates with a 300ms transform transition
(`src/components/ui/progress.tsx:29`), but the coloured layer's **position**
comes from `style.left`, which does not transition. It is called like this:

```tsx
/* src/modules/pots/components/add-or-withdraw.tsx:113-118 — current */
<MultiPartProgressBar
  target={pot.target}
  current={isAdd ? pot.total : newTotal}
  change={Number(amountInput || 0)}
  changeColor={isAdd ? "#277C78" : "#C94736"}
/>
```

When **withdrawing**, `current` changes on every keystroke. The dark segment
slides to its new length over 300ms while the red segment's `left` jumps to the
new position instantly, so for 300ms after each keystroke the two segments
visibly separate or overlap. `left` is also a layout property, which the
motion rules say not to animate or depend on for motion.

## Target

Two full-width layers in one track, **both** positioned purely by the same
`translateX` transition, so they can never separate:

- Bottom layer (coloured): fills from 0 to `end = current + change`.
- Top layer (dark `#201F24`): fills from 0 to `current`, drawn above the coloured
  layer. A 2px track-coloured edge on its right keeps the two segments visually
  distinct (replacing the old `+0.4%` gap).
- Both layers: `transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1)`
  (Tailwind: `transition-transform duration-300 ease-out-strong`), and
  `motion-reduce:transition-none`.
- Percentages are clamped to 0–100, and a target of 0 gives 0 (no division by zero).

```tsx
/* target: src/components/multi-part-progress.tsx */
const clamp = (value: number) => Math.min(100, Math.max(0, value));

// Percent of the target for the dark part (what remains/was there) and for the
// end of the coloured part (current + change). Exported for tests.
export const getSegments = (target: number, current: number, change: number) => {
  if (target <= 0) return { currentPercent: 0, endPercent: 0 };
  return {
    currentPercent: clamp((current / target) * 100),
    endPercent: clamp(((current + change) / target) * 100),
  };
};

const fill =
  "absolute inset-0 transition-transform duration-300 ease-out-strong motion-reduce:transition-none";

const MultiPartProgressBar = ({ target, current, change, changeColor }: Props) => {
  const { currentPercent, endPercent } = getSegments(target, current, change);

  // Both layers move only by translateX with the same transition, so the
  // segments stay joined while the amount is typed. The numbers beside the bar
  // carry the values, so the bar itself is decorative.
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-2 rounded-[4px] bg-beige-100 overflow-hidden"
    >
      <div
        className={`${fill} rounded-r-[4px]`}
        style={{
          transform: `translateX(-${100 - endPercent}%)`,
          backgroundColor: changeColor,
        }}
      />
      <div
        className={`${fill} shadow-[2px_0_0_0_hsl(var(--beige-100))]`}
        style={{
          transform: `translateX(-${100 - currentPercent}%)`,
          backgroundColor: "#201F24",
        }}
      />
    </div>
  );
};
```

## Repo conventions to follow

- Easing: Tailwind token `ease-out-strong` = `cubic-bezier(0.23, 1, 0.32, 1)`,
  defined in `tailwind.config.ts` under `theme.extend.transitionTimingFunction`.
- Exemplar of a transform-only fill with this exact transition:
  `src/components/ui/progress.tsx:29` (`transition-transform duration-300 ease-out-strong motion-reduce:transition-none`)
  with `transform: translateX(-${100 - (value || 0)}%)` at line 33.
- Unit tests live in `src/__tests__/` and use Vitest (`import { describe, expect, it } from "vitest"`).
- Comments explain *why*, briefly, in the style already in the file.

## Steps

1. Replace the body of `src/components/multi-part-progress.tsx` with the
   **Target** code above. Keep the existing `Props` type unchanged
   (`target`, `current`, `change`, `changeColor`). Remove the now-unused
   `import { Progress } from "./ui/progress";`.
2. Do not change the call site in `src/modules/pots/components/add-or-withdraw.tsx`:
   its props already mean "dark part = `current`, coloured part = `change` on top of it"
   for both add and withdraw.
3. Create `src/__tests__/multi-part-progress.test.ts`:
   ```ts
   import { describe, expect, it } from "vitest";
   import { getSegments } from "@/components/multi-part-progress";

   describe("getSegments", () => {
     it("puts the coloured part directly after the dark part", () => {
       expect(getSegments(200, 50, 30)).toEqual({ currentPercent: 25, endPercent: 40 });
     });
     it("clamps to the track", () => {
       expect(getSegments(100, 90, 50)).toEqual({ currentPercent: 90, endPercent: 100 });
       expect(getSegments(100, -10, 5)).toEqual({ currentPercent: 0, endPercent: 0 });
     });
     it("handles a zero target", () => {
       expect(getSegments(0, 10, 10)).toEqual({ currentPercent: 0, endPercent: 0 });
     });
   });
   ```

## Boundaries

- Do NOT edit `src/components/ui/progress.tsx` (other bars use it).
- Do NOT change `add-or-withdraw.tsx` or any copy/text in the dialog.
- Do NOT add dependencies.
- If the current code does not match the excerpts above, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` (no errors), `npm run lint` (no warnings),
  `npm test` (all pass, including the 3 new tests), `npm run test:e2e` (all pass).
- **Feel check** (`npm run dev`, sign in with "Try the demo", go to Pots):
  - On "Savings", click **Withdraw** and type `1`, `12`, `120` quickly: the dark
    and red segments stay joined at a 2px divider the whole time; they never
    separate or overlap.
  - Click **+ Add Money** and type an amount: the green segment grows from the
    dark segment's end.
  - DevTools → Animations panel → playback 10%, repeat the typing: both layers
    move together frame by frame.
  - DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: the bar
    updates instantly, still joined.
- **Done when**: no `left:` style remains in `multi-part-progress.tsx`, both
  layers use the same transform transition, and the feel checks pass.

## Execution notes (2026-10-07)

Executed as written. `npx tsc --noEmit`, `npm run lint`, `npm test` (3 new
tests) and `npm run test:e2e` pass. Feel check at 10% playback (Concert Ticket,
withdraw typed `6` then `60`): the dark segment slides from $104 to $50 while
the red segment stays joined at the 2px divider and its end stays at the old
$110; no gap or overlap in any frame.
