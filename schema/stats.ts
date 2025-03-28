import { MAX_DATE_RANGE_IN_DAYS } from "@/lib/constants";
import { dateToYMD, isYMD } from "@/lib/utils";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const DateRangeSchema = z
  .object({
    from: z.string().date(),
    to: z.string().date(),
  })
  .refine(({ from, to }) => {
    const difference = Math.abs(differenceInDays(from, to));
    return difference <= MAX_DATE_RANGE_IN_DAYS;
  })
  .refine(({ from, to }) => {
    return isYMD(from) && isYMD(to);
  });
