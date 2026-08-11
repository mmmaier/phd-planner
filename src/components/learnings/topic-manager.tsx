"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Plus, Settings2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ColorSwatchPicker, ACCENT_COLORS } from "@/components/ui/color-swatch-picker";
import { useTopics, addTopic, deleteTopic } from "@/lib/db/topics";

export function TopicManager() {
  const topics = useTopics();
  const [name, setName] = useState("");
  const [color, setColor] = useState(ACCENT_COLORS[0]);

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addTopic({ name: trimmed, color });
    setName("");
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-muted hover:border-border-strong hover:text-ink"
        >
          <Settings2 className="size-3.5" strokeWidth={1.75} />
          Topics
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-40 w-72 rounded-xl border border-border bg-surface-raised p-4 shadow-xl outline-none"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Your topics
          </p>
          <ul className="mb-3 flex flex-col gap-1">
            {(topics ?? []).map((t) => (
              <li key={t.id} className="group flex items-center gap-2 rounded-lg px-1.5 py-1">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <span className="flex-1 text-sm text-ink">{t.name}</span>
                <button
                  type="button"
                  onClick={() => deleteTopic(t.id)}
                  aria-label={`Remove ${t.name}`}
                  className="rounded p-0.5 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
            {topics !== undefined && topics.length === 0 && (
              <li className="px-1.5 text-sm text-ink-faint">No topics yet.</li>
            )}
          </ul>
          <form
            className="flex flex-col gap-2 border-t border-border pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <div className="flex items-center gap-2">
              <Plus className="size-3.5 shrink-0 text-ink-faint" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New topic…"
                className="border-none bg-transparent px-0 py-1 text-sm focus:border-none"
              />
            </div>
            <ColorSwatchPicker value={color} onChange={setColor} />
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
