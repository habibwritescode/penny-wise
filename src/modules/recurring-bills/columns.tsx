import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import currencyFormatter from "@/utils/formatCurrency";
import { ColumnDef } from "@tanstack/react-table";
import { ITransaction } from "@/utils/types";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import Typography from "@/components/typography";
import getInitials from "@/utils/getInitials";

const columns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "name",
    header: "Bill Title",
    cell: ({ row }) => {
      const name = String(row.getValue("name"));
      const avatarSrc = row.original.avatar;

      return (
        <div className="flex gap-2 flex-col">
          <div className="flex gap-4 items-center">
            <Avatar className="shrink-0">
              <AvatarImage src={avatarSrc} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <Typography variant="preset-4-bold">{name}</Typography>
          </div>
          <Typography variant="preset-5" className="text-green block md:hidden">
            Monthly-{dateTimeFormatter.getDayOfMonth(row.getValue("date"))}
          </Typography>
        </div>
      );
    },
  },

  {
    accessorKey: "date",
    header: "Due Date",
    meta: { className: "hidden md:table-cell whitespace-nowrap" },
    cell: ({ row }) => (
      <Typography variant="preset-5" className="text-green">
        Monthly-{dateTimeFormatter.getDayOfMonth(row.getValue("date"))}
      </Typography>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    meta: { className: "whitespace-nowrap" },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = currencyFormatter.format(amount);

      return (
        <Typography
          variant="preset-4-bold"
          className="text-right text-grey-900"
        >
          {formatted}
        </Typography>
      );
    },
  },
];

export default columns;
