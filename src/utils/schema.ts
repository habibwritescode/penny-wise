import { z } from "zod";

const ERROR_FIELD_REQUIRED = "Field is required";
const ERROR_FIELD_INVALID = "Field is invalid";

export const nonEmpty = z
  .string({ message: ERROR_FIELD_INVALID })
  .trim()
  .refine((value) => value !== "", { message: ERROR_FIELD_REQUIRED });
