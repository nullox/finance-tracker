"use server";

import { auth } from "@/auth";
import {
  deleteTransactionSchema,
  DeleteTransactionSchemaType,
} from "@/schema/transaction";
import { redirect } from "next/navigation";
import { deleteTransaction } from "@/db/transaction";
import { updateUserBalance } from "@/db/user-balance";
import { updateDayHistory } from "@/db/day-history";
import { updateMonthHistory } from "@/db/month-history";
import prisma from "@/lib/prisma";

export async function DeleteTransaction(form: DeleteTransactionSchemaType) {
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/");
  }

  const userId = session.user.email;

  const parsedForm = deleteTransactionSchema.safeParse(form);
  if (!parsedForm.success) {
    throw new Error(parsedForm.error.message);
  }

  const { id } = parsedForm.data;

  const transaction = await prisma.transaction.findUnique({
    where: { userId, id },
  });
  if (!transaction) {
    throw new Error("Unknown transaction");
  }

  const { amount, type, date } = transaction;
  const balanceDelta = type === "INCOME" ? -amount : amount;
  const income = type === "INCOME" ? -amount : 0;
  const expense = type === "EXPENSE" ? -amount : 0;

  const operations = [
    deleteTransaction({ userId, id }),
    updateUserBalance({ userId, balanceDelta }),
    updateDayHistory({ userId, income, expense, date }),
    updateMonthHistory({ userId, income, expense, date }),
  ].filter((op) => op !== null);

  await prisma.$transaction(operations);
  return transaction;
}
