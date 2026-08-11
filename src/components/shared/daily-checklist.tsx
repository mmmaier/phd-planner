"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { fromDateStamp, type DateStamp } from "@/lib/dates";
import {
  useRoutinesForWeekday,
  useRoutineCompletionsForDate,
  setRoutineCompletion,
} from "@/lib/db/routines";
import { useTasksForDate, addTask, toggleTaskCompleted, deleteTask } from "@/lib/db/tasks";

type ChecklistRow = {
  key: string;
  label: string;
  completed: boolean;
  onToggle: (completed: boolean) => void;
  onRemove?: () => void;
};

export function DailyChecklist({ date }: { date: DateStamp }) {
  const weekday = fromDateStamp(date).getDay();

  const routines = useRoutinesForWeekday(weekday);
  const completions = useRoutineCompletionsForDate(date);
  const tasks = useTasksForDate(date);

  const [draft, setDraft] = useState("");

  const loading = routines === undefined || completions === undefined || tasks === undefined;

  const completedRoutineIds = new Set((completions ?? []).map((c) => c.routineId));

  const routineRows: ChecklistRow[] = (routines ?? []).map((r) => ({
    key: `routine-${r.id}`,
    label: r.title,
    completed: completedRoutineIds.has(r.id),
    onToggle: (completed) => setRoutineCompletion(r.id, date, completed),
  }));

  const taskRows: ChecklistRow[] = (tasks ?? []).map((t) => ({
    key: `task-${t.id}`,
    label: t.title,
    completed: t.completed,
    onToggle: (completed) => toggleTaskCompleted(t.id, completed),
    onRemove: () => deleteTask(t.id),
  }));

  const rows = [...routineRows, ...taskRows];
  const doneCount = rows.filter((r) => r.completed).length;

  async function handleAdd() {
    const title = draft.trim();
    if (!title) return;
    setDraft("");
    await addTask({
      title,
      date,
      completed: false,
      completedAt: null,
      projectId: null,
      priority: null,
      notes: "",
    });
  }

  return (
    <div>
      {rows.length > 0 && (
        <p className="mb-2 text-xs text-ink-faint">
          {doneCount}/{rows.length} done
        </p>
      )}

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-ink-faint">Nothing on the list yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <motion.li
                key={row.key}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="group flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-ink/5"
              >
                <Checkbox
                  checked={row.completed}
                  onCheckedChange={row.onToggle}
                  aria-label={row.label}
                />
                <span
                  className={
                    row.completed
                      ? "flex-1 text-sm text-ink-faint line-through transition-colors"
                      : "flex-1 text-sm text-ink transition-colors"
                  }
                >
                  {row.label}
                </span>
                {row.onRemove && (
                  <button
                    type="button"
                    onClick={row.onRemove}
                    aria-label={`Remove ${row.label}`}
                    className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <form
        className="mt-3 flex items-center gap-2 border-t border-border pt-3"
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
          placeholder="Add a task…"
          className="border-none bg-transparent px-0 py-1 focus:border-none"
        />
      </form>
    </div>
  );
}
