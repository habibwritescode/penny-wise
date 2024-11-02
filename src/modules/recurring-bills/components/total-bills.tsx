import Typography from "@/components/typography";
import WavyIcon from "../../../../public/assets/icons/wavy.svg";
import currencyFormatter from "@/utils/formatCurrency";

const TotalBills = () => {
  return (
    <div className="bg-primary p-6 rounded-xl">
      <WavyIcon />

      <Typography tag="p" variant="preset-4" className="mt-8 mb-3 text-white">
        Total Bills
      </Typography>

      <Typography tag="p" className="text-white">
        {currencyFormatter.format(0)}
      </Typography>
    </div>
  );
};

export default TotalBills;
