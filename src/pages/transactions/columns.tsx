import Typography from "@/components/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import utils from "@/utils";
import currencyFormatter from "@/utils/formatCurrency";
import { ColumnDef } from "@tanstack/react-table";
import { ITransaction } from "./utils";

export const columns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "name",
    header: "Recipient/Sender",
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
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "date",
    header: "Transaction Date",
    cell: ({ row }) => (
      <Typography variant="preset-5" className="text-grey-500">
        {utils.formatToLongDate(row.getValue("date"))}
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
          className={`text-right ${amount > 0 ? "text-green" : "text-grey-900"}`}
        >
          {formatted}
        </Typography>
      );
    },
  },
];
