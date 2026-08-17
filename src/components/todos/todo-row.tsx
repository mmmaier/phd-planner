"use client";

import * as Popover from "@radix-ui/react-popover";
import { Tag, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { EditableText } from "@/components/ui/editable-text";
import { ProjectChipSelect } from "@/components/projects/project-chip-select";
import { todayStamp } from "@/lib/dates";
import { updateTask, toggleTaskCompleted, deleteTask } from "@/lib/db/tasks";
import type { Task, Project } from "@/lib/db/types";

export function TodoRow({ task, projects }: { task: Task; projects: Project[] }) {
  const project = projects.find((p) => p.id === task.projectId);
  const overdue = !task.completed && !!task.deadline && task.deadline < todayStamp();

  return (
    <li
      className="group flex items-center gap-2.5 rounded-xl px-3 py-2"
      style={{
        backgroundColor: project
          ? `color-mix(in oklab, ${project.color} 12%, transparent)`
          : undefined,
      }}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(completed) => toggleTaskCompleted(task.id, completed)}
        aria-label={task.title}
      />

      <EditableText
        value={task.title}
        onSave={(value) => updateTask(task.id, { title: value })}
        className={
          task.completed ? "flex-1 text-sm text-ink-faint line-through" : "flex-1 text-sm"
        }
      />

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors hover:bg-ink/5"
            style={{ color: project ? project.color : undefined }}
          >
            {project ? (
              <>
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.title}
              </>
            ) : (
              <span className="flex items-center gap-1 text-ink-faint">
                <Tag className="size-3" strokeWidth={1.75} />
                Project
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={6}
            className="z-40 w-64 rounded-xl border border-border bg-surface-raised p-3 shadow-xl outline-none"
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
              Project
            </p>
            <ProjectChipSelect
              projects={projects}
              selectedId={task.projectId ?? ""}
              onSelect={(id) => updateTask(task.id, { projectId: id || null })}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <input
        type="date"
        value={task.deadline ?? ""}
        onChange={(e) => updateTask(task.id, { deadline: e.target.value || null })}
        className={
          overdue
            ? "shrink-0 rounded-md border border-type-deadline/30 bg-surface px-1.5 py-1 text-xs font-medium text-type-deadline outline-none"
            : "shrink-0 rounded-md border border-border bg-surface px-1.5 py-1 text-xs text-ink-muted outline-none"
        }
      />

      <button
        type="button"
        onClick={() => deleteTask(task.id)}
        aria-label="Delete to-do"
        className="shrink-0 rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </li>
  );
}
