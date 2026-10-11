import useBoundStore from "@/lib/store/store";
import React from "react";
import ContainerCard from "./container-card";
import BudgetChart from "@/components/budget-chart";
import ExpenseItem from "@/components/expense-item";
import currencyFormatter from "@/utils/formatCurrency";
import Typography from "@/components/typography";

const Budget = () => {
  const budgets = useBoundStore((store) => store.budgets);

  return (
    <ContainerCard title="Budgets" route="/budgets">
      {budgets.length ? (
        <div className="flex flex-col sm:flex-row sm:items-center xl:flex-col xl:items-stretch gap-6 mt-8">
          <BudgetChart className="sm:w-60 sm:shrink-0 xl:w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-w-0">
            {budgets.slice(0, 4).map((item) => (
              <ExpenseItem
                key={item.category}
                title={item.category}
                value={currencyFormatter.format(item.maximum)}
                bgColor={item.theme}
              />
            ))}
          </div>
        </div>
      ) : (
        <Typography variant="preset-4" className="mt-5 text-grey-500">
          No budgets yet.
        </Typography>
      )}
    </ContainerCard>
  );
};

export default Budget;
