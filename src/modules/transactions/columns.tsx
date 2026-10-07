import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTransactionAmount } from "@/utils/formatCurrency";
import { ColumnDef } from "@tanstack/react-table";
import { ITransaction } from "@/utils/types";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import Typography from "@/components/typography";
import getInitials from "@/utils/getInitials";

const columns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "name",
    header: "Recipient/Sender",
    // The card is already padded; on phones the outer cell padding is wasted width.
    meta: { className: "pl-0 md:pl-4" },
    cell: ({ row }) => {
      const name = String(row.getValue("name"));
      const avatarSrc = row.original.avatar;
      const category = String(row.getValue("category"));

      return (
        <div className="flex gap-4 items-center">
          {/* Hidden on the narrowest phones (under 360px) so the row fits. */}
          <Avatar className="shrink-0 max-[359px]:hidden">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
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
    header: "Category",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => (
      <Typography variant="preset-5" className="text-grey-500">
        {row.getValue("category")}
      </Typography>
    ),
  },
  {
    accessorKey: "date",
    header: "Transaction Date",
    meta: { className: "hidden md:table-cell whitespace-nowrap" },
    cell: ({ row }) => (
      <Typography variant="preset-5" className="text-grey-500">
        {dateTimeFormatter.formatToLongDate(row.getValue("date"))}
      </Typography>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    meta: { className: "whitespace-nowrap pr-0 md:pr-4" },
    cell: ({ row }) => {
      const isIncome = row.original.type === "Income";

      return (
        <div className="grid gap-1">
          <Typography
            variant="preset-4-bold"
            className={`text-right ${isIncome ? "text-green" : "text-grey-900"}`}
          >
            {formatTransactionAmount(row.original)}
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
