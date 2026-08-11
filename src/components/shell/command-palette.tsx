"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useUiStore } from "@/store/ui-store";
import { allNavItems } from "./nav-items";

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/20 px-4 pt-[15vh] backdrop-blur-[2px]"
      onClick={() => setOpen(false)}
    >
      <Command
        label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface-raised shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        shouldFilter
      >
        <Command.Input
          autoFocus
          placeholder="Jump to…"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-ink-faint">
            No matches.
          </Command.Empty>
          <Command.Group
            heading="Go to"
            className="text-[11px] font-medium uppercase tracking-wide text-ink-faint [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2"
          >
            {allNavItems.map((item) => (
              <Command.Item
                key={item.href}
                value={item.label}
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent-hover"
              >
                <item.icon className="size-4 text-ink-faint" strokeWidth={1.75} />
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
