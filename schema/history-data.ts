import { z } from "zod";

export const historyDataSchema = z.object({
  month: z.coerce.number().min(0).max(11),
  year: z.coerce.number().min(2000).max(3000),
});
