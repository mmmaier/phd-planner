"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { EditableText } from "@/components/ui/editable-text";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectChipSelect } from "@/components/projects/project-chip-select";
import { ProjectColorPopover } from "@/components/projects/project-color-popover";
import { relativeDayLabel, todayStamp } from "@/lib/dates";
import {
  useAllTasks,
  addTask,
  updateTask,
  toggleTaskCompleted,
  deleteTask,
} from "@/lib/db/tasks";
import { useActiveProjects } from "@/lib/db/projects";
import type { Task } from "@/lib/db/types";

function sortTodos(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const ad = a.deadline ?? "9999-99-99";
    const bd = b.deadline ?? "9999-99-99";
    if (ad !== bd) return ad.localeCompare(bd);
    return b.createdAt - a.createdAt;
  });
}

export default function TodosPage() {
  const tasks = useAllTasks();
  const projects = useActiveProjects();

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projectId, setProjectId] = useState("");

  async function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTitle("");
    setDeadline("");
    await addTask({
      title: trimmed,
      date: null,
      deadline: deadline || null,
      completed: false,
      completedAt: null,
      projectId: projectId || null,
      priority: null,
      notes: "",
    });
    toast.success("Added to your to-dos");
  }

  const todos = tasks ? sortTodos(tasks) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-faint">Everything you need to do</p>
          <h1 className="font-display text-3xl text-ink">To Dos</h1>
        </div>
        <ProjectColorPopover />
      </div>

      {projects !== undefined && projects.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 text-xs text-ink-faint">Tag to a project (tap again to clear):</p>
          <ProjectChipSelect projects={projects} selectedId={projectId} onSelect={setProjectId} />
        </div>
      )}

      <form
        className="mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-3"
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Something you need to get done…"
          className="min-w-0 flex-1 border-none bg-transparent px-0 focus:border-none"
        />
        <label className="flex shrink-0 items-center gap-1.5 text-xs text-ink-faint">
          Deadline
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="rounded-md border border-border bg-surface px-1.5 py-1 text-xs text-ink-muted outline-none"
          />
        </label>
      </form>

      {tasks === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : todos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">Nothing on your list — add something above.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1">
          {todos.map((t) => {
            const project = projects?.find((p) => p.id === t.projectId);
            const overdue = !t.completed && !!t.deadline && t.deadline < todayStamp();
            return (
              <li
                key={t.id}
                className="group flex items-center gap-3 rounded-xl px-3 py-2"
                style={{
                  backgroundColor: project
                    ? `color-mix(in oklab, ${project.color} 12%, transparent)`
                    : undefined,
                }}
              >
                <Checkbox
                  checked={t.completed}
                  onCheckedChange={(completed) => toggleTaskCompleted(t.id, completed)}
                  aria-label={t.title}
                />
                {project && (
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                )}
                <EditableText
                  value={t.title}
                  onSave={(value) => updateTask(t.id, { title: value })}
                  className={
                    t.completed ? "flex-1 text-sm text-ink-faint line-through" : "flex-1 text-sm"
                  }
                />
                {project && (
                  <span className="shrink-0 text-xs text-ink-muted">{project.title}</span>
                )}
                {t.deadline && (
                  <span
                    className={
                      overdue
                        ? "shrink-0 text-xs font-medium text-type-deadline"
                        : "shrink-0 text-xs text-ink-faint"
                    }
                  >
                    {relativeDayLabel(t.deadline)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => deleteTask(t.id)}
                  aria-label="Delete to-do"
                  className="shrink-0 rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
