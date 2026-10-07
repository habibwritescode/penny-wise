import { useMemo } from "react";

import useBoundStore from "@/lib/store/store";
import { todayLocal } from "@/utils/local-date";
import { getBillRows, summariseBills } from "./utils";

// Shared by the Recurring Bills page and the overview card so they always agree.
const useBillSummary = () => {
  const bills = useBoundStore((store) => store.bills);
  const occurrences = useBoundStore((store) => store.occurrences);
  const today = todayLocal();

  return useMemo(
    () => summariseBills(getBillRows(bills, occurrences, today)),
    [bills, occurrences, today]
  );
};

export default useBillSummary;
