import Typography from "@/components/typography";
import WavyIcon from "../../../../public/assets/icons/wavy.svg";
import currencyFormatter from "@/utils/formatCurrency";
import useBillSummary from "../use-bill-summary";

const TotalBills = () => {
  // Bills repeat on different cadences, so the total is a monthly equivalent.
  const { monthlyTotal } = useBillSummary();

  return (
    <div className="bg-primary p-6 rounded-xl flex gap-5 items-center sm:flex-col sm:gap-8 sm:items-start">
      <WavyIcon className="shrink-0" />
      <div className="min-w-0">
        <Typography tag="p" variant="preset-4" className="mb-3 text-white">
          Total Bills
        </Typography>

        <Typography tag="p" className="text-white break-all">
          {currencyFormatter.format(monthlyTotal)}
        </Typography>
        <Typography tag="p" variant="preset-5" className="mt-1 text-white/70">
          per month
        </Typography>
      </div>
    </div>
  );
};

export default TotalBills;
