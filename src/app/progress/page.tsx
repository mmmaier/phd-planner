"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { EditableText } from "@/components/ui/editable-text";
import { ProjectChipSelect } from "@/components/projects/project-chip-select";
import { ProjectColorPopover } from "@/components/projects/project-color-popover";
import { fromDateStamp, todayStamp } from "@/lib/dates";
import {
  useProgressEntries,
  addProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
} from "@/lib/db/progress-entries";
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
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-faint">What you actually got done</p>
          <h1 className="font-display text-3xl text-ink">Progress</h1>
        </div>
        <ProjectColorPopover />
      </div>

      {projects !== undefined && projects.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 text-xs text-ink-faint">
            Tag this entry to a project (tap again to clear):
          </p>
          <ProjectChipSelect
            projects={projects}
            selectedId={projectId}
            onSelect={setProjectId}
          />
        </div>
      )}

      <form
        className="mb-8 flex items-center gap-2 rounded-2xl border border-border bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <button
          type="submit"
          aria-label="Add"
          className="shrink-0 rounded-md p-0.5 text-ink-faint transition-colors hover:text-ink"
        >
          <Plus className="size-4" strokeWidth={1.75} />
        </button>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Implemented baseline model, found why experiment 3 was failing…"
          className="border-none bg-transparent px-0 focus:border-none"
        />
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
              <ul className="flex flex-col gap-1.5">
                {weekEntries.map((entry) => {
                  const project = projects?.find((p) => p.id === entry.projectId);
                  return (
                    <li
                      key={entry.id}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2"
                      style={{
                        backgroundColor: project
                          ? `color-mix(in oklab, ${project.color} 12%, transparent)`
                          : undefined,
                      }}
                    >
                      {project && (
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                      )}
                      <EditableText
                        value={entry.text}
                        onSave={(text) => updateProgressEntry(entry.id, { text })}
                        className="flex-1 text-sm"
                      />
                      {project && (
                        <span className="shrink-0 text-xs text-ink-muted">{project.title}</span>
                      )}
                      <span className="shrink-0 text-xs text-ink-faint">
                        {format(fromDateStamp(entry.date), "EEE")}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteProgressEntry(entry.id)}
                        aria-label="Delete entry"
                        className="shrink-0 rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                      >
                        <X className="size-3.5" />
                      </button>
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
