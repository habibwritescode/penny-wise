import React from "react";

import JarIcon from "../../../../public/assets/icons/jar.svg";

import ContainerCard from "./container-card";
import Typography from "@/components/typography";
import ExpenseItem from "@/components/expense-item";
import currencyFormatter from "@/utils/formatCurrency";
import useBoundStore from "@/lib/store/store";

const Pots = () => {
  const pots = useBoundStore((store) => store.pots);

  const totalPotSaved = pots.reduce((sum, item) => sum + item.total, 0);

  return (
    <ContainerCard title="Pots" route="/pots">
      <div className="grid xl:grid-cols-[247px_1fr] gap-5 mt-5">
        <div className="bg-beige-100 rounded-xl p-5 flex items-center gap-6">
          <JarIcon />
          <div className="grid gap-3">
            <Typography variant="preset-4" className="text-grey-500">
              Total Saved
            </Typography>
            <Typography>{currencyFormatter.format(totalPotSaved)}</Typography>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {pots.slice(0, 4).map((item) => (
            <ExpenseItem
              key={item.name}
              title={item.name}
              value={currencyFormatter.format(item.total)}
              bgColor={item.theme}
            />
          ))}
        </div>
      </div>
    </ContainerCard>
  );
};

export default Pots;
