"use server";

import { auth } from "@/auth";
import { updateDayHistory } from "@/db/day-history";
import { updateMonthHistory } from "@/db/month-history";
import { updateTransaction } from "@/db/transaction";
import { updateUserBalance } from "@/db/user-balance";
import prisma from "@/lib/prisma";
import {
  UpdateTransactionSchemaType,
  updateTransactionSchema,
} from "@/schema/transaction";
import { redirect } from "next/navigation";

export async function UpdateTransaction(form: UpdateTransactionSchemaType) {
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/");
  }

  const userId = session.user.email;

  const parsedForm = updateTransactionSchema.safeParse(form);
  if (!parsedForm.success) {
    throw new Error(parsedForm.error.message);
  }

  const { id } = parsedForm.data;
  let { amount, categoryId, date, type, description } = parsedForm.data;

  const transaction = await prisma.transaction.findUnique({
    where: { userId, id },
  });
  if (!transaction) {
    throw new Error("Unknown transaction");
  }

  amount ??= transaction.amount;
  categoryId = categoryId === undefined ? transaction.categoryId : categoryId;
  date ??= transaction.date;
  type ??= transaction.type;
  description =
    description === undefined ? transaction.description : description;

  const oldIncome = transaction.type === "INCOME" ? transaction.amount : 0;
  const oldExpense = transaction.type === "EXPENSE" ? transaction.amount : 0;
  const newIncome = transaction.type === "INCOME" ? amount : 0;
  const newExpense = transaction.type === "EXPENSE" ? amount : 0;

  const incomeDelta = newIncome - oldIncome;
  const expenseDelta = newExpense - oldExpense;
  const balanceDelta = incomeDelta - expenseDelta;

  const operations = [
    updateTransaction({
      userId,
      id,
      amount,
      categoryId,
      date,
      type,
      description,
    }),
    updateUserBalance({ userId, balanceDelta }),
    updateDayHistory({
      userId,
      income: incomeDelta,
      expense: expenseDelta,
      date,
    }),
    updateMonthHistory({
      userId,
      income: incomeDelta,
      expense: expenseDelta,
      date,
    }),
  ].filter((op) => op !== null);

  await prisma.$transaction(operations);
  return transaction;
}
