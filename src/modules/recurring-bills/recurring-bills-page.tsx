import { useState } from "react";

import Typography from "@/components/typography";
import AddButton from "@/components/add-button";
import BillForm from "./components/bill-form";
import RecurringBillsTable from "./components/table";
import TotalBills from "./components/total-bills";
import BillsSummary from "./components/bills-summary";
import OverdueBills from "./components/overdue-bills";

const RecurringBillsPage = () => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <div className="pb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Typography tag="h1">Recurring Bills</Typography>
          <AddButton label="Add New Bill" onClick={() => setIsAdding(true)} />
        </div>

        <OverdueBills />

        <section className="grid grid-cols-1 gap-6 mt-10 xl:grid-cols-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1 xl:gap-0 xl:space-y-6 xl:col-span-3">
            <TotalBills />
            <BillsSummary />
          </div>

          <div className="xl:col-span-7">
            <RecurringBillsTable />
          </div>
        </section>
      </div>

      <BillForm isOpen={isAdding} onClose={() => setIsAdding(false)} />
    </>
  );
};

export default RecurringBillsPage;
