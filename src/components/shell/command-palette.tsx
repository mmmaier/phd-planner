"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Inbox } from "lucide-react";
import { toast } from "sonner";
import { useUiStore } from "@/store/ui-store";
import { allNavItems } from "./nav-items";
import { addInboxItem } from "@/lib/db/inbox";

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);

  // Clear the search when the palette closes — done during render (per
  // React's guidance) rather than in an effect, to avoid an extra render.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) setSearch("");
  }

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

  const matchingNavItems = allNavItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleCaptureToInbox() {
    const content = search.trim();
    if (!content) return;
    await addInboxItem({
      content,
      guessedType: /^https?:\/\//i.test(content) ? "url" : "other",
      processed: false,
    });
    toast.success("Added to inbox");
    setOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/20 px-4 pt-[15vh] backdrop-blur-[2px]"
      onClick={() => setOpen(false)}
    >
      <Command
        label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface-raised shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        shouldFilter={false}
      >
        <Command.Input
          autoFocus
          value={search}
          onValueChange={setSearch}
          placeholder="Jump to… or type to capture something for later"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          {matchingNavItems.length > 0 && (
            <Command.Group
              heading="Go to"
              className="text-[11px] font-medium uppercase tracking-wide text-ink-faint [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2"
            >
              {matchingNavItems.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.href}
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
          )}

          {search.trim().length > 0 && (
            <Command.Group
              heading="Capture"
              className="text-[11px] font-medium uppercase tracking-wide text-ink-faint [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2"
            >
              <Command.Item
                value="capture-to-inbox"
                onSelect={handleCaptureToInbox}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent-hover"
              >
                <Inbox className="size-4 text-ink-faint" strokeWidth={1.75} />
                Add &ldquo;{search.trim()}&rdquo; to inbox
              </Command.Item>
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}
