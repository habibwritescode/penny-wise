import { z } from "zod";

const ERROR_FIELD_REQUIRED = "Field is required";
const ERROR_FIELD_INVALID = "Field is invalid";

export const nonEmpty = z
  .string({ message: ERROR_FIELD_INVALID })
  .trim()
  .refine((value) => value !== "", { message: ERROR_FIELD_REQUIRED });

export const MAX_AMOUNT = 1_000_000;

// Form inputs hold strings; the handlers convert with Number() on submit.
// Plain decimals only (no "1e12"), at most 2 decimal places, capped so a
// single entry can't produce amounts the layouts were never meant to show.
export const positiveAmount = z
  .string()
  .min(1, { message: "Required" })
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), {
    message: "Enter an amount with up to 2 decimal places",
  })
  .refine((value) => Number(value) > 0, {
    message: "Must be greater than 0",
  })
  .refine((value) => Number(value) <= MAX_AMOUNT, {
    message: "Must be $1,000,000 or less",
  });
