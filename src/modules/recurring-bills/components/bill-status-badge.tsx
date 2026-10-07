import { CircleAlert, CircleCheck, Clock, CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";
import { STATUS_LABELS, type BillStatus } from "../utils";

// Icon + text + colour, so status never relies on colour alone.
const STYLES: Record<BillStatus, { className: string; Icon: typeof Clock }> = {
  overdue: { className: "bg-red/10 text-red", Icon: CircleAlert },
  "due-today": { className: "bg-red/10 text-red", Icon: CircleAlert },
  "due-soon": { className: "bg-yellow/30 text-grey-900", Icon: Clock },
  paid: { className: "bg-green/10 text-green", Icon: CircleCheck },
  upcoming: { className: "bg-beige-100 text-grey-500", Icon: CalendarClock },
};

const BillStatusBadge = ({ status }: { status: BillStatus }) => {
  const { className, Icon } = STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
};

export default BillStatusBadge;
