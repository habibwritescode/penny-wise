import React from "react";
import ContainerCard from "./container-card";
import useBoundStore from "@/lib/store/store";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import Typography from "@/components/typography";
import { formatTransactionAmount } from "@/utils/formatCurrency";
import getInitials from "@/utils/getInitials";
import { filterAndSortTransactions } from "@/modules/transactions/utils";

const Transactions = () => {
  const transactions = useBoundStore((store) => store.transactions);

  const filteredTransactions = filterAndSortTransactions({
    transactions,
    sortFilter: "latest",
  });

  return (
    <ContainerCard
      title="Transactions"
      route="/transactions"
      linkTitle="View All"
    >
      <ul className="divide-y divide-grey-100">
        {filteredTransactions.slice(0, 5).map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-6">
            <div className="flex gap-4 items-center min-w-0">
              <Avatar className="shrink-0">
                <AvatarImage src={item.avatar} alt={item.name} />
                <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
              </Avatar>
              <Typography
                variant="preset-4-bold"
                className="min-w-0 [overflow-wrap:anywhere]"
              >
                {item.name}
              </Typography>
            </div>

            <div className="grid shrink-0">
              <Typography
                variant="preset-4-bold"
                className={
                  item.type === "Income" ? "text-green" : "text-grey-900"
                }
              >
                {formatTransactionAmount(item)}
              </Typography>
              <Typography variant="preset-5" className="text-grey-500">
                {dateTimeFormatter.formatToLongDate(item.date)}
              </Typography>
            </div>
          </li>
        ))}
      </ul>
    </ContainerCard>
  );
};

export default Transactions;
