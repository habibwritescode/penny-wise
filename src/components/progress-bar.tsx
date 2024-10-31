import { Progress } from "@/components/ui/progress";

type Props = {
  color?: string;
  percentageValue: number;
};

const ProgressBar = ({ color, percentageValue }: Props) => {
  return (
    <div className="bg-beige-100 p-1 rounded-[4px]">
      <Progress value={percentageValue} color={color} />
    </div>
  );
};

export default ProgressBar;
