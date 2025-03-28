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

  const result = await getCategoriesStats(
    userId,
    parsedParams.data.from,
    parsedParams.data.to,
  );
  return Response.json(result);
}

async function getCategoriesStatsByType(
  userId: string,
  from: string,
  to: string,
  type: TransactionType,
) {
  return await prisma.$queryRaw<CategoriesStatsByType>`
    SELECT
      t.categoryId as id,
      c.name as name,
			c.icon as icon,
      SUM(t.amount) as amount
    FROM
      "Transaction" t
    LEFT JOIN
      "Category" c ON t.categoryId = c.id
    WHERE
      t.userId = ${userId}
      AND t.type = ${type}
			AND t.date >= ${from}
			AND t.date <= ${to}
    GROUP BY
      t.categoryId, c.name
		ORDER BY
			amount DESC
  `;
}

async function getCategoriesStats(
  userId: string,
  from: string,
  to: string,
): Promise<GetCategoriesStatsResponseType> {
  const incomeStats = await getCategoriesStatsByType(
    userId,
    from,
    to,
    "INCOME",
  );
  const expenseStats = await getCategoriesStatsByType(
    userId,
    from,
    to,
    "EXPENSE",
  );

  return {
    income: incomeStats,
    expense: expenseStats,
  };
}

export type CategoriesStatsByType = {
  id: string;
  name: string | null;
  icon: string | null;
  amount: number;
}[];

export type GetCategoriesStatsResponseType = {
  income: CategoriesStatsByType;
  expense: CategoriesStatsByType;
};
