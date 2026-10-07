import { useMemo } from "react";

import Typography from "@/components/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useBoundStore from "@/lib/store/store";
import currencyFormatter from "@/utils/formatCurrency";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import getInitials from "@/utils/getInitials";
import { localDateToTimestamp, todayLocal } from "@/utils/local-date";
import { getBillRows } from "../utils";
import BillStatusBadge from "./bill-status-badge";
import { occurrenceStatus } from "../schedule";

// Every unpaid occurrence that's due, oldest first, each payable on its own.
const OverdueBills = () => {
  const bills = useBoundStore((store) => store.bills);
  const occurrences = useBoundStore((store) => store.occurrences);
  const markPaid = useBoundStore((store) => store.markPaid);
  const today = todayLocal();

  const due = useMemo(
    () =>
      getBillRows(bills, occurrences, today)
        .flatMap((row) =>
          row.unpaid.map((occurrence) => ({ bill: row.bill, occurrence }))
        )
        .sort((a, b) => a.occurrence.dueDate.localeCompare(b.occurrence.dueDate)),
    [bills, occurrences, today]
  );

  if (!due.length) return null;

  return (
    <section
      aria-labelledby="overdue-heading"
      className="mt-10 rounded-xl border-l-4 border-red bg-white p-6 sm:p-8"
    >
      <Typography tag="h2" variant="preset-2" id="overdue-heading">
        Needs paying
      </Typography>
      <Typography variant="preset-4" className="mt-1 text-grey-500">
        {due.length === 1
          ? "1 bill is due and hasn't been paid."
          : `${due.length} bills are due and haven't been paid.`}
      </Typography>

      <ul className="mt-4 divide-y divide-grey-100">
        {due.map(({ bill, occurrence }) => (
          <li
            key={occurrence.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4"
          >
            <Avatar className="shrink-0">
              <AvatarImage src={bill.avatar} alt={bill.name} />
              <AvatarFallback>{getInitials(bill.name)}</AvatarFallback>
            </Avatar>
            {/* A minimum width makes the amount and button wrap onto their own
                line on phones instead of squeezing the details. */}
            <div className="grid min-w-0 flex-1 basis-[13rem] gap-1">
              <Typography variant="preset-4-bold" className="truncate">
                {bill.name}
              </Typography>
              <div className="flex flex-wrap items-center gap-2">
                <BillStatusBadge status={occurrenceStatus(occurrence, today)} />
                <Typography variant="preset-5" className="text-grey-500">
                  Due{" "}
                  {dateTimeFormatter.formatToLongDate(
                    localDateToTimestamp(occurrence.dueDate)
                  )}
                </Typography>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Typography variant="preset-4-bold" className="whitespace-nowrap">
                {currencyFormatter.format(occurrence.amount)}
              </Typography>
              <Button
                size="sm"
                className="rounded-[8px]"
                onClick={() => markPaid(occurrence.id, todayLocal())}
                aria-label={`Mark ${bill.name} as paid`}
              >
                Mark as paid
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OverdueBills;
