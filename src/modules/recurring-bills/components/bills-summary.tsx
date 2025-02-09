import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";

const BillsSummary = () => {
  const items = [
    {
      title: "Paid Bills",
      number: "2",
      amount: 300,
    },
    {
      title: "Total Upcoming",
      number: "6",
      amount: 320,
    },
    {
      title: "Due Soon",
      number: "2",
      amount: 400,
      color: "red",
    },
  ];
  return (
    <div className="p-5 rounded-xl bg-white">
      <Typography variant="preset-3">Summary</Typography>

      <ul className="divide-y divide-grey-100 mt-1">
        {items.map((item) => (
          <li className="flex justify-between py-4" key={item.title}>
            <Typography variant="preset-5" className="text-grey-500">
              {item.title}
            </Typography>
            <Typography variant="preset-5-bold">
              {item.number} ({currencyFormatter.format(item.amount)})
            </Typography>
          </li>
        ))}

        {/* <li className="flex justify-between pt-4">
          <Typography variant="preset-5" className="text-red">
            Due Soon
          </Typography>
          <Typography variant="preset-5-bold" className="text-red">
            4 ({currencyFormatter.format(20)})
          </Typography>
        </li> */}
      </ul>
    </div>
  );
};

export default BillsSummary;
