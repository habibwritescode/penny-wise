import { ITransaction } from "@/utils/types";

const DUE_SOON_DAYS = 5;

type BillGroup = { count: number; total: number };

const summarise = (bills: ITransaction[]): BillGroup => ({
  count: bills.length,
  total: bills.reduce((sum, bill) => sum + bill.amount, 0),
});

// Bills recur monthly on the day of their transaction date: a bill whose day
// has passed this month is paid, otherwise it is upcoming.
export const getBillsSummary = (bills: ITransaction[], today = new Date()) => {
  const todayDay = today.getUTCDate();
  const billDay = (bill: ITransaction) => new Date(bill.date).getUTCDate();

  const paid = bills.filter((bill) => billDay(bill) <= todayDay);
  const upcoming = bills.filter((bill) => billDay(bill) > todayDay);
  const dueSoon = upcoming.filter(
    (bill) => billDay(bill) - todayDay <= DUE_SOON_DAYS
  );

  return {
    paid: summarise(paid),
    upcoming: summarise(upcoming),
    dueSoon: summarise(dueSoon),
  };
};
