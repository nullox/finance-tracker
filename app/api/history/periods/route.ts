import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }
  const userId = session.user.email;

  const result = await getPeriods(userId);
  return Response.json(result);
}

export type GetPeriodsResponseType = Awaited<ReturnType<typeof getPeriods>>;

async function getPeriods(userId: string) {
  const result = await prisma.monthHistory.groupBy({
    by: ["year"],
    where: {
      userId,
    },
    orderBy: {
      year: "asc",
    },
  });

  if (result.length === 0) {
    return [new Date().getFullYear()];
  }

  return result.map((i) => i.year);
}
