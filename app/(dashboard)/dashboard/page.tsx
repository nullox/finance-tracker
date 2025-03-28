import CreateTransactionDialog from "../_components/create-transaction-dialog";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import Sections from "./sections";

export const metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <div className="bg-card border-b">
        <div className="flex-col gap-4 items-center md:flex-row mx-auto max-w-7xl flex justify-between py-6 px-6">
          <h1 className="text-3xl font-bold">Hello, {session.user?.name} 👋</h1>
          <div className="flex gap-4">
            <CreateTransactionDialog
              type="INCOME"
              trigger={
                <Button className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer border-emerald-500/20 border">
                  New income <TrendingUp />
                </Button>
              }
            />
            <CreateTransactionDialog
              type="EXPENSE"
              trigger={
                <Button className="bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer border-red-500/20 border">
                  New expense <TrendingDown />
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <Sections />
    </>
  );
}
