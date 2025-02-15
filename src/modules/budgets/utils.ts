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
