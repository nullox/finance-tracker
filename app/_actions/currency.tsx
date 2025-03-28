"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { currencySchema, CurrencySchemaType } from "@/schema/currency";
import { redirect } from "next/navigation";

export async function UpdateCurrency(form: CurrencySchemaType) {
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/");
  }

  const userId = session.user.email;

  const result = currencySchema.safeParse(form);
  if (!result.success) {
    throw new Error(result.error.message);
  }

  await prisma.settings.upsert({
    where: {
      userId,
    },
    update: {
      currency: result.data,
    },
    create: {
      userId,
      currency: result.data,
      balance: 0,
    },
  });
  return result.data;
}
