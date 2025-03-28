"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NavLinksType } from "./header";
import { Logout } from "../_actions/logout";

interface Props {
  navLinks: NavLinksType;
}

export default function MobileNavbar({ navLinks }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        className="before:bg-foreground after:bg-foreground hover:bg-accent relative flex cursor-pointer items-center justify-center rounded-md p-4 transition-all before:absolute before:h-0.5 before:w-5 before:translate-y-[5px] before:transition-all after:absolute after:h-0.5 after:w-5 after:-translate-y-[5px] after:transition-all"
        onClick={() => setIsOpen((prev) => !prev)}
      ></button>

      {isOpen && (
        <div
          className="absolute inset-0 bg-white/30 backdrop-blur-md dark:bg-black/30 z-20"
          style={{
            // Fix for some browsers
            WebkitBackdropFilter: "blur(12px)",
            backdropFilter: "blur(12px)",
          }}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          >
            {/* Menu content */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute top-0 right-0 flex h-full w-full max-w-xs flex-col justify-between p-8 shadow-lg bg-white dark:bg-black/80 border-l"
            >
              <ul className="flex h-full flex-col justify-center space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block py-2 text-2xl font-medium text-gray-900 dark:text-gray-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </ul>
              <form action={Logout}>
                <button className="dark:text-foreground flex cursor-pointer items-center gap-2 py-2 text-xl font-medium text-gray-900">
                  <LogOut /> Log out
                </button>
              </form>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
