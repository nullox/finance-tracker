import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NavLinksType } from "./header";

interface Props {
  navLinks: NavLinksType;
}

export default function DesktopNavbar({ navLinks }: Props) {
  const pathname = usePathname();
  const [underlineStyle, setUnderlineStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const navRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    const activeLink = navRef.current.querySelector(`[data-active="true"]`);
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink as HTMLElement;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [pathname, navLinks]);

  return (
    <nav ref={navRef} className="relative hidden items-center md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          data-active={link.href === pathname}
          className={cn(
            "relative px-4 py-2 text-muted-foreground hover:text-foreground transition-all",
            link.href === pathname && "text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
      {underlineStyle && (
        <motion.div
          className="absolute bottom-0 h-[2px] bg-foreground"
          initial={{ width: 0 }}
          animate={{ left: underlineStyle.left, width: underlineStyle.width }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </nav>
  );
}
