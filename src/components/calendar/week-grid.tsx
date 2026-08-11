"use client";

import { format } from "date-fns";
import { getWeekDays, isInMonth, isToday, toDateStamp } from "@/lib/dates";
import {
  useCalendarItemsInRange,
  groupItemsByDate,
  type CalendarItem,
} from "@/lib/calendar-items";
import { EventPill } from "./event-pill";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import { updateTask } from "@/lib/db/tasks";
import { useState } from "react";

export function WeekGrid({ anchorDate }: { anchorDate: Date }) {
  const days = getWeekDays(anchorDate, 1);
  const start = toDateStamp(days[0]);
  const end = toDateStamp(days[6]);

  const { items } = useCalendarItemsInRange(start, end);
  const byDate = items ? groupItemsByDate(items) : new Map();

  const setSelectedDate = useUiStore((s) => s.setSelectedDate);

  return (
    <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-border">
      {days.map((date) => {
        const stamp = toDateStamp(date);
        return (
          <WeekDayColumn
            key={stamp}
            date={date}
            stamp={stamp}
            items={byDate.get(stamp) ?? []}
            inCurrentMonth={isInMonth(date, anchorDate)}
            isToday={isToday(date)}
            onSelect={() => setSelectedDate(stamp)}
          />
        );
      })}
    </div>
  );
}

function WeekDayColumn({
  date,
  stamp,
  items,
  inCurrentMonth,
  isToday: today,
  onSelect,
}: {
  date: Date;
  stamp: string;
  items: CalendarItem[];
  inCurrentMonth: boolean;
  isToday: boolean;
  onSelect: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);

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
        "flex min-h-[28rem] cursor-pointer flex-col gap-1.5 border-r border-border p-2 transition-colors last:border-r-0",
        inCurrentMonth ? "bg-surface" : "bg-background/60",
        dragOver && "bg-accent/10",
        "hover:bg-ink/[0.03]",
      )}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          {format(date, "EEE")}
        </span>
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-full text-xs",
            today ? "bg-accent font-medium text-accent-foreground" : "text-ink-muted",
          )}
        >
          {format(date, "d")}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <EventPill
            key={item.id}
            item={item}
            onClick={onSelect}
            draggable={item.kind === "task"}
            onDragStart={(e) => e.dataTransfer.setData("text/task-id", item.id)}
          />
        ))}
      </div>
    </div>
  );
}
