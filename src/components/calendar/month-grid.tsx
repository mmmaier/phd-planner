"use client";

import { getMonthGrid, isInMonth, isToday, toDateStamp } from "@/lib/dates";
import { useCalendarItemsInRange, groupItemsByDate } from "@/lib/calendar-items";
import { DayCell } from "./day-cell";
import { WEEKDAY_LABELS } from "@/lib/constants";
import { useUiStore } from "@/store/ui-store";

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sun, matches weekStartsOn: 1

export function MonthGrid({ monthDate }: { monthDate: Date }) {
  const weeks = getMonthGrid(monthDate, 1);
  const start = toDateStamp(weeks[0][0]);
  const end = toDateStamp(weeks[weeks.length - 1][6]);

  const { items } = useCalendarItemsInRange(start, end);
  const byDate = items ? groupItemsByDate(items) : new Map();

  const setSelectedDate = useUiStore((s) => s.setSelectedDate);

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-surface/60">
        {WEEKDAY_ORDER.map((w) => (
          <div
            key={w}
            className="border-r border-border px-2 py-2 text-center text-xs font-medium uppercase tracking-wide text-ink-faint last:border-r-0"
          >
            {WEEKDAY_LABELS[w]}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weeks.map((week) =>
          week.map((date) => {
            const stamp = toDateStamp(date);
            return (
              <DayCell
                key={stamp}
                date={date}
                items={byDate.get(stamp) ?? []}
                inCurrentMonth={isInMonth(date, monthDate)}
                isToday={isToday(date)}
                onSelect={() => setSelectedDate(stamp)}
                onSelectItem={() => setSelectedDate(stamp)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
