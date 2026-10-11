import { ITransaction } from "@/utils/types";

export const getCategoryItems = (
  category: string,
  transactions: ITransaction[]
) => {
  const items = transactions
    .filter((item) => item.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return items;
};

// Spending minus the limit, in whole cents, so floating-point sums such as
// 0.1 + 0.2 against a 0.3 limit come out exactly 0 rather than "over".
export const getOverBudget = (spent: number, maximum: number) =>
  Math.round((spent - maximum) * 100) / 100;
