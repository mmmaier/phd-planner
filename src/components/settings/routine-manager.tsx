"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";
import { addRoutine, updateRoutine, deleteRoutine } from "@/lib/db/routines";
import { WEEKDAY_LABELS } from "@/lib/constants";
import { ACCENT_COLORS } from "@/components/ui/color-swatch-picker";

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function RoutineManager() {
  const routines = useLiveQuery(
    () => db.routines.filter((r) => !r.archived).toArray(),
    [],
  );
  const [title, setTitle] = useState("");

  async function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTitle("");
    await addRoutine({
      title: trimmed,
      weekdays: [1, 2, 3, 4, 5],
      color: ACCENT_COLORS[0],
      active: true,
      archived: false,
    });
  }

  function toggleWeekday(routineId: string, weekdays: number[], day: number) {
    const next = weekdays.includes(day)
      ? weekdays.filter((d) => d !== day)
      : [...weekdays, day];
    updateRoutine(routineId, { weekdays: next });
  }

  return (
    <div>
      <ul className="mb-4 flex flex-col gap-3">
        {(routines ?? []).map((r) => (
          <li key={r.id} className="group flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-ink/5">
            <span className="w-32 shrink-0 truncate text-sm text-ink">{r.title}</span>
            <div className="flex items-center gap-1">
              {WEEKDAY_ORDER.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleWeekday(r.id, r.weekdays, day)}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-[10px] transition-colors",
                    r.weekdays.includes(day)
                      ? "bg-accent/15 text-accent-hover"
                      : "text-ink-faint hover:bg-ink/5",
                  )}
                >
                  {WEEKDAY_LABELS[day][0]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => deleteRoutine(r.id)}
              aria-label={`Remove ${r.title}`}
              className="ml-auto rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
        {routines !== undefined && routines.length === 0 && (
          <li className="px-2 text-sm text-ink-faint">No recurring checks yet.</li>
        )}
      </ul>

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a recurring check (e.g. Exercise)…"
          className="border-none bg-transparent px-0 py-1 focus:border-none"
        />
      </form>
    </div>
  );
}
