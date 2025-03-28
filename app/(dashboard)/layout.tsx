import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Header from "../_components/header";

interface Props {
  children: ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
