"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { fromDateStamp, todayStamp } from "@/lib/dates";
import { useProgressEntries, addProgressEntry } from "@/lib/db/progress-entries";
import { useActiveProjects } from "@/lib/db/projects";
import type { ProgressEntry } from "@/lib/db/types";

function groupByWeek(entries: ProgressEntry[]) {
  const groups = new Map<string, ProgressEntry[]>();
  for (const entry of entries) {
    const weekLabel = format(fromDateStamp(entry.date), "'Week of' MMM d, yyyy");
    const existing = groups.get(weekLabel);
    if (existing) existing.push(entry);
    else groups.set(weekLabel, [entry]);
  }
  return groups;
}

export default function ProgressPage() {
  const entries = useProgressEntries();
  const projects = useActiveProjects();

  const [text, setText] = useState("");
  const [projectId, setProjectId] = useState<string>("");

  async function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    await addProgressEntry({
      text: trimmed,
      date: todayStamp(),
      projectId: projectId || null,
    });
    toast.success("Progress logged");
  }

  const groups = entries ? groupByWeek(entries) : new Map<string, ProgressEntry[]>();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm text-ink-faint">What you actually got done</p>
        <h1 className="font-display text-3xl text-ink">Progress</h1>
      </div>

      <form
        className="mb-8 flex items-center gap-2 rounded-2xl border border-border bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <Plus className="size-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Implemented baseline model, found why experiment 3 was failing…"
          className="border-none bg-transparent px-0 focus:border-none"
        />
        {projects !== undefined && projects.length > 0 && (
          <Select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-auto shrink-0 py-1.5 pr-7 text-xs"
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </Select>
        )}
      </form>

      {entries === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">
            Nothing logged yet — even small wins are worth recording.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Array.from(groups.entries()).map(([week, weekEntries]) => (
            <div key={week}>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
                {week}
              </h2>
              <ul className="flex flex-col gap-1">
                {weekEntries.map((entry) => {
                  const project = projects?.find((p) => p.id === entry.projectId);
                  return (
                    <li
                      key={entry.id}
                      className="flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-ink/[0.03]"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-type-milestone" />
                      <span className="flex-1 text-sm text-ink">{entry.text}</span>
                      {project && (
                        <span className="shrink-0 text-xs text-ink-faint">{project.title}</span>
                      )}
                      <span className="shrink-0 text-xs text-ink-faint">
                        {format(fromDateStamp(entry.date), "EEE")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
