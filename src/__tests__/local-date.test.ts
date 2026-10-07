import { describe, expect, it } from "vitest";

import {
  addDays,
  addMonths,
  compareLocalDates,
  daysBetween,
  daysInMonth,
  isLocalDate,
  localDateToTimestamp,
  todayLocal,
  toLocalDate,
} from "@/utils/local-date";

describe("isLocalDate", () => {
  it("accepts real YYYY-MM-DD dates only", () => {
    expect(isLocalDate("2025-01-31")).toBe(true);
    expect(isLocalDate("2024-02-29")).toBe(true);
    for (const bad of ["2025-02-29", "2025-02-30", "2025-13-01", "2025-1-3", "", "2025-01-31T00:00"])
      expect(isLocalDate(bad), bad).toBe(false);
  });
});

describe("daysInMonth", () => {
  it("handles leap years", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2025, 2)).toBe(28);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(daysInMonth(2025, 12)).toBe(31);
  });
});

describe("addMonths", () => {
  it("clamps to the last day of shorter months", () => {
    expect(addMonths("2025-01-31", 1)).toBe("2025-02-28");
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29");
    expect(addMonths("2025-03-31", 1)).toBe("2025-04-30");
  });

  it("counts from the given date, so repeated steps from an anchor don't drift", () => {
    expect(addMonths("2025-01-31", 2)).toBe("2025-03-31");
    expect(addMonths("2025-01-31", 3)).toBe("2025-04-30");
  });

  it("rolls over years in both directions", () => {
    expect(addMonths("2025-11-15", 3)).toBe("2026-02-15");
    expect(addMonths("2025-01-15", -1)).toBe("2024-12-15");
    expect(addMonths("2024-02-29", 12)).toBe("2025-02-28");
    expect(addMonths("2024-02-29", 48)).toBe("2028-02-29");
  });
});

describe("addDays", () => {
  it("crosses month, year and leap-day boundaries", () => {
    expect(addDays("2025-01-31", 1)).toBe("2025-02-01");
    expect(addDays("2025-12-31", 1)).toBe("2026-01-01");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDays("2025-03-01", -1)).toBe("2025-02-28");
    expect(addDays("2025-01-01", 14)).toBe("2025-01-15");
  });

  it("is unaffected by daylight-saving changes", () => {
    // US clocks change on 9 Mar and 2 Nov 2025; EU on 30 Mar and 26 Oct.
    expect(addDays("2025-03-08", 1)).toBe("2025-03-09");
    expect(addDays("2025-03-29", 2)).toBe("2025-03-31");
    expect(addDays("2025-11-01", 7)).toBe("2025-11-08");
  });
});

describe("daysBetween", () => {
  it("counts whole calendar days, also across DST changes", () => {
    expect(daysBetween("2025-03-08", "2025-03-10")).toBe(2);
    expect(daysBetween("2025-01-01", "2025-12-31")).toBe(364);
    expect(daysBetween("2025-01-10", "2025-01-05")).toBe(-5);
  });
});

describe("compareLocalDates", () => {
  it("orders dates", () => {
    expect(compareLocalDates("2025-01-09", "2025-01-10")).toBeLessThan(0);
    expect(compareLocalDates("2025-02-01", "2025-01-31")).toBeGreaterThan(0);
    expect(compareLocalDates("2025-01-10", "2025-01-10")).toBe(0);
  });
});

describe("todayLocal / toLocalDate", () => {
  it("uses the local calendar date, not the UTC one", () => {
    // 23:30 local on 31 Dec: in any non-UTC timezone the UTC date differs
    // from the local one at one of these two times.
    expect(todayLocal(new Date(2024, 11, 31, 23, 30))).toBe("2024-12-31");
    expect(todayLocal(new Date(2025, 0, 1, 0, 15))).toBe("2025-01-01");
  });

  it("converts timestamps to their local calendar date", () => {
    const lateEvening = new Date(2025, 7, 17, 22, 0);
    expect(toLocalDate(lateEvening.toISOString())).toBe("2025-08-17");
  });
});

describe("localDateToTimestamp", () => {
  it("round-trips to the same local calendar day", () => {
    for (const date of ["2025-06-10", "2025-01-01", "2024-02-29", "2025-12-31"])
      expect(toLocalDate(localDateToTimestamp(date)), date).toBe(date);
  });
});
