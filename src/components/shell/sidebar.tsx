"use client";

import { Search } from "lucide-react";
import { NavLink } from "./nav-link";
import { primaryNavItems, secondaryNavItems, settingsNavItem } from "./nav-items";
import { useUiStore } from "@/store/ui-store";

export function Sidebar() {
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/60 px-4 py-6 md:flex">
      <div className="mb-8 px-2">
        <p className="font-display text-lg leading-tight text-ink">PhD Planner</p>
        <p className="text-xs text-ink-faint">your research operating system</p>
      </div>

      <button
        type="button"
        onClick={() => setCommandPaletteOpen(true)}
        className="mb-6 flex items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm text-ink-faint transition-colors hover:border-border-strong hover:text-ink-muted"
      >
        <Search className="size-4" strokeWidth={1.75} />
        <span className="flex-1 text-left">Quick add / search</span>
        <kbd className="rounded border border-border px-1.5 py-0.5 font-sans text-[10px] text-ink-faint">
          ⌘K
        </kbd>
      </button>

      <nav className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-0.5">
          {primaryNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            Reflect
          </p>
          {secondaryNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>

      <div className="mt-6 flex flex-col gap-0.5 border-t border-border pt-4">
        <NavLink {...settingsNavItem} />
      </div>
    </aside>
  );
}
