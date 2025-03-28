"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Logout } from "../_actions/logout";
import DesktopNavbar from "./desktop-navbar";
import Logo from "./logo";
import MobileNavbar from "./mobile-navbar";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/manage", label: "Manage" },
];

export type NavLinksType = typeof navLinks;

export default function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl px-6 flex justify-between h-12">
        <Logo />
        <DesktopNavbar navLinks={navLinks} />
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <MobileNavbar navLinks={navLinks} />
          <form action={Logout} className="hidden md:block">
            <Button className="cursor-pointer" variant="ghost">
              <LogOut />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
