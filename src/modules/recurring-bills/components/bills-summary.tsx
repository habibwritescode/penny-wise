import Typography from "@/components/typography";
import useBoundStore from "@/lib/store/store";
import currencyFormatter from "@/utils/formatCurrency";
import { getRecurringBills } from "@/modules/transactions/utils";
import { getBillsSummary } from "../utils";

const BillsSummary = () => {
  const transactions = useBoundStore((store) => store.transactions);
  const { paid, upcoming, dueSoon } = getBillsSummary(
    getRecurringBills(transactions)
  );

  const items = [
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
