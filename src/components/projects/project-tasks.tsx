"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { relativeDayLabel } from "@/lib/dates";
import {
  useTasksForProject,
  addTask,
  toggleTaskCompleted,
  deleteTask,
} from "@/lib/db/tasks";

export function ProjectTasks({ projectId }: { projectId: string }) {
  const tasks = useTasksForProject(projectId);
  const [title, setTitle] = useState("");

  async function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTitle("");
    await addTask({
      title: trimmed,
      date: null,
      completed: false,
      completedAt: null,
      projectId,
      priority: null,
      notes: "",
    });
  }

  const sorted = [...(tasks ?? [])].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <div>
      <ul className="mb-3 flex flex-col gap-1">
        {sorted.map((t) => (
          <li
            key={t.id}
            className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink/5"
          >
            <Checkbox
              checked={t.completed}
              onCheckedChange={(completed) => toggleTaskCompleted(t.id, completed)}
              aria-label={t.title}
            />
            <span
              className={
                t.completed
                  ? "flex-1 text-sm text-ink-faint line-through"
                  : "flex-1 text-sm text-ink"
              }
            >
              {t.title}
            </span>
            {t.date && (
              <span className="text-xs text-ink-faint">{relativeDayLabel(t.date)}</span>
            )}
            <button
              type="button"
              onClick={() => deleteTask(t.id)}
              aria-label={`Remove ${t.title}`}
              className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
        {tasks !== undefined && tasks.length === 0 && (
          <li className="px-2 text-sm text-ink-faint">No tasks linked yet.</li>
        )}
      </ul>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <Plus className="size-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task…"
          className="border-none bg-transparent px-0 py-1 focus:border-none"
        />
      </form>
    </div>
  );
}
