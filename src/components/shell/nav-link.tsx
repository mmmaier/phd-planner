"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";

export function NavLink({ href, label, icon: Icon }: NavItem) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent/10 text-accent-hover font-medium"
          : "text-ink-muted hover:bg-ink/5 hover:text-ink",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          isActive ? "text-accent-hover" : "text-ink-faint group-hover:text-ink-muted",
        )}
        strokeWidth={1.75}
      />
      <span>{label}</span>
    </Link>
  );
}
