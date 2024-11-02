import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";

const BillsSummary = () => {
  return (
    <div className="p-5 rounded-xl bg-white">
      <Typography variant="preset-3">Summary</Typography>

      <ul className="divide-y divide-grey-100 mt-1">
        <li className="flex justify-between py-4">
          <Typography variant="preset-5" className="text-grey-500">
            Paid Bills
          </Typography>
          <Typography variant="preset-5-bold">
            4({currencyFormatter.format(20)})
          </Typography>
        </li>
        <li className="flex justify-between py-4">
          <Typography variant="preset-5" className="text-grey-500">
            Paid Bills
          </Typography>
          <Typography variant="preset-5-bold">
            4 ({currencyFormatter.format(20)})
          </Typography>
        </li>
        <li className="flex justify-between pt-4">
          <Typography variant="preset-5" className="text-red">
            Paid Bills
          </Typography>
          <Typography variant="preset-5-bold" className="text-red">
            4 ({currencyFormatter.format(20)})
          </Typography>
        </li>
      </ul>
    </div>
  );
};

export default BillsSummary;
