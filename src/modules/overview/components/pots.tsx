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
      {/* Panel beside the list only when the card is wide: md-xl (overview is
          one column) and from 1400px. In the narrow xl column they stack, or
          pot names wrap. */}
      <div className="grid md:grid-cols-[minmax(247px,max-content)_minmax(0,1fr)] xl:grid-cols-1 min-[1400px]:grid-cols-[minmax(247px,max-content)_minmax(0,1fr)] gap-5 mt-5">
        <div className="bg-beige-100 rounded-xl p-5 flex items-center gap-6">
          <JarIcon className="shrink-0" />
          <div className="grid gap-3 min-w-0">
            <Typography variant="preset-4" className="text-grey-500">
              Total Saved
            </Typography>
            <Typography className="break-all">
              {currencyFormatter.format(totalPotSaved)}
            </Typography>
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
