import { useMemo, useState } from "react";

import ExpenseItem from "@/components/expense-item";
import Typography from "@/components/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import currencyFormatter from "@/utils/formatCurrency";
import { IBudget, ITransaction } from "@/utils/types";
import dateTimeFormatter from "@/utils/dateTimeFormatter";

import ActionDropdown from "@/components/action-dropdown";
import { Progress } from "@/components/ui/progress";
import DeleteBudget from "./delete-budget";
import AddBudget from "./add-budget";

type Props = {
  budget: IBudget;
  items: ITransaction[];
};

const BudgetCard = ({ budget, items }: Props) => {
  const [openModal, setOpenModal] = useState<"delete" | "edit" | null>(null);

  const totalSpent = useMemo(() => {
    const total = items.reduce((acc, curr) => acc + curr.amount, 0);

    return Math.abs(total);
  }, [items]);

  const getProgressPercent = (maximum: number, spent: number) => {
    const percentage = (spent / maximum) * 100;
    return percentage >= 100 ? 100 : percentage;
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-6 w-full">
          <div className="flex gap-4 items-center">
            <div
              className="w-4 h-4 rounded-full bg-green"
              style={{ backgroundColor: budget.theme }}
            />
            <Typography tag="h3" variant="preset-2">
              {budget.category}
            </Typography>
          </div>
          <ActionDropdown
            items={[
              {
                name: "Edit Budget",
                onSelect: () => setOpenModal("edit"),
              },
              {
                name: "Delete Budget",
                onSelect: () => setOpenModal("delete"),
                className: "text-red hover:text-red focus:text-red",
              },
            ]}
          />
        </div>

        <Typography tag="p" variant="preset-4" className="mb-4">
          Maximum of {currencyFormatter.format(budget.maximum)}
        </Typography>

        <div className="bg-beige-100 p-1 rounded-[4px]">
          <Progress
            value={getProgressPercent(budget.maximum, totalSpent)}
            color={budget.theme}
            className="h-6 rounded-[4px] bg-beige-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 mb-5">
          <ExpenseItem
            title="Spent"
            value={currencyFormatter.format(totalSpent)}
            bgColor={budget.theme}
          />
          <ExpenseItem
            title="Remaining"
            value={currencyFormatter.format(budget.maximum - totalSpent)}
            bgColor="#F8F4F0"
          />
        </div>

        <div className="bg-beige-100 p-5 pb-2 rounded-[12px]">
          <Typography tag="p" variant="preset-3" className="mb-1">
            Latest Spending
          </Typography>

          <ul className="divide-y divide-[#d3d1d1]">
            {items.slice(0, 3).map((item, index) => (
              <li key={item.name + index} className="flex justify-between py-4">
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Typography variant="preset-4-bold">{item.name}</Typography>
                </div>

                <div className="grid">
                  <Typography
                    variant="preset-5-bold"
                    className={"text-grey-900"}
                  >
                    -{currencyFormatter.format(item.amount)}
                  </Typography>
                  <Typography variant="preset-5" className="text-grey-500">
                    {dateTimeFormatter.formatToLongDate(item.date)}
                  </Typography>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DeleteBudget
        budget={budget}
        isOpen={openModal === "delete"}
        onClose={handleCloseModal}
      />

      <AddBudget
        isOpen={openModal === "edit"}
        onClose={handleCloseModal}
        budget={budget}
        type="edit"
      />
    </>
  );
};

export default BudgetCard;
