"use client";

import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { MonthGrid } from "@/components/calendar/month-grid";
import { WeekGrid } from "@/components/calendar/week-grid";
import { DayDetailDrawer } from "@/components/calendar/day-detail-drawer";
import { fromDateStamp } from "@/lib/dates";
import { useUiStore } from "@/store/ui-store";

export default function CalendarPage() {
  const view = useUiStore((s) => s.calendarView);
  const anchor = useUiStore((s) => s.calendarAnchorDate);
  const anchorDate = fromDateStamp(anchor);

  return (
    <div className="mx-auto max-w-6xl">
      <CalendarToolbar />
      {view === "month" ? (
        <MonthGrid monthDate={anchorDate} />
      ) : (
        <WeekGrid anchorDate={anchorDate} />
      )}
      <p className="mt-3 text-xs text-ink-faint">
        Click a day to add or edit items. Drag a task pill onto another day to reschedule it.
      </p>
      <DayDetailDrawer />
    </div>
  );
}
