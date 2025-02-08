import { Progress } from "./ui/progress";

type Props = {
  target: number;
  current: number;
  change: number;
  changeColor: string;
};

const MultiPartProgressBar = ({
  target,
  current,
  change,
  changeColor,
}: Props) => {
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
};

export default MultiPartProgressBar;
