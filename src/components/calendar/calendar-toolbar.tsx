"use client";

import { addMonths, addWeeks, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fromDateStamp, toDateStamp, todayStamp } from "@/lib/dates";
import { useUiStore } from "@/store/ui-store";

export function CalendarToolbar() {
  const view = useUiStore((s) => s.calendarView);
  const setView = useUiStore((s) => s.setCalendarView);
  const anchor = useUiStore((s) => s.calendarAnchorDate);
  const setAnchor = useUiStore((s) => s.setCalendarAnchorDate);

  const anchorDate = fromDateStamp(anchor);

  function step(direction: 1 | -1) {
    const next =
      view === "month" ? addMonths(anchorDate, direction) : addWeeks(anchorDate, direction);
    setAnchor(toDateStamp(next));
  }

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl text-ink">
          {format(anchorDate, view === "month" ? "MMMM yyyy" : "'Week of' MMM d")}
        </h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5"
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5"
          >
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setAnchor(todayStamp())}
            className="ml-1 rounded-lg border border-border px-2.5 py-1 text-xs text-ink-muted hover:border-border-strong"
          >
            Today
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
        {(["month", "week"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "rounded-md px-3 py-1 text-sm capitalize transition-colors",
              view === v ? "bg-accent/10 text-accent-hover" : "text-ink-muted hover:text-ink",
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
