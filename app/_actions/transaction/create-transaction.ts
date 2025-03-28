"use server";

import { auth } from "@/auth";
import {
  createTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { redirect } from "next/navigation";
import { createTransaction } from "@/db/transaction";
import { updateUserBalance } from "@/db/user-balance";
import { updateDayHistory } from "@/db/day-history";
import { updateMonthHistory } from "@/db/month-history";
import prisma from "@/lib/prisma";
import { Transaction } from "@prisma/client";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/");
  }

  const userId = session.user.email;

  const parsedForm = createTransactionSchema.safeParse(form);
  if (!parsedForm.success) {
    throw new Error(parsedForm.error.message);
  }

  const { amount, categoryId, date, type, description } = parsedForm.data;

  const balanceDelta = type === "INCOME" ? amount : -amount;
  const income = type === "INCOME" ? amount : 0;
  const expense = type === "EXPENSE" ? amount : 0;

  const operations = [
    createTransaction({ userId, amount, categoryId, date, type, description }),
    updateUserBalance({ userId, balanceDelta }),
    updateDayHistory({ userId, income, expense, date }),
    updateMonthHistory({ userId, income, expense, date }),
  ].filter((op) => op !== null);

  const [transaction] = await prisma.$transaction(operations);
  return transaction as Transaction;
}
