import Typography from "@/components/typography";
import WavyIcon from "../../../../public/assets/icons/wavy.svg";
import currencyFormatter from "@/utils/formatCurrency";
import useBoundStore from "@/lib/store/store";

const TotalBills = () => {
  const allTransactions = useBoundStore((store) => store.transactions);

  const recurringBills = allTransactions.filter(
    (item) => item.recurring && item.type === "Expense"
  );

  const totalBills = recurringBills.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);

  return (
    <div className="bg-primary p-6 rounded-xl flex gap-5 items-center sm:flex-col sm:gap-8 sm:items-start">
      <WavyIcon />
      <div>
        <Typography tag="p" variant="preset-4" className="mb-3 text-white">
          Total Bills
        </Typography>

        <Typography tag="p" className="text-white">
          {currencyFormatter.format(totalBills)}
        </Typography>
      </div>
    </div>
  );
};

export default TotalBills;
