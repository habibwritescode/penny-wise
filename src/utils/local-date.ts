// Calendar dates as "YYYY-MM-DD" strings in the user's local calendar.
// Bills are due on a *day*, not an instant, so dates never pass through UTC
// timestamps (which shift the day for anyone east or west of Greenwich).
// Arithmetic uses Date.UTC purely as a day counter, which has no DST gaps.
export type LocalDate = string;

const DAY_MS = 24 * 60 * 60 * 1000;
const PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (value: number, length = 2) => String(value).padStart(length, "0");

const format = (year: number, month: number, day: number): LocalDate =>
  `${pad(year, 4)}-${pad(month)}-${pad(day)}`;

// month is 1-12
export const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

const parse = (date: LocalDate) => {
  const match = PATTERN.exec(date);
  if (!match) throw new Error(`Invalid LocalDate: "${date}"`);
  const [year, month, day] = match.slice(1).map(Number);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month))
    throw new Error(`Invalid LocalDate: "${date}"`);
  return { year, month, day };
};

export const isLocalDate = (value: string): value is LocalDate => {
  try {
    parse(value);
    return true;
  } catch {
    return false;
  }
};

const toDayNumber = (date: LocalDate) => {
  const { year, month, day } = parse(date);
  return Date.UTC(year, month - 1, day) / DAY_MS;
};

const fromDayNumber = (dayNumber: number): LocalDate => {
  const date = new Date(dayNumber * DAY_MS);
  return format(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
};

export const addDays = (date: LocalDate, days: number): LocalDate =>
  fromDayNumber(toDayNumber(date) + days);

// Clamps to the last day of the target month: 31 Jan + 1 month = 28/29 Feb.
// Always add to the original anchor (anchor + n months), never step from the
// previous result, or a 31st-of-month schedule drifts to the 28th.
export const addMonths = (date: LocalDate, months: number): LocalDate => {
  const { year, month, day } = parse(date);
  const monthIndex = year * 12 + (month - 1) + months;
  const targetYear = Math.floor(monthIndex / 12);
  const targetMonth = (monthIndex % 12) + 1;
  return format(
    targetYear,
    targetMonth,
    Math.min(day, daysInMonth(targetYear, targetMonth))
  );
};

export const daysBetween = (from: LocalDate, to: LocalDate) =>
  toDayNumber(to) - toDayNumber(from);

// "YYYY-MM-DD" strings sort chronologically as plain strings.
export const compareLocalDates = (a: LocalDate, b: LocalDate) =>
  a < b ? -1 : a > b ? 1 : 0;

export const todayLocal = (now = new Date()): LocalDate =>
  format(now.getFullYear(), now.getMonth() + 1, now.getDate());

// For data stored as timestamps (e.g. existing transactions): the local day
// that instant falls on.
export const toLocalDate = (timestamp: string): LocalDate =>
  todayLocal(new Date(timestamp));

// For data stored as timestamps (transactions): local noon on that day, so
// the timestamp reads back as the same calendar day in any timezone.
export const localDateToTimestamp = (date: LocalDate): string => {
  const { year, month, day } = parse(date);
  return new Date(year, month - 1, day, 12).toISOString();
};
