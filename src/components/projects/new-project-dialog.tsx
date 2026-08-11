"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ColorSwatchPicker, PROJECT_COLORS } from "./color-swatch-picker";
import { addProject } from "@/lib/db/projects";
import { PROJECT_STATUSES, PRIORITIES } from "@/lib/db/types";
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";

export function NewProjectDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<(typeof PROJECT_STATUSES)[number]>("idea");
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>("medium");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [nextAction, setNextAction] = useState("");

  async function handleCreate() {
    const trimmed = title.trim();
    if (!trimmed) return;
    const project = await addProject({
      title: trimmed,
      description: "",
      status,
      priority,
      startDate: null,
      targetDate: null,
      nextAction: nextAction.trim(),
      notes: "",
      links: [],
      color,
      archived: false,
    });
    setOpen(false);
    setTitle("");
    setNextAction("");
    router.push(`/projects/${project.id}`);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <Plus className="size-4" strokeWidth={1.75} />
          New project
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface-raised p-6 shadow-2xl outline-none">
          <div className="mb-5 flex items-center justify-between">
            <Dialog.Title className="font-display text-lg text-ink">New project</Dialog.Title>
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
              placeholder="Project title…"
            />
            <Input
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="Next action (optional)…"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as (typeof PROJECT_STATUSES)[number])
                }
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {PROJECT_STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as (typeof PRIORITIES)[number])}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </Select>
            </div>
            <ColorSwatchPicker value={color} onChange={setColor} />
            <Button type="submit" className="mt-1 self-end">
              Create project
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
