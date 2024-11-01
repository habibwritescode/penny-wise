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
