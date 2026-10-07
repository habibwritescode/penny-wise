type Props = {
  target: number;
  current: number;
  change: number;
  changeColor: string;
};

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

const MultiPartProgressBar = ({
  target,
  current,
  change,
  changeColor,
}: Props) => {
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

export default MultiPartProgressBar;
