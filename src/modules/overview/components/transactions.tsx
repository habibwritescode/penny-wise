import React from "react";
import ContainerCard from "./container-card";
import useBoundStore from "@/lib/store/store";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";
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
          <li key={item.name} className="flex justify-between py-6">
            <div className="flex gap-4 items-center">
              <Avatar>
                <AvatarImage src={item.avatar} alt={item.name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Typography variant="preset-4-bold">{item.name}</Typography>
            </div>

            <div className="grid">
              <Typography
                variant="preset-4-bold"
                className={item.amount > 0 ? "text-green" : "text-grey-900"}
              >
                {currencyFormatter.format(item.amount)}
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
