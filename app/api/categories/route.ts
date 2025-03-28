import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { z } from "zod";

const paramsSchema = z.object({
  type: z.nativeEnum(TransactionType).optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const userId = session.user.email;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;

  const parsedParams = paramsSchema.safeParse({ type });
  if (!parsedParams.success) {
    return Response.json(parsedParams.error.message, { status: 400 });
  }

  const result = await getCategories(userId, parsedParams.data.type);
  return Response.json(result);
}

export type GetCategoriesResponseType = Awaited<
  ReturnType<typeof getCategories>
>;

async function getCategories(userId: string, type?: TransactionType) {
  if (!type) {
    return await getAllCategories(userId);
  }

  return {
    [type]: await getCategoriesByType(userId, type),
  };
}

async function getAllCategories(userId: string) {
  return {
    INCOME: await getCategoriesByType(userId, "INCOME"),
    EXPENSE: await getCategoriesByType(userId, "EXPENSE"),
  };
}

async function getCategoriesByType(userId: string, type: TransactionType) {
  return await prisma.category.findMany({
    where: {
      userId,
      type,
    },
    orderBy: {
      name: "asc",
    },
  });
}
