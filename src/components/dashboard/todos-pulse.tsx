"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectChipSelect } from "@/components/projects/project-chip-select";
import { relativeDayLabel, todayStamp } from "@/lib/dates";
import { useAllTasks, addTask, toggleTaskCompleted } from "@/lib/db/tasks";
import { useActiveProjects } from "@/lib/db/projects";

const VISIBLE_LIMIT = 5;

export function TodosPulse() {
  const tasks = useAllTasks();
  const projects = useActiveProjects();

  const [draft, setDraft] = useState("");
  const [projectId, setProjectId] = useState("");

  // General (unscheduled) to-dos only — anything with a specific `date` is
  // already surfaced in Today's checks, so this avoids showing it twice.
  const backlog = (tasks ?? [])
    .filter((t) => !t.completed && !t.date)
    .sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999"));

  async function handleAdd() {
    const title = draft.trim();
    if (!title) return;
    setDraft("");
    await addTask({
      title,
      date: null,
      deadline: null,
      completed: false,
      completedAt: null,
      projectId: projectId || null,
      priority: null,
      notes: "",
    });
    toast.success("Added to your to-dos");
  }

  return (
    <Panel>
      <PanelHeading
        action={
          <Link href="/todos" className="text-xs text-ink-faint hover:text-ink">
            View all
          </Link>
        }
      >
        To Dos
      </PanelHeading>

      {tasks === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : backlog.length === 0 ? (
        <p className="text-sm text-ink-faint">Nothing outstanding — add something below.</p>
      ) : (
        <ul className="mb-1 flex flex-col gap-1">
          {backlog.slice(0, VISIBLE_LIMIT).map((t) => {
            const project = projects?.find((p) => p.id === t.projectId);
            const overdue = !!t.deadline && t.deadline < todayStamp();
            return (
              <li key={t.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-ink/5">
                <Checkbox
                  checked={t.completed}
                  onCheckedChange={(completed) => toggleTaskCompleted(t.id, completed)}
                  aria-label={t.title}
                />
                {project && (
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                )}
                <span className="flex-1 truncate text-sm text-ink">{t.title}</span>
                {t.deadline && (
                  <span
                    className={
                      overdue ? "text-xs font-medium text-type-deadline" : "text-xs text-ink-faint"
                    }
                  >
                    {relativeDayLabel(t.deadline)}
                  </span>
                )}
              </li>
            );
          })}
          {backlog.length > VISIBLE_LIMIT && (
            <li className="px-2 text-xs text-ink-faint">
              +{backlog.length - VISIBLE_LIMIT} more
            </li>
          )}
        </ul>
      )}

      <div className="mt-2 border-t border-border pt-3">
        {projects !== undefined && projects.length > 0 && (
          <div className="mb-2">
            <ProjectChipSelect projects={projects} selectedId={projectId} onSelect={setProjectId} />
          </div>
        )}
        <form
          className="flex items-center gap-2"
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
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a to-do…"
            className="border-none bg-transparent px-0 py-1 focus:border-none"
          />
        </form>
      </div>
    </Panel>
  );
}
