import Typography from "@/components/typography";
import { Inter } from "next/font/google";

import JarIcon from "../../../public/assets/icons/jar.svg";
import ExpenseItem from "@/components/expense-item";
import data from "@/utils/data.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import currencyFormatter from "@/utils/formatCurrency";
import BudgetChart from "@/components/budget-chart";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import ContainerCard from "./components/container-card";

const inter = Inter({ subsets: ["latin"] });

// HOMEPAGE

const OverviewPage = () => {
  const cardItems = [
    { title: "Current Balance", value: "$4,836.00" },
    { title: "Income", value: "$3,814.25" },
    { title: "Expenses", value: "$1,700.50" },
  ];

  return (
    <div className={` ${inter.className} `}>
      <Typography tag="h1">Overview</Typography>

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
                {item.value}
              </Typography>
            </div>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-10 gap-6">
        <section className="lg:col-span-6 w-full grid gap-6">
          <ContainerCard title="Pots" route="/pots">
            <div className="grid xl:grid-cols-[247px_1fr] gap-5 mt-5">
              <div className="bg-beige-100 rounded-xl p-5 flex items-center gap-6">
                <JarIcon />
                <div className="grid gap-3">
                  <Typography variant="preset-4" className="text-grey-500">
                    Total Saved
                  </Typography>
                  <Typography>$850</Typography>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {data.pots.slice(0, 4).map((item) => (
                  <ExpenseItem
                    key={item.name}
                    title={item.name}
                    value={currencyFormatter.format(item.total)}
                    bgColor={item.theme}
                  />
                ))}
              </div>
            </div>
          </ContainerCard>

          <ContainerCard
            title="Transactions"
            route="/transactions"
            linkTitle="View All"
          >
            <ul className="divide-y divide-grey-100">
              {data.transactions.slice(0, 5).map((item) => (
                <li key={item.name} className="flex justify-between py-6">
                  <div className="flex gap-4 items-center">
                    <Avatar>
                      <AvatarImage src={item.avatar} alt={item.name} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Typography variant="preset-4-bold">{item.name}</Typography>
                  </div>

                  <div className="grid">
                    <Typography
                      variant="preset-4-bold"
                      className={
                        item.amount > 0 ? "text-green" : "text-grey-900"
                      }
                    >
                      {currencyFormatter.format(item.amount)}
                    </Typography>
                    <Typography variant="preset-5" className="text-grey-500">
                      {dateTimeFormatter.formatToLongDate(item.date)}
                    </Typography>
                  </div>
                </li>
              ))}
            </ul>
          </ContainerCard>
        </section>

        <section className="lg:col-span-4 grid gap-6">
          <ContainerCard title="Budgets" route="/budgets">
            <div className="flex flex-col xl:flex-row mt-14">
              <BudgetChart />
              <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
                {data.budgets.map((item) => (
                  <ExpenseItem
                    key={item.category}
                    title={item.category}
                    value={currencyFormatter.format(item.maximum)}
                    bgColor={item.theme}
                  />
                ))}
              </div>
            </div>
          </ContainerCard>

          <ContainerCard title="Recurring Bills" route="/recurring-bills">
            <div className="mt-8 grid gap-4">
              <div className="flex items-center justify-between bg-beige-100 h-[61px] w-full border-l-cyan border-l-4 rounded-lg px-4">
                <Typography variant="preset-4" className="text-grey-500">
                  Paid Bills
                </Typography>
                <Typography variant="preset-4-bold">
                  {currencyFormatter.format(100)}
                </Typography>
              </div>

              <div className="flex items-center justify-between bg-beige-100 h-[61px] w-full border-l-cyan border-l-4 rounded-lg px-4">
                <Typography variant="preset-4" className="text-grey-500">
                  Paid Bills
                </Typography>
                <Typography variant="preset-4-bold">
                  {currencyFormatter.format(100)}
                </Typography>
              </div>
              <div className="flex items-center justify-between bg-beige-100 h-[61px] w-full border-l-cyan border-l-4 rounded-lg px-4">
                <Typography variant="preset-4" className="text-grey-500">
                  Paid Bills
                </Typography>
                <Typography variant="preset-4-bold">
                  {currencyFormatter.format(100)}
                </Typography>
              </div>
            </div>
          </ContainerCard>
        </section>
      </section>
    </div>
  );
};

export default OverviewPage;
