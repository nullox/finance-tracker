import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { historyDataSchema } from "@/schema/history-data";
import { getDaysInMonth } from "date-fns";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }
  const userId = session.user.email;

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const parsedParams = historyDataSchema.safeParse({ year, month });
  if (!parsedParams.success) {
    return Response.json(parsedParams.error.message, { status: 400 });
  }

  const result = await getMonthHistory(
    userId,
    parsedParams.data.year,
    parsedParams.data.month,
  );
  return Response.json(result);
}

export type GetMonthHistoryResponseType = Awaited<
  ReturnType<typeof getMonthHistory>
>;

async function getMonthHistory(userId: string, year: number, month: number) {
  const result = await prisma.dayHistory.groupBy({
    by: ["day"],
    where: { userId, month, year },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: { day: "asc" },
  });

  if (result.length === 0) return null;

  return Array.from({ length: getDaysInMonth(month) }, (_, i) => {
    const day = i + 1;
    const existing = result.find((r) => r.day === day);

    return {
      day: existing?.day || day,
      income: existing?._sum.income || 0,
      expense: existing?._sum.expense || 0,
    };
  });
}
