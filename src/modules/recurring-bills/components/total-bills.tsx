import Typography from "@/components/typography";
import WavyIcon from "../../../../public/assets/icons/wavy.svg";
import currencyFormatter from "@/utils/formatCurrency";
import useBoundStore from "@/lib/store/store";
import { getRecurringBills } from "@/modules/transactions/utils";

const TotalBills = () => {
  const allTransactions = useBoundStore((store) => store.transactions);

  const totalBills = getRecurringBills(allTransactions).reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  return (
    <div className="bg-primary p-6 rounded-xl flex gap-5 items-center sm:flex-col sm:gap-8 sm:items-start">
      <WavyIcon className="shrink-0" />
      <div className="min-w-0">
        <Typography tag="p" variant="preset-4" className="mb-3 text-white">
          Total Bills
        </Typography>

        <Typography tag="p" className="text-white break-all">
          {currencyFormatter.format(totalBills)}
        </Typography>
      </div>
    </div>
  );
};

export default TotalBills;
