import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";
import BudgetChart from "@/components/budget-chart";
import currencyFormatter from "@/utils/formatCurrency";

import data from "@/utils/data.json";
import BudgetCard from "../../modules/budgets/components/budget-card";
import { ICategory, ITransaction } from "@/utils/types";
import AddBudget from "@/modules/budgets/components/add-budget";
import { useState } from "react";

const getItems = (category: string) => {
  const items = data.transactions
    .filter((item) => item.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return items;
};

const getTotal = (items: ITransaction[] = []) => {
  const total = items.reduce((acc, curr) => acc + curr.amount, 0);
  return Math.abs(total);
};

const BudgetsPage = () => {
  const categoryItems: Record<ICategory, ITransaction[]> = {
    Entertainment: getItems("Entertainment"),
    Bills: getItems("Bills"),
    "Dining Out": getItems("Dining Out"),
    "Personal Care": getItems("Personal Care"),
  };

  const [openModal, setOpenModal] = useState<"add-budget" | null>(null);

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

        <section className="grid grid-cols-10 gap-6">
          <section className="col-span-4 bg-white rounded-xl w-full px-8 py-6 max-h-fit">
            <BudgetChart />

            <div className="mt-6">
              <Typography tag="h3" variant="preset-2">
                Spending Summary
              </Typography>

              <ul className="mt-2 divide-y divide-grey-100">
                {data.budgets.map((item) => (
                  <li key={item.category} className="flex justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-1 h-5 rounded-[8px]`}
                        style={{ backgroundColor: item.theme }}
                      ></div>
                      <Typography tag="p" variant="preset-4">
                        {item.category}
                      </Typography>
                    </div>

                    <div className="flex items-center gap-2">
                      <Typography tag="span" variant="preset-3">
                        {currencyFormatter.format(
                          getTotal(categoryItems[item.category as ICategory])
                        )}
                      </Typography>
                      <Typography tag="span" variant="preset-5">
                        of {currencyFormatter.format(item.maximum)}
                      </Typography>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="w-full col-span-6 grid gap-6">
            {data.budgets.map((item) => (
              <BudgetCard
                key={item.category}
                budget={item}
                items={categoryItems[item.category as ICategory]}
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
