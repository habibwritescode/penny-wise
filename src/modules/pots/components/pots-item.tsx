import { useMemo, useState } from "react";

import ExpenseItem from "@/components/expense-item";
import ProgressBar from "@/components/progress-bar";
import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";
import { IPot, ITransaction } from "@/utils/types";
import dateTimeFormatter from "@/utils/dateTimeFormatter";

import ActionDropdown from "@/components/action-dropdown";
import DeletePot from "./delete-pot";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import WithdrawPot from "./withdraw-pot";

type Props = {
  pot: IPot;
};

type ModalType = "delete" | "edit" | "withdraw" | "add" | null;

const PotsItem = ({ pot }: Props) => {
  // const totalSpent = useMemo(() => {
  //   return items.reduce((acc, curr) => acc + curr.amount, 0);
  // }, [items]);

  const [openModal, setOpenModal] = useState<ModalType>(null);

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl px-6 pt-[28px] pb-[38px]">
        <div className="flex items-center justify-between mb-6 w-full">
          <div className="flex gap-4 items-center">
            <div
              className="w-4 h-4 rounded-full bg-green"
              style={{ backgroundColor: pot.theme }}
            />
            <Typography tag="h3" variant="preset-2">
              {pot.name}
            </Typography>
          </div>
          <ActionDropdown
            items={[
              {
                name: "Edit Pot",
                onSelect: () => null,
              },
              {
                name: "Delete Pot",
                onSelect: () => setOpenModal("delete"),
                className: "text-red hover:text-red focus:text-red",
              },
            ]}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <Typography tag="p" variant="preset-4" className="text-grey-500">
            Total Saved
          </Typography>
          <Typography tag="p" variant="preset-1">
            {currencyFormatter.format(pot.total)}
          </Typography>
        </div>

        <Progress
          value={40}
          color={pot.theme}
          className="h-2 rounded-[4px] bg-beige-100"
        />

        <div className="flex justify-between items-center mt-3 mb-10">
          <Typography tag="p" variant="preset-5" className="text-grey-500">
            30%
          </Typography>
          <Typography tag="p" variant="preset-5" className="text-grey-500">
            Target of {currencyFormatter.format(pot.target)}
          </Typography>
        </div>

        <div className="grid gap-4 grid-cols-2">
          <Button
            variant="ghost"
            size="xl"
            className="bg-beige-100 text-grey-900"
            onClick={() => setOpenModal("add")}
          >
            + Add Money
          </Button>
          <Button
            variant="ghost"
            size="xl"
            className="bg-beige-100 text-grey-900"
            onClick={() => setOpenModal("withdraw")}
          >
            Withdraw
          </Button>
        </div>
      </div>

      <DeletePot
        pot={pot}
        isOpen={openModal === "delete"}
        onClose={handleCloseModal}
      />

      <WithdrawPot
        pot={pot}
        isOpen={openModal === "withdraw"}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PotsItem;
