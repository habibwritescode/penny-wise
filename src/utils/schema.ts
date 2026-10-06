import { z } from "zod";

const ERROR_FIELD_REQUIRED = "Field is required";
const ERROR_FIELD_INVALID = "Field is invalid";

export const nonEmpty = z
  .string({ message: ERROR_FIELD_INVALID })
  .trim()
  .refine((value) => value !== "", { message: ERROR_FIELD_REQUIRED });

// Form inputs hold strings; the handlers convert with Number() on submit.
export const positiveAmount = z
  .string()
  .min(1, { message: "Required" })
  .refine((value) => Number(value) > 0, {
    message: "Must be greater than 0",
  });
