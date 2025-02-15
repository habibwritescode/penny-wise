import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";
import React from "react";
import ContainerCard from "./container-card";

const RecurringBills = () => {
  const listItems = [
    {
      title: "Paid Bills",
      borderColor: "hsl(var(--green))",
      amount: 300,
    },
    {
      title: "Total Upcoming",
      borderColor: "hsl(var(--yellow))",
      amount: 320,
    },
    {
      title: "Due Soon",
      borderColor: "hsl(var(--cyan))",
      amount: 400,
    },
  ];

  return (
    <ContainerCard title="Recurring Bills" route="/recurring-bills">
      <div className="mt-8 grid gap-4">
        {listItems.map((item) => (
          <div
            key={item.title}
            style={{ borderColor: item.borderColor }}
            className="flex items-center justify-between bg-beige-100 h-[61px] w-full border-l-4 rounded-lg px-4"
          >
            <Typography variant="preset-4" className="text-grey-500">
              {item.title}
            </Typography>
            <Typography variant="preset-4-bold">
              {currencyFormatter.format(item.amount)}
            </Typography>
          </div>
        ))}
      </div>
    </ContainerCard>
  );
};

export default RecurringBills;
