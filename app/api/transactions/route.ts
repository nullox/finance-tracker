import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Transaction } from "@prisma/client";
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

  const result = await getTransactions(
    userId,
    parsedParams.data.from,
    parsedParams.data.to,
  );
  return Response.json(result);
}

export type GetTransactionsResponseTypeRow = Transaction & {
  categoryName: string | null;
  categoryIcon: string | null;
};

export type GetTransactionsResponseType = GetTransactionsResponseTypeRow[];

async function getTransactions(
  userId: string,
  from: string,
  to: string,
): Promise<GetTransactionsResponseType> {
  return await prisma.$queryRaw`
    SELECT
      t.*,
      c.name as categoryName,
      c.icon as categoryIcon
    FROM
      "Transaction" t
    LEFT JOIN
      "Category" c ON t.categoryId = c.id
    WHERE
      t.userId = ${userId} AND
      t.date BETWEEN ${from} AND ${to}
    ORDER BY
      t.createdAt DESC
  `;
}
