import BudgetChart from "@/components/budget-chart";
import Typography from "@/components/typography";
import useBoundStore from "@/lib/store/store";
import currencyFormatter from "@/utils/formatCurrency";
import { ICategory, ITransaction } from "@/utils/types";
import { getCategoryItems } from "../utils";

const getTotal = (items: ITransaction[] = []) => {
  const total = items?.reduce((acc, curr) => acc + curr.amount, 0);
  return Math.abs(total);
};

const SpendingSummary = () => {
  const allTransactions = useBoundStore((store) => store.transactions);
  const budgets = useBoundStore((store) => store.budgets);

  const outgoingTransactions = allTransactions.filter(
    (item) => item.type === "Expense"
  );

  return (
    <div className="flex flex-col sm:flex-row md:flex-col bg-white rounded-xl w-full px-8 py-6 max-h-fit">
      <BudgetChart />

      <div className="mt-6">
        <Typography tag="h3" variant="preset-2">
          Spending Summary
        </Typography>

        <ul className="mt-2 divide-y divide-grey-100">
          {budgets.map((item) => (
            <li key={item.category} className="flex justify-between py-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-1 h-5 rounded-[8px]`}
                  style={{ backgroundColor: item.theme }}
                ></div>
                <Typography tag="p" variant="preset-4">
                  {item.category}
                </Typography>
              </div>

              <div className="flex items-center gap-2">
                <Typography tag="span" variant="preset-3">
                  {currencyFormatter.format(
                    getTotal(
                      getCategoryItems(
                        item.category as ICategory,
                        outgoingTransactions
                      )
                    )
                  )}
                </Typography>
                <Typography tag="span" variant="preset-5">
                  of {currencyFormatter.format(item.maximum)}
                </Typography>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpendingSummary;
