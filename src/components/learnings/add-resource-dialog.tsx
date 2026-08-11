"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { todayStamp } from "@/lib/dates";
import { addResource } from "@/lib/db/resources";
import { useTopics } from "@/lib/db/topics";
import { RESOURCE_TYPES } from "@/lib/db/types";
import { RESOURCE_TYPE_LABELS } from "@/lib/constants";

export function AddResourceDialog() {
  const topics = useTopics();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<(typeof RESOURCE_TYPES)[number]>("paper");
  const [duration, setDuration] = useState("");
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  function toggleTopic(id: string) {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  async function handleCreate() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    await addResource({
      title: trimmedTitle,
      url: url.trim(),
      type,
      topicIds: selectedTopicIds,
      notes: "",
      estimatedDurationMinutes: duration ? Number(duration) : null,
      status: "unread",
      dateAdded: todayStamp(),
      dateCompleted: null,
    });
    setOpen(false);
    setTitle("");
    setUrl("");
    setDuration("");
    setSelectedTopicIds([]);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <Plus className="size-4" strokeWidth={1.75} />
          Add resource
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface-raised p-6 shadow-2xl outline-none">
          <div className="mb-5 flex items-center justify-between">
            <Dialog.Title className="font-display text-lg text-ink">Add resource</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </Dialog.Close>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title…"
            />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as (typeof RESOURCE_TYPES)[number])}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {RESOURCE_TYPE_LABELS[t]}
                  </option>
                ))}
              </Select>
              <Input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Minutes (optional)"
              />
            </div>

            {topics !== undefined && topics.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs text-ink-faint">Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTopic(t.id)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs transition-colors",
                        selectedTopicIds.includes(t.id)
                          ? "border-transparent text-accent-foreground"
                          : "border-border text-ink-muted hover:border-border-strong",
                      )}
                      style={
                        selectedTopicIds.includes(t.id)
                          ? { backgroundColor: t.color }
                          : undefined
                      }
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="mt-1 self-end">
              Add resource
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
