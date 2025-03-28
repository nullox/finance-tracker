import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { historyDataSchema } from "@/schema/history-data";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }
  const userId = session.user.email;

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  const parsedParams = historyDataSchema.pick({ year: true }).safeParse({
    year,
  });
  if (!parsedParams.success) {
    return Response.json(parsedParams.error.message, { status: 400 });
  }

  const result = await getHistoryYearData(userId, parsedParams.data.year);
  return Response.json(result);
}

export type GetYearDataResponseType = Awaited<
  ReturnType<typeof getHistoryYearData>
>;

async function getHistoryYearData(userId: string, year: number) {
  const result = await prisma.monthHistory.groupBy({
    by: ["year", "month"],
    where: { userId, year },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  if (result.length === 0) return null;

  return Array.from({ length: 12 }, (_, i) => {
    const existing = result.find((r) => r.month === i);
    return {
      month: existing?.month || i,
      income: existing?._sum.income || 0,
      expense: existing?._sum.expense || 0,
    };
  });
}
