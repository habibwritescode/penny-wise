import Typography from "./typography";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string;
  bgColor: string;
  valueClassName?: string;
};

const ExpenseItem = ({ title, value, bgColor, valueClassName }: Props) => {
  return (
    <div className="flex gap-4 min-h-11 min-w-0">
      <div
        className="w-1 shrink-0 self-stretch rounded-md"
        style={{ backgroundColor: bgColor }}
      ></div>
      <div className="grid gap-1 min-w-0">
        <Typography tag="p" variant="preset-5" className="text-grey-500">
          {title}
        </Typography>
        <Typography
          tag="p"
          variant="preset-4-bold"
          className={cn("whitespace-nowrap", valueClassName)}
        >
          {value}
        </Typography>
      </div>
    </div>
  );
};

export default ExpenseItem;
