export interface IBudget {
  category: string;
  maximum: number;
  theme: string;
}

export interface ITransaction {
  avatar: string;
  amount: number;
  name: string;
  category: string;
  date: string;
  recurring: boolean;
}

export type ICategory =
  | "Entertainment"
  | "Bills"
  | "Dining Out"
  | "Personal Care";

export interface IPot {
  name: string;
  target: number;
  total: number;
  theme: string;
}

export const SORT_OPTIONS = [
  { name: "Latest", value: "latest" },
  { name: "Oldest", value: "oldest" },
  { name: "A to Z", value: "ascending" },
  { name: "Z to A", value: "descending" },
  { name: "Highest", value: "highest" },
  { name: "Lowest", value: "lowest" },
];

export type SortFilter =
  | "latest"
  | "oldest"
  | "descending"
  | "ascending"
  | "highest"
  | "lowest";