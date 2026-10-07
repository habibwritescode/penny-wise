import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";
import useBillSummary from "../use-bill-summary";

const BillsSummary = () => {
  const { paid, upcoming, dueSoon, overdue } = useBillSummary();

  const items = [
    ...(overdue.count
      ? [{ title: "Overdue", ...overdue, className: "text-red" }]
      : []),
    { title: "Paid Bills", ...paid, className: "" },
    { title: "Total Upcoming", ...upcoming, className: "" },
    { title: "Due Soon", ...dueSoon, className: "text-red" },
  ];

  return (
    <div className="p-5 rounded-xl bg-white">
      <Typography variant="preset-3">Summary</Typography>

      <ul className="divide-y divide-grey-100 mt-1">
        {items.map((item) => (
          <li className="flex justify-between py-4" key={item.title}>
            <Typography
              variant="preset-5"
              className={item.className || "text-grey-500"}
            >
              {item.title}
            </Typography>
            <Typography variant="preset-5-bold" className={item.className}>
              {item.count} ({currencyFormatter.format(item.total)})
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillsSummary;
