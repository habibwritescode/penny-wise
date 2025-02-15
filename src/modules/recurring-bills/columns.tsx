import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import currencyFormatter from "@/utils/formatCurrency";
import { ColumnDef } from "@tanstack/react-table";
import { ITransaction } from "@/utils/types";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import Typography from "@/components/typography";

const columns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "name",
    header: () => <div className="hidden md:block ">Bill Title</div>,
    cell: ({ row }) => {
      const name = String(row.getValue("name"));
      const avatarSrc = row.original.avatar;

      return (
        <div className="flex gap-2 flex-col">
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src={avatarSrc} alt={name} />
              <AvatarFallback>CN</AvatarFallback>
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
    header: () => <div className="hidden md:block">Due Date</div>,
    cell: ({ row }) => (
      <Typography variant="preset-5" className="text-green hidden md:block">
        Monthly-{dateTimeFormatter.getDayOfMonth(row.getValue("date"))}
      </Typography>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="hidden md:block text-right">Amount</div>,
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
