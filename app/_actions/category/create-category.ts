"use server";

import { auth } from "@/auth";
import { createCategory } from "@/db/category";
import {
  createCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/category";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/");
  }

  const userId = session.user.email;

  const parsedForm = createCategorySchema.safeParse(form);
  if (!parsedForm.success) {
    throw new Error(parsedForm.error.message);
  }

  const { name, icon, type } = parsedForm.data;

  return await createCategory({ userId, name, icon, type });
}
