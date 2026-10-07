import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";

import BudgetCard from "../../modules/budgets/components/budget-card";
import AddBudget from "@/modules/budgets/components/add-budget";
import { useState } from "react";
import useBoundStore from "@/lib/store/store";
import { getCategoryItems } from "./utils";
import { getExpenses } from "@/modules/transactions/utils";
import SpendingSummary from "./components/summary";

type OpenModal = "add-budget" | null;

const BudgetsPage = () => {
  const allTransactions = useBoundStore((store) => store.transactions);
  const budgets = useBoundStore((store) => store.budgets);

  const outgoingTransactions = getExpenses(allTransactions);

  const [openModal, setOpenModal] = useState<OpenModal>(null);

  const handleCloseModal = () => setOpenModal(null);

  return (
    <>
      <div className="pb-8">
        <div className="flex justify-between items-center mb-8">
          <Typography tag="h1">Budgets</Typography>

          <Button
            className="rounded-[8px]"
            size="xl"
            onClick={() => setOpenModal("add-budget")}
          >
            <Typography
              tag="span"
              variant="preset-4-bold"
              className="text-white"
            >
              + Add New Budget
            </Typography>
          </Button>
        </div>

        <section className="grid xl:grid-cols-10 gap-6">
          <section className="xl:col-span-4">
            <SpendingSummary />
          </section>

          <section className="w-full xl:col-span-6 grid gap-6">
            {budgets.map((item) => (
              <BudgetCard
                key={item.category}
                budget={item}
                items={getCategoryItems(item.category, outgoingTransactions)}
              />
            ))}
          </section>
        </section>
      </div>

      <AddBudget
        isOpen={openModal === "add-budget"}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default BudgetsPage;
