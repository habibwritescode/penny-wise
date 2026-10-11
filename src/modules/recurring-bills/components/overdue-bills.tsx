import { useMemo, useState } from "react";
import { toast } from "sonner";

import Typography from "@/components/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useBoundStore from "@/lib/store/store";
import { cn } from "@/lib/utils";
import useNewSinceMount from "@/lib/use-new-since-mount";
import { COLLAPSE_MS, prefersReducedMotion } from "@/lib/motion";
import currencyFormatter from "@/utils/formatCurrency";
import dateTimeFormatter from "@/utils/dateTimeFormatter";
import getInitials from "@/utils/getInitials";
import { localDateToTimestamp, todayLocal } from "@/utils/local-date";
import type { IBillOccurrence, IRecurringBill } from "@/utils/types";
import { getBillRows } from "../utils";
import { occurrenceStatus } from "../schedule";
import BillStatusBadge from "./bill-status-badge";

// A paid row collapses before the payment is recorded, so the list (and the
// panel, when it's the last row) closes smoothly instead of jumping. Rows and
// the panel expand the same way when they come back (Undo, or a bill falling
// due), but not on page load. See .collapsible in globals.css.


// Bills missed for months can leave dozens of rows; the oldest few come first.
const COLLAPSED_COUNT = 5;

// Every unpaid occurrence that's due, oldest first, each payable on its own.
const OverdueBills = () => {
  const bills = useBoundStore((store) => store.bills);
  const occurrences = useBoundStore((store) => store.occurrences);
  const markPaid = useBoundStore((store) => store.markPaid);
  const unmarkPaid = useBoundStore((store) => store.unmarkPaid);
  const [leaving, setLeaving] = useState<ReadonlySet<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
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
  const isNewRow = useNewSinceMount(due.map(({ occurrence }) => occurrence.id));
  const isNewPanel = useNewSinceMount(due.length ? ["panel"] : []);

  if (!due.length) return null;

  const pay = (bill: IRecurringBill, occurrence: IBillOccurrence) => {
    const finish = () => {
      markPaid(occurrence.id, todayLocal());
      setLeaving((ids) => {
        const next = new Set(ids);
        next.delete(occurrence.id);
        return next;
      });
      toast.success(`${bill.name} marked as paid`, {
        description: `${currencyFormatter.format(occurrence.amount)} added to your transactions.`,
        action: { label: "Undo", onClick: () => unmarkPaid(occurrence.id) },
      });
    };

    if (prefersReducedMotion()) return finish();
    setLeaving((ids) => new Set(ids).add(occurrence.id));
    window.setTimeout(finish, COLLAPSE_MS);
  };

  const allLeaving = due.every(({ occurrence }) => leaving.has(occurrence.id));
  const hiddenCount = due.length - COLLAPSED_COUNT;
  const shown = showAll ? due : due.slice(0, COLLAPSED_COUNT);

  return (
    <div
      className={cn("collapsible", isNewPanel("panel") && "collapsible-enter")}
      data-closed={allLeaving}
    >
      <div className="min-h-0 overflow-hidden">
        <section
          aria-labelledby="overdue-heading"
          className="mt-10 rounded-xl border-l-4 border-red bg-white p-6 sm:p-8"
        >
          <Typography tag="h2" variant="preset-2" id="overdue-heading">
            Needs paying
          </Typography>
          <Typography variant="preset-4" className="mt-1 text-grey-500">
            {due.length === 1
              ? "1 payment is due and hasn't been made."
              : `${due.length} payments are due and haven't been made.`}
          </Typography>

          <ul className="mt-4 divide-y divide-grey-100">
            {shown.map(({ bill, occurrence }) => {
              const isLeaving = leaving.has(occurrence.id);

              return (
                <li
                  key={occurrence.id}
                  className={cn(
                    "collapsible",
                    isNewRow(occurrence.id) && "collapsible-enter"
                  )}
                  data-closed={isLeaving}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
                      <Avatar className="shrink-0">
                        <AvatarImage src={bill.avatar} alt={bill.name} />
                        <AvatarFallback>{getInitials(bill.name)}</AvatarFallback>
                      </Avatar>
                      {/* A minimum width makes the amount and button wrap onto
                          their own line on phones instead of squeezing the
                          details. */}
                      <div className="grid min-w-0 flex-1 basis-[13rem] gap-1">
                        <Typography
                          variant="preset-4-bold"
                          className="truncate"
                          title={bill.name}
                        >
                          {bill.name}
                        </Typography>
                        <div className="flex flex-wrap items-center gap-2">
                          <BillStatusBadge
                            status={occurrenceStatus(occurrence, today)}
                          />
                          <Typography variant="preset-5" className="text-grey-500">
                            Due{" "}
                            {dateTimeFormatter.formatToLongDate(
                              localDateToTimestamp(occurrence.dueDate)
                            )}
                          </Typography>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center gap-4">
                        <Typography
                          variant="preset-4-bold"
                          className="whitespace-nowrap"
                        >
                          {currencyFormatter.format(occurrence.amount)}
                        </Typography>
                        <Button
                          size="sm"
                          className="rounded-[8px]"
                          disabled={isLeaving}
                          onClick={() => pay(bill, occurrence)}
                          aria-label={`Mark ${bill.name} as paid`}
                        >
                          Mark as paid
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {hiddenCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 -ml-3 text-grey-500"
              aria-expanded={showAll}
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? "Show fewer" : `Show all ${due.length}`}
            </Button>
          )}
        </section>
      </div>
    </div>
  );
};

export default OverdueBills;
