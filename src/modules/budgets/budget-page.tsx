import Typography from "@/components/typography";
import AddButton from "@/components/add-button";

import BudgetCard from "../../modules/budgets/components/budget-card";
import AddBudget from "@/modules/budgets/components/add-budget";
import { useState } from "react";
import useBoundStore from "@/lib/store/store";
import useNewSinceMount from "@/lib/use-new-since-mount";
import { getCategoryItems } from "./utils";
import { getExpenses } from "@/modules/transactions/utils";
import SpendingSummary from "./components/summary";

type OpenModal = "add-budget" | null;

const BudgetsPage = () => {
  const allTransactions = useBoundStore((store) => store.transactions);
  const budgets = useBoundStore((store) => store.budgets);
  // Only budgets created (or restored) during the visit animate in.
  const isNew = useNewSinceMount(budgets.map((budget) => budget.category));

  const outgoingTransactions = getExpenses(allTransactions);

  const [openModal, setOpenModal] = useState<OpenModal>(null);

  const handleCloseModal = () => setOpenModal(null);

  return (
    <>
      <div className="pb-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <Typography tag="h1">Budgets</Typography>

          <AddButton label="Add New Budget" onClick={() => setOpenModal("add-budget")} />
        </div>

        {budgets.length ? (
          <section className="grid grid-cols-1 xl:grid-cols-10 gap-6">
            <section className="xl:col-span-4">
              <SpendingSummary />
            </section>

            <section className="w-full xl:col-span-6 grid grid-cols-1 gap-6">
              {budgets.map((item) => (
                <BudgetCard
                  key={item.category}
                  budget={item}
                  isNew={isNew(item.category)}
                  items={getCategoryItems(item.category, outgoingTransactions)}
                />
              ))}
            </section>
          </section>
        ) : (
          <Typography
            variant="preset-4"
            className="bg-white rounded-xl p-8 text-grey-500"
          >
            No budgets yet. Add a budget to set a spending limit for a category.
          </Typography>
        )}
      </div>

      <AddBudget
        isOpen={openModal === "add-budget"}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default BudgetsPage;
