import {
  addDays,
  addMonths,
  daysBetween,
  type LocalDate,
} from "@/utils/local-date";
import type {
  Cadence,
  IBillOccurrence,
  IRecurringBill,
  OccurrenceStatus,
} from "@/utils/types";

// A long-dormant weekly bill could have hundreds of missed occurrences; each
// run generates at most this many (oldest first) and the next run continues.
export const MAX_OCCURRENCES_PER_RUN = 24;
export const DUE_SOON_DAYS = 5;
// Guards the scan against a malformed anchor ever looping forever.
const MAX_SCAN = 10_000;

// The n-th due date (n = 0 is the anchor). Always computed from the anchor,
// never from the previous due date, so month-end schedules don't drift.
export const nthDueDate = (
  anchor: LocalDate,
  cadence: Cadence,
  n: number
): LocalDate => {
  switch (cadence) {
    case "weekly":
      return addDays(anchor, 7 * n);
    case "biweekly":
      return addDays(anchor, 14 * n);
    case "monthly":
      return addMonths(anchor, n);
    case "quarterly":
      return addMonths(anchor, 3 * n);
    case "yearly":
      return addMonths(anchor, 12 * n);
  }
};

/**
 * New occurrences for every due date that has arrived (dueDate <= today) and
 * hasn't been generated yet. Returns only the new ones; never duplicates a
 * (billId, dueDate) pair, so running it repeatedly is safe.
 */
export const generateDueOccurrences = (
  bill: IRecurringBill,
  existing: IBillOccurrence[],
  today: LocalDate,
  createId: () => string = () => crypto.randomUUID()
): IBillOccurrence[] => {
  const generated = new Set(
    existing
      .filter((occurrence) => occurrence.billId === bill.id)
      .map((occurrence) => occurrence.dueDate)
  );
  const created: IBillOccurrence[] = [];

  for (let n = 0; n < MAX_SCAN; n++) {
    const dueDate = nthDueDate(bill.anchorDate, bill.cadence, n);
    if (dueDate > today || created.length === MAX_OCCURRENCES_PER_RUN) break;
    if (generated.has(dueDate)) continue;

    created.push({
      id: createId(),
      billId: bill.id,
      dueDate,
      amount: bill.amount,
    });
  }

  return created;
};

// The first due date after today (today's own is already generated).
export const nextDueDate = (bill: IRecurringBill, today: LocalDate) => {
  for (let n = 0; n < MAX_SCAN; n++) {
    const dueDate = nthDueDate(bill.anchorDate, bill.cadence, n);
    if (dueDate > today) return dueDate;
  }
  throw new Error(`No due date found for bill ${bill.id}`);
};

// Generated occurrences are always due today or earlier.
export const occurrenceStatus = (
  occurrence: IBillOccurrence,
  today: LocalDate
): OccurrenceStatus => {
  if (occurrence.transactionId) return "paid";
  return occurrence.dueDate < today ? "overdue" : "due-today";
};

// For the next, not-yet-generated due date. A flat window for every cadence;
// for weekly bills it covers most of the cycle (see spec Decisions).
export const isDueSoon = (dueDate: LocalDate, today: LocalDate) => {
  const days = daysBetween(today, dueDate);
  return days > 0 && days <= DUE_SOON_DAYS;
};
