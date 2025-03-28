import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { DateRangeSchema } from "@/schema/stats";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const userId = session.user.email;

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const parsedParams = DateRangeSchema.safeParse({ from, to });
  if (!parsedParams.success) {
    return Response.json(parsedParams.error.message, { status: 400 });
  }

  const result = await GetBalance(
    userId,
    parsedParams.data.from,
    parsedParams.data.to,
  );
  return Response.json(result);
}

export type GetBalanceResponseType = Awaited<ReturnType<typeof GetBalance>>;

async function GetBalance(userId: string, from: string, to: string) {
  const income = await getSumByType(userId, from, to, "INCOME");
  const expense = await getSumByType(userId, from, to, "EXPENSE");
  const balance = await getBalance(userId);

  return { income, expense, balance };
}

async function getSumByType(
  userId: string,
  from: string,
  to: string,
  type: TransactionType,
) {
  const result = await prisma.transaction.aggregate({
    where: {
      userId,
      date: { gte: from, lte: to },
      type,
    },
    _sum: {
      amount: true,
    },
  });

  return result._sum.amount ?? 0;
}

async function getBalance(userId: string) {
  const result = await prisma.settings.findUnique({
    where: {
      userId,
    },
  });

  return result?.balance || 0;
}
