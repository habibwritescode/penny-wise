import { useMemo, useState } from "react";
import { toast } from "sonner";

import ExpenseItem from "@/components/expense-item";
import Typography from "@/components/typography";
import getInitials from "@/utils/getInitials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import currencyFormatter from "@/utils/formatCurrency";
import { IBudget, ITransaction } from "@/utils/types";
import dateTimeFormatter from "@/utils/dateTimeFormatter";

import ActionDropdown from "@/components/action-dropdown";
import { Progress } from "@/components/ui/progress";
import DeleteBudget from "./delete-budget";
import AddBudget from "./add-budget";
import { calculatePercent } from "@/utils/math";
import { getOverBudget } from "../utils";
import useBoundStore from "@/lib/store/store";
import { LEAVE_MS, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  budget: IBudget;
  items: ITransaction[];
  // Created during this visit: animate in (never on page load).
  isNew?: boolean;
};

const BudgetCard = ({ budget, items, isNew = false }: Props) => {
  const [openModal, setOpenModal] = useState<"delete" | "edit" | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const deleteBudget = useBoundStore((store) => store.deleteBudget);
  const restoreBudget = useBoundStore((store) => store.restoreBudget);

  // Fade the card out, then delete it, with Undo putting it back in place.
  const handleDelete = () => {
    const index = useBoundStore
      .getState()
      .budgets.findIndex((item) => item.category === budget.category);
    const remove = () => {
      deleteBudget(budget.category);
      toast(`${budget.category} budget deleted`, {
        action: { label: "Undo", onClick: () => restoreBudget(budget, index) },
      });
    };

    if (prefersReducedMotion()) return remove();
    setIsLeaving(true);
    window.setTimeout(remove, LEAVE_MS);
  };

  const totalSpent = useMemo(() => {
    const total = items.reduce((acc, curr) => acc + curr.amount, 0);

    return Math.abs(total);
  }, [items]);

  const overBy = getOverBudget(totalSpent, budget.maximum);

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-xl p-8",
          isNew && "enter-fade-scale",
          isLeaving && "leave-fade-scale"
        )}
      >
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
            value={calculatePercent(totalSpent, budget.maximum)}
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
          {overBy > 0 ? (
            <ExpenseItem
              title="Over by"
              value={currencyFormatter.format(overBy)}
              bgColor="hsl(var(--red))"
              valueClassName="text-red"
            />
          ) : (
            <ExpenseItem
              title="Remaining"
              value={currencyFormatter.format(Math.max(-overBy, 0))}
              bgColor="#F8F4F0"
            />
          )}
        </div>

        <div className="bg-beige-100 p-5 pb-2 rounded-[12px]">
          <Typography tag="p" variant="preset-3" className="mb-1">
            Latest Spending
          </Typography>

          <ul className="divide-y divide-[#d3d1d1]">
            {items.slice(0, 3).map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-4">
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
        onConfirm={handleDelete}
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
