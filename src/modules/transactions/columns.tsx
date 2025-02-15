import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import currencyFormatter from "@/utils/formatCurrency";
import { ColumnDef } from "@tanstack/react-table";
import { ITransaction } from "@/utils/types";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import Typography from "@/components/typography";

const columns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "name",
    header: () => <div className="hidden md:block">Recipient/Sender</div>,
    cell: ({ row }) => {
      const name = String(row.getValue("name"));
      const avatarSrc = row.original.avatar;
      const category = String(row.getValue("category"));

      return (
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <Typography variant="preset-4-bold">{name}</Typography>
            <Typography
              variant="preset-5"
              className="block md:hidden text-grey-500"
            >
              {category}
            </Typography>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => <div className="hidden md:block">Category</div>,
    cell: ({ row }) => (
      <Typography variant="preset-5" className="text-grey-500 hidden md:block">
        {row.getValue("category")}
      </Typography>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div className="hidden md:block">Transaction Date</div>,
    cell: ({ row }) => (
      <Typography variant="preset-5" className="hidden md:block text-grey-500">
        {dateTimeFormatter.formatToLongDate(row.getValue("date"))}
      </Typography>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right hidden md:block">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = currencyFormatter.format(amount);
      const isIncome = row.original.type === "Income";

      return (
        <div className="grid gap-1">
          <Typography
            variant="preset-4-bold"
            className={`text-right ${isIncome ? "text-green" : "text-grey-900"}`}
          >
            {isIncome ? "+" : "-"}
            {formatted}
          </Typography>
          <Typography
            variant="preset-5"
            className="text-right block md:hidden text-grey-500"
          >
            {dateTimeFormatter.formatToLongDate(row.getValue("date"))}
          </Typography>
        </div>
      );
    },
  },
];

export default columns;
