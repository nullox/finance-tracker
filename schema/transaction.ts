import { isYMD } from "@/lib/utils";
import { TransactionType } from "@prisma/client";
import { z } from "zod";

const transactionSchema = z.object({
  id: z.number(),
  description: z.string().max(128).nullable(),
  amount: z.coerce.number().min(0.01).multipleOf(0.01),
  type: z.nativeEnum(TransactionType),
  date: z.string().refine((value) => isYMD(value)),
  categoryId: z.number().nullable(),
});

export const createTransactionSchema = transactionSchema.omit({ id: true });
export const updateTransactionSchema = transactionSchema
  .partial()
  .required({ id: true });
export const deleteTransactionSchema = transactionSchema.pick({ id: true });

export type CreateTransactionSchemaType = z.infer<
  typeof createTransactionSchema
>;
export type UpdateTransactionSchemaType = z.infer<
  typeof updateTransactionSchema
>;
export type DeleteTransactionSchemaType = z.infer<
  typeof deleteTransactionSchema
>;
