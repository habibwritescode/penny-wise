import Typography from "@/components/typography";
import RecurringBillsTable from "./components/table";
import TotalBills from "./components/total-bills";
import BillsSummary from "./components/bills-summary";

const RecurringBillsPage = () => {
  return (
    <>
      <div className="pb-8">
        <Typography tag="h1">Recurring Bills</Typography>

        <section className="grid grid-cols-10 gap-6 mt-10">
          <div className="space-y-6 col-span-3">
            <TotalBills />
            <BillsSummary />
          </div>

          <div className="col-span-7">
            <RecurringBillsTable />
          </div>
        </section>
      </div>
    </>
  );
};

export default RecurringBillsPage;
