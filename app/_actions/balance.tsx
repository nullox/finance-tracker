"use server";

import { auth } from "@/auth";
import { FALLBACK_CURRENCY } from "@/lib/currencies";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const balanceSchema = z.number();

export async function UpdateBalance(balance: number) {
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/");
  }

  const userId = session.user.email;

  const result = balanceSchema.safeParse(balance);
  if (!result.success) {
    throw new Error(result.error.message);
  }

  await prisma.settings.upsert({
    where: {
      userId,
    },
    update: {
      balance,
    },
    create: {
      userId,
      balance,
      currency: FALLBACK_CURRENCY.value,
    },
  });
  return balance;
}
