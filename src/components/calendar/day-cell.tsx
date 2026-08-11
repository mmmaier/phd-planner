"use client";

import { useState } from "react";
import { format } from "date-fns";
import { EventPill } from "./event-pill";
import { cn } from "@/lib/utils";
import { toDateStamp } from "@/lib/dates";
import type { CalendarItem } from "@/lib/calendar-items";
import { updateTask } from "@/lib/db/tasks";

const MAX_VISIBLE = 3;

export function DayCell({
  date,
  items,
  inCurrentMonth,
  isToday,
  onSelect,
  onSelectItem,
  compact = true,
}: {
  date: Date;
  items: CalendarItem[];
  inCurrentMonth: boolean;
  isToday: boolean;
  onSelect: () => void;
  onSelectItem: () => void;
  compact?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const stamp = toDateStamp(date);
  const visible = compact ? items.slice(0, MAX_VISIBLE) : items;
  const overflow = compact ? items.length - visible.length : 0;

  return (
    <div
      onClick={onSelect}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const taskId = e.dataTransfer.getData("text/task-id");
        if (taskId) updateTask(taskId, { date: stamp });
      }}
      className={cn(
        "flex min-h-24 cursor-pointer flex-col gap-1 border-b border-r border-border p-1.5 transition-colors last:border-r-0",
        inCurrentMonth ? "bg-surface" : "bg-background/60",
        dragOver && "bg-accent/10",
        "hover:bg-ink/[0.03]",
      )}
    >
      <span
        className={cn(
          "self-start rounded-full px-1.5 text-xs",
          isToday
            ? "bg-accent font-medium text-accent-foreground"
            : inCurrentMonth
              ? "text-ink-muted"
              : "text-ink-faint",
        )}
      >
        {format(date, "d")}
      </span>
      <div className="flex flex-col gap-0.5">
        {visible.map((item) => (
          <EventPill
            key={item.id}
            item={item}
            onClick={onSelectItem}
            draggable={item.kind === "task"}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/task-id", item.id);
            }}
          />
        ))}
        {overflow > 0 && (
          <span className="px-1.5 text-[11px] text-ink-faint">+{overflow} more</span>
        )}
      </div>
    </div>
  );
}
