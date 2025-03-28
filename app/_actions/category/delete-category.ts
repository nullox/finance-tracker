"use server";

import { auth } from "@/auth";
import {
  deleteCategory,
  unassignCategory,
} from "@/db/category";
import prisma from "@/lib/prisma";
import {
  deleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/category";
import { redirect } from "next/navigation";

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/");
  }

  const userId = session.user.email;

  const parsedForm = deleteCategorySchema.safeParse(form);
  if (!parsedForm.success) {
    throw new Error(parsedForm.error.message);
  }

  const { id } = parsedForm.data;

  const result = await prisma.$transaction([
    unassignCategory({ userId, id }),
    deleteCategory({ userId, id }),
  ]);
  return result[1];
}
