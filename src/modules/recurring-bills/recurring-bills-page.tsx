import Typography from "@/components/typography";
import RecurringBillsTable from "./components/table";
import TotalBills from "./components/total-bills";
import BillsSummary from "./components/bills-summary";

const RecurringBillsPage = () => {
  return (
    <>
      <div className="pb-8">
        <Typography tag="h1">Recurring Bills</Typography>

        <section className="grid gap-6 mt-10 lg:grid-cols-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-0 lg:space-y-6 lg:col-span-3">
            <TotalBills />
            <BillsSummary />
          </div>

          <div className="lg:col-span-7">
            <RecurringBillsTable />
          </div>
        </section>
      </div>
    </>
  );
};

export default RecurringBillsPage;
