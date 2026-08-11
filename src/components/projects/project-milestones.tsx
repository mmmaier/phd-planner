"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { fromDateStamp, todayStamp } from "@/lib/dates";
import {
  useMilestonesForProject,
  addMilestone,
  updateMilestone,
  deleteMilestone,
} from "@/lib/db/milestones";
import { MILESTONE_TYPES } from "@/lib/db/types";
import { MILESTONE_TYPE_LABELS } from "@/lib/constants";

export function ProjectMilestones({ projectId }: { projectId: string }) {
  const milestones = useMilestonesForProject(projectId);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<(typeof MILESTONE_TYPES)[number]>("other");
  const [date, setDate] = useState(todayStamp());

  async function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    await addMilestone({ title: trimmed, type, date, projectId, completed: false, notes: "" });
    setTitle("");
  }

  return (
    <div>
      <ul className="mb-3 flex flex-col gap-1">
        {(milestones ?? []).map((m) => (
          <li
            key={m.id}
            className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink/5"
          >
            <Checkbox
              checked={m.completed}
              onCheckedChange={(completed) => updateMilestone(m.id, { completed })}
              aria-label={m.title}
            />
            <span
              className={
                m.completed
                  ? "flex-1 text-sm text-ink-faint line-through"
                  : "flex-1 text-sm text-ink"
              }
            >
              {m.title}
            </span>
            <span className="text-xs text-ink-faint">{MILESTONE_TYPE_LABELS[m.type]}</span>
            <span className="text-xs text-ink-faint">
              {format(fromDateStamp(m.date), "MMM d")}
            </span>
            <button
              type="button"
              onClick={() => deleteMilestone(m.id)}
              aria-label={`Remove ${m.title}`}
              className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
        {milestones !== undefined && milestones.length === 0 && (
          <li className="px-2 text-sm text-ink-faint">No milestones yet.</li>
        )}
      </ul>

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <Plus className="size-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a milestone…"
          className="min-w-0 flex-1 border-none bg-transparent px-0 py-1 focus:border-none"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="shrink-0 rounded-md border border-border bg-surface px-1.5 py-1 text-xs text-ink-muted outline-none"
        />
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as (typeof MILESTONE_TYPES)[number])}
          className="w-auto shrink-0 py-1 pr-6 text-xs"
        >
          {MILESTONE_TYPES.map((t) => (
            <option key={t} value={t}>
              {MILESTONE_TYPE_LABELS[t]}
            </option>
          ))}
        </Select>
      </form>
    </div>
  );
}
