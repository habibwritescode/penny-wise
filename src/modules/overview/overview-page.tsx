import Typography from "@/components/typography";
import { cn } from "@/lib/utils";

import Pots from "./components/pots";
import Transactions from "./components/transactions";
import Budget from "./components/budget";
import RecurringBills from "./components/recurring-bills";
import useBoundStore from "@/lib/store/store";
import currencyFormatter from "@/utils/formatCurrency";
import { ITransaction, TransactionType } from "@/utils/types";

// HOMEPAGE

const calculateTotal = (
  transactions: ITransaction[],
  type: TransactionType
) => {
  return transactions.reduce((sum, transaction) => {
    return transaction.type === type ? sum + transaction.amount : sum;
  }, 0);
};

const OverviewPage = () => {
  const transactions = useBoundStore((store) => store.transactions);
  const user = useBoundStore((store) => store.user);

  const totalIncome = calculateTotal(transactions, "Income");
  const totalExpenses = calculateTotal(transactions, "Expense");

  const cardItems = [
    { title: "Current Balance", value: totalIncome - totalExpenses },
    { title: "Income", value: totalIncome },
    { title: "Expenses", value: totalExpenses },
  ];

  return (
    <div>
      <div className="grid gap-2">
        <Typography tag="h1">Overview</Typography>
        {user && (
          <Typography variant="preset-4" className="text-grey-500">
            Welcome back, {user.name}
          </Typography>
        )}
      </div>

      {/* Flex, not three fixed columns: a card whose amount doesn't fit
          moves to the next row instead of splitting the number. */}
      <section className="my-[32px] grid md:flex md:flex-wrap gap-6">
        {cardItems.map((item, index) => {
          const isFirstItem = index === 0;

          return (
            <div
              key={item.title}
              className={`grid gap-3 p-6 rounded-xl md:flex-1 md:basis-48 ${isFirstItem ? "bg-grey-900" : "bg-white"}`}
            >
              <Typography
                variant="preset-4"
                className={isFirstItem ? "text-white" : "text-grey-500"}
              >
                {item.title}
              </Typography>
              <Typography
                className={cn(
                  "whitespace-nowrap",
                  isFirstItem ? "text-white" : "text-grey-900"
                )}
              >
                {currencyFormatter.format(item.value)}
              </Typography>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        <section className="xl:col-span-6 w-full grid grid-cols-1 gap-6 auto-rows-min">
          <Pots />
          <Transactions />
        </section>

        <section className="xl:col-span-4 grid grid-cols-1 gap-6 auto-rows-min">
          <Budget />
          <RecurringBills />
        </section>
      </section>
    </div>
  );
};

export default OverviewPage;
