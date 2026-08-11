"use client";

import { useState } from "react";
import { ListChecks, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUnprocessedInboxItems, addInboxItem, markInboxItemProcessed } from "@/lib/db/inbox";
import { addTask } from "@/lib/db/tasks";
import { INBOX_ITEM_TYPE_LABELS } from "@/lib/constants";
import type { InboxItemType } from "@/lib/db/types";

function guessType(content: string): InboxItemType {
  const trimmed = content.trim();
  if (/^https?:\/\//i.test(trimmed)) return "url";
  return "other";
}

export default function InboxPage() {
  const items = useUnprocessedInboxItems();
  const [draft, setDraft] = useState("");

  async function handleCapture() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setDraft("");
    await addInboxItem({ content: trimmed, guessedType: guessType(trimmed), processed: false });
  }

  async function handleConvertToTask(id: string, content: string) {
    await addTask({
      title: content,
      date: null,
      completed: false,
      completedAt: null,
      projectId: null,
      priority: null,
      notes: "",
    });
    await markInboxItemProcessed(id);
    toast.success("Added to tasks");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-ink-faint">Capture now, organize later</p>
        <h1 className="font-display text-3xl text-ink">Inbox</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCapture();
        }}
        className="mb-8 flex items-center gap-2"
      >
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="An idea, a paper, a URL, something to investigate…"
          className="py-3 text-base"
        />
        <Button type="submit" size="md" disabled={!draft.trim()}>
          Add
        </Button>
      </form>

      {items === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">Inbox zero. Nice.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <span className="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-[11px] text-ink-faint">
                {INBOX_ITEM_TYPE_LABELS[item.guessedType]}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.content}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConvertToTask(item.id, item.content)}
              >
                <ListChecks className="size-3.5" strokeWidth={1.75} />
                To task
              </Button>
              <button
                type="button"
                onClick={() => markInboxItemProcessed(item.id)}
                aria-label="Dismiss"
                className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
