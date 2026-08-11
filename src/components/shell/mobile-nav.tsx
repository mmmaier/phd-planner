"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, Search } from "lucide-react";
import { NavLink } from "./nav-link";
import { primaryNavItems, secondaryNavItems, settingsNavItem } from "./nav-items";
import { useUiStore } from "@/store/ui-store";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);

  return (
    <div className="flex items-center justify-between border-b border-border bg-surface/60 px-4 py-3 md:hidden">
      <p className="font-display text-base text-ink">PhD Planner</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Quick add / search"
          onClick={() => setCommandPaletteOpen(true)}
          className="rounded-lg p-2 text-ink-muted hover:bg-ink/5"
        >
          <Search className="size-5" strokeWidth={1.75} />
        </button>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Open navigation"
              className="rounded-lg p-2 text-ink-muted hover:bg-ink/5"
            >
              <Menu className="size-5" strokeWidth={1.75} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface px-4 py-6 shadow-xl outline-none">
              <div className="mb-6 flex items-center justify-between px-2">
                <Dialog.Title className="font-display text-lg text-ink">
                  PhD Planner
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5"
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </button>
                </Dialog.Close>
              </div>
              <nav
                className="flex flex-1 flex-col gap-6"
                onClick={() => setOpen(false)}
              >
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
                <div className="mt-auto flex flex-col gap-0.5 border-t border-border pt-4">
                  <NavLink {...settingsNavItem} />
                </div>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
