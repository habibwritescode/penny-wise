import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import currencyFormatter from "@/utils/formatCurrency";
import useBoundStore from "@/lib/store/store";

const chartConfig = {} satisfies ChartConfig;

const BudgetChart = () => {
  const allTransactions = useBoundStore((store) => store.transactions);
  const budgets = useBoundStore((store) => store.budgets);

  const outgoingTransactions = allTransactions.filter(
    (item) => item.type === "Expense"
  );

  const createdBudgetCategories = budgets.map((item) => item.category);

  const budgetTransactionsTotal = () => {
    const total = outgoingTransactions
      .filter((item) => createdBudgetCategories.includes(item.category))
      .reduce((acc, curr) => acc + curr.amount, 0);

    return Math.abs(total);
  };

  const chartData = budgets.map((item) => ({
    budget: item.category,
    amount: item.maximum,
    fill: item.theme,
  }));

  const totalBudgetLimit = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);

  return (
    <div className="w-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-w-[240px] max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="budget"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {currencyFormatter.format(budgetTransactionsTotal())}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        of {currencyFormatter.format(totalBudgetLimit)} limit
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default BudgetChart;
