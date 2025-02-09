import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import currencyFormatter from "@/utils/formatCurrency";
import { ColumnDef } from "@tanstack/react-table";
import { ITransaction } from "@/utils/types";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import Typography from "@/components/typography";

const columns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "name",
    header: "Bill Title",
    cell: ({ row }) => {
      const name = String(row.getValue("name"));
      const avatarSrc = row.original.avatar;

      return (
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Typography variant="preset-4-bold">{name}</Typography>
        </div>
      );
    },
  },

  {
    accessorKey: "date",
    header: "Due Date",
    cell: ({ row }) => (
      <Typography variant="preset-5" className="text-green">
        Monthly-{dateTimeFormatter.getDayOfMonth(row.getValue("date"))}
      </Typography>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
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
