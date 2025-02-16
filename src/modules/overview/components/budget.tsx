import useBoundStore from "@/lib/store/store";
import React from "react";
import ContainerCard from "./container-card";
import BudgetChart from "@/components/budget-chart";
import ExpenseItem from "@/components/expense-item";
import currencyFormatter from "@/utils/formatCurrency";

const Budget = () => {
  const budgets = useBoundStore((store) => store.budgets);

  return (
    <ContainerCard title="Budgets" route="/budgets">
      <div className="flex flex-col xl:flex-row mt-14">
        <BudgetChart />
        <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
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
    </ContainerCard>
  );
};

export default Budget;
