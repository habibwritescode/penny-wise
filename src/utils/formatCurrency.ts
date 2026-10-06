import { ITransaction } from "@/utils/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export const formatTransactionAmount = ({
  amount,
  type,
}: Pick<ITransaction, "amount" | "type">) =>
  `${type === "Income" ? "+" : "-"}${currencyFormatter.format(amount)}`;

export default currencyFormatter;
