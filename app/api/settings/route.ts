import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }
  const userId = session.user.email;

  const result = await getSettings(userId);
  return Response.json(result);
}

export type GetSettingsResponseType = Awaited<ReturnType<typeof getSettings>>;

async function getSettings(userId: string) {
  return await prisma.settings.findUnique({
    where: { userId },
  });
}
