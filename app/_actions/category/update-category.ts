"use server";

import { auth } from "@/auth";
import { updateCategory } from "@/db/category";
import {
  updateCategorySchema,
  UpdateCategorySchemaType,
} from "@/schema/category";
import { redirect } from "next/navigation";

export async function UpdateCategory(form: UpdateCategorySchemaType) {
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/");
  }

  const userId = session.user.email;

  const parsedForm = updateCategorySchema.safeParse(form);
  if (!parsedForm.success) {
    throw new Error(parsedForm.error.message);
  }

  const { id, name, icon, type } = parsedForm.data;

  return await updateCategory({ userId, id, name, icon, type });
}
