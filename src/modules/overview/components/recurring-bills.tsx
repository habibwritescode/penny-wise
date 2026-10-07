import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";
import useBillSummary from "@/modules/recurring-bills/use-bill-summary";
import BillStatusBadge from "@/modules/recurring-bills/components/bill-status-badge";
import { cn } from "@/lib/utils";
import ContainerCard from "./container-card";

const RecurringBills = () => {
  const { paid, upcoming, dueSoon, overdue } = useBillSummary();

  const listItems = [
    // Only shown when something is overdue, and styled so it can't be missed.
    ...(overdue.count
      ? [
          {
            title: "Overdue",
            borderColor: "hsl(var(--red))",
            amount: overdue.total,
            isOverdue: true,
          },
        ]
      : []),
    {
      title: "Paid Bills",
      borderColor: "hsl(var(--green))",
      amount: paid.total,
    },
    {
      title: "Total Upcoming",
      borderColor: "hsl(var(--yellow))",
      amount: upcoming.total,
    },
    {
      title: "Due Soon",
      borderColor: "hsl(var(--cyan))",
      amount: dueSoon.total,
    },
  ];

  return (
    <ContainerCard title="Recurring Bills" route="/recurring-bills">
      <div className="mt-8 grid gap-4">
        {listItems.map((item) => (
          <div
            key={item.title}
            style={{ borderColor: item.borderColor }}
            className={cn(
              "flex items-center justify-between gap-4 h-[61px] w-full border-l-4 rounded-lg px-4",
              "isOverdue" in item ? "bg-red/10" : "bg-beige-100"
            )}
          >
            {"isOverdue" in item ? (
              <BillStatusBadge status="overdue" />
            ) : (
              <Typography variant="preset-4" className="text-grey-500">
                {item.title}
              </Typography>
            )}
            <Typography
              variant="preset-4-bold"
              className={"isOverdue" in item ? "text-red" : undefined}
            >
              {currencyFormatter.format(item.amount)}
            </Typography>
          </div>
        ))}
      </div>
    </ContainerCard>
  );
};

export default RecurringBills;
