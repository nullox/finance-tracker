import { TransactionType } from "@prisma/client";
import { z } from "zod";

const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  type: z.nativeEnum(TransactionType),
});

export const createCategorySchema = categorySchema.omit({ id: true });
export const deleteCategorySchema = categorySchema.pick({ id: true });
export const updateCategorySchema = categorySchema
  .partial()
  .required({ id: true });

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
export type DeleteCategorySchemaType = z.infer<typeof deleteCategorySchema>;
export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;
