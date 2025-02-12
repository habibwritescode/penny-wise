import Typography from "@/components/typography";
import { Inter } from "next/font/google";

import Pots from "./components/pots";
import Transactions from "./components/transactions";
import Budget from "./components/budget";
import RecurringBills from "./components/recurring-bills";
import useBoundStore from "@/lib/store/store";
import currencyFormatter from "@/utils/formatCurrency";
import { ITransaction, TransactionType } from "@/utils/types";

const inter = Inter({ subsets: ["latin"] });

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

  const totalIncome = calculateTotal(transactions, "Income");
  const totalExpenses = calculateTotal(transactions, "Expense");

  const cardItems = [
    { title: "Current Balance", value: totalIncome - totalExpenses },
    { title: "Income", value: totalIncome },
    { title: "Expenses", value: totalExpenses },
  ];

  return (
    <div className={` ${inter.className} `}>
      <div className="flex justify-between items-center">
        <Typography tag="h1">Overview</Typography>
      </div>

      <section className="my-[32px] grid lg:grid-cols-3 gap-6">
        {cardItems.map((item, index) => {
          const isFirstItem = index === 0;

          return (
            <div
              key={item.title}
              className={`grid gap-3 p-6 rounded-xl ${isFirstItem ? "bg-grey-900" : "bg-white"}`}
            >
              <Typography
                variant="preset-4"
                className={isFirstItem ? "text-white" : "text-grey-500"}
              >
                {item.title}
              </Typography>
              <Typography
                className={isFirstItem ? "text-white" : "text-grey-900"}
              >
                {currencyFormatter.format(item.value)}
              </Typography>
            </div>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-10 gap-6">
        <section className="lg:col-span-6 w-full grid gap-6">
          <Pots />
          <Transactions />
        </section>

        <section className="lg:col-span-4 grid gap-6">
          <Budget />
          <RecurringBills />
        </section>
      </section>
    </div>
  );
};

export default OverviewPage;
