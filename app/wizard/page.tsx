import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import CurrencyPicker from "@/app/_components/currency-picker";
import Link from "next/link";
import prisma from "@/lib/prisma";
import BalanceEditor from "../_components/balance-editor";

export const metadata = {
  title: "Wizard",
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }
  const userId = session.user.email;

  const settings = await prisma.settings.findUnique({
    where: { userId },
  });
  if (settings) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="px-4 w-full max-w-xl flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl">
            Welcome, <span className="font-bold">{session.user.name}</span>! 👋
          </h1>
          <p className="text-md text-muted-foreground">
            Let&apos;s get started by setting up some things
          </p>
          <p className="text-sm text-muted-foreground">
            You can change these settings at any time
          </p>
        </div>
        <Separator />
        <CurrencyPicker />
        <BalanceEditor />
        <Separator />
        <Button asChild>
          <Link href="/dashboard">I&apos;m done! Take me to the dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
