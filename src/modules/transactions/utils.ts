import { ITransaction } from "@/utils/types";

export const SORT_OPTIONS = [
  { name: "Latest", value: "latest" },
  { name: "Oldest", value: "oldest" },
  { name: "A to Z", value: "ascending" },
  { name: "Z to A", value: "descending" },
  { name: "Highest", value: "highest" },
  { name: "Lowest", value: "lowest" },
];

export const CATEGORY_OPTIONS = [
  { name: "All Transactions", value: "All" },
  { name: "Entertainment", value: "Entertainment" },
  { name: "Bills", value: "Bills" },
  { name: "Groceries", value: "Groceries" },
  { name: "Dining Out", value: "Dining" },
  { name: "Transportation", value: "Transportation" },
  { name: "Personal Care", value: "Personal Care" },
];

export type SortFilter =
  | "latest"
  | "oldest"
  | "descending"
  | "ascending"
  | "highest"
  | "lowest";

export type CategoryFilter = (typeof CATEGORY_OPTIONS)[number]["value"];

type FilterFunctionProps = {
  transactions: ITransaction[];
  sortFilter: string;
  categoryFilter: string;
  searchValue: string;
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
