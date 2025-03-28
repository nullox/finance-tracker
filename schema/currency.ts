import { currencies } from "@/lib/currencies";
import { z } from "zod";

export const allowedValues = new Set(
  currencies.map((currency) => currency.value),
);

export const currencySchema = z
  .string()
  .refine((currency) => allowedValues.has(currency), "Unknown currency");

export type CurrencySchemaType = z.infer<typeof currencySchema>;
