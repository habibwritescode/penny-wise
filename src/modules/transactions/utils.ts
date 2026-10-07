import { CATEGORIES } from "@/utils/constants";
import { Category, ITransaction } from "@/utils/types";

export const CATEGORY_FILTER_OPTIONS = [
  { name: "All Transactions", value: "All" },
  ...CATEGORIES.map((category) => ({ name: category, value: category })),
];

export type ICategoryFilter = "All" | Category;

export const getExpenses = (transactions: ITransaction[]) =>
  transactions.filter((item) => item.type === "Expense");

type FilterFunctionProps = {
  transactions: ITransaction[];
  sortFilter: string;
  categoryFilter?: string;
  searchValue?: string;
};

export const filterAndSortTransactions = ({
  transactions,
  sortFilter,
  categoryFilter,
  searchValue,
}: FilterFunctionProps) => {
  let filteredTransactions = transactions;

  if (categoryFilter && categoryFilter !== "All") {
    filteredTransactions = transactions.filter(
      (transaction) => transaction.category === categoryFilter
    );
  }

  if (searchValue) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      transaction.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  switch (sortFilter) {
    case "latest":
      return [...filteredTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    case "oldest":
      return [...filteredTransactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    case "ascending":
      return [...filteredTransactions].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    case "descending":
      return [...filteredTransactions].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    case "highest":
      return [...filteredTransactions].sort((a, b) => b.amount - a.amount);
    case "lowest":
      return [...filteredTransactions].sort((a, b) => a.amount - b.amount);
    default:
      return filteredTransactions;
  }
};
