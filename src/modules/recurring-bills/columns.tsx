import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import getInitials from "@/utils/getInitials";
import { localDateToTimestamp, type LocalDate } from "@/utils/local-date";
import { CADENCE_LABELS, type IBillRow } from "./utils";
import BillStatusBadge from "./components/bill-status-badge";
import BillActions from "./components/bill-actions";

const formatDueDate = (date: LocalDate) =>
  dateTimeFormatter.formatToLongDate(localDateToTimestamp(date));

// Cadence, due date and status, shown under the name on phones and in its own
// column from md.
const DueDetails = ({ row }: { row: IBillRow }) => (
  <div className="grid gap-1">
    <Typography variant="preset-5" className="text-grey-500 md:whitespace-nowrap">
      {CADENCE_LABELS[row.bill.cadence]} · {formatDueDate(row.dueDate)}
    </Typography>
    <BillStatusBadge status={row.status} />
  </div>
);

const columns: ColumnDef<IBillRow>[] = [
  {
    id: "name",
    accessorFn: (row) => row.bill.name,
    header: "Bill Title",
    // The card is already padded; on phones the outer cell padding is wasted width.
    meta: { className: "pl-0 md:pl-4" },
    cell: ({ row }) => {
      const { name, avatar } = row.original.bill;

      return (
        <div className="flex gap-4 items-center">
          <Avatar className="shrink-0">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <Typography variant="preset-4-bold">{name}</Typography>
            <div className="md:hidden">
              <DueDetails row={row.original} />
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "due",
    accessorFn: (row) => row.dueDate,
    header: "Due Date",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => <DueDetails row={row.original} />,
  },
  {
    id: "amount",
    accessorFn: (row) => row.bill.amount,
    header: () => <div className="text-right">Amount</div>,
    meta: { className: "whitespace-nowrap pr-0 md:pr-4" },
    // The row menu shares this cell: a separate column costs too much width on phones.
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Typography variant="preset-4-bold" className="text-grey-900">
          {currencyFormatter.format(row.original.bill.amount)}
        </Typography>
        <BillActions bill={row.original.bill} />
      </div>
    ),
  },
];

export default columns;
