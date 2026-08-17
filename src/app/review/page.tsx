"use client";

import { useState } from "react";
import { addWeeks, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { getWeekDays, toDateStamp } from "@/lib/dates";
import { useTasksCompletedInRange, useTasksInRange } from "@/lib/db/tasks";
import { useResourcesCompletedInRange } from "@/lib/db/resources";
import { useRoutineCompletionsInRange } from "@/lib/db/routines";
import { useCalendarItemsInRange } from "@/lib/calendar-items";

export default function ReviewPage() {
  const [weekOffset, setWeekOffset] = useState(0);

  const anchor = addWeeks(new Date(), weekOffset);
  const days = getWeekDays(anchor, 1);
  const start = toDateStamp(days[0]);
  const end = toDateStamp(days[6]);
  const startMs = days[0].setHours(0, 0, 0, 0);
  const endMs = days[6].setHours(23, 59, 59, 999);

  const nextDays = getWeekDays(addWeeks(anchor, 1), 1);
  const nextStart = toDateStamp(nextDays[0]);
  const nextEnd = toDateStamp(nextDays[6]);

  const completedTasks = useTasksCompletedInRange(startMs, endMs);
  const weekTasks = useTasksInRange(start, end);
  const completedResources = useResourcesCompletedInRange(start, end);
  const routineCompletions = useRoutineCompletionsInRange(start, end);
  const { items: nextWeekItems } = useCalendarItemsInRange(nextStart, nextEnd);

  const unresolvedTasks = (weekTasks ?? []).filter((t) => !t.completed);
  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-faint">
            {isCurrentWeek ? "This week" : format(days[0], "MMM d")}
          </p>
          <h1 className="font-display text-3xl text-ink">Weekly review</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Previous week"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5"
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w + 1)}
            aria-label="Next week"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5"
            disabled={weekOffset >= 0}
          >
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </button>
          {!isCurrentWeek && (
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="ml-1 rounded-lg border border-border px-2.5 py-1 text-xs text-ink-muted hover:border-border-strong"
            >
              This week
            </button>
          )}
        </div>
      </div>

      <p className="mb-6 text-sm text-ink-faint">
        {format(days[0], "MMM d")} – {format(days[6], "MMM d, yyyy")}
      </p>

      <div className="flex flex-col gap-5">
        <Panel>
          <PanelHeading>Completed</PanelHeading>
          <p className="mb-2 text-sm text-ink">
            <span className="font-medium">{completedTasks?.length ?? 0}</span> tasks ·{" "}
            <span className="font-medium">{routineCompletions?.length ?? 0}</span> daily checks
          </p>
          {completedTasks && completedTasks.length > 0 && (
            <ul className="flex flex-col gap-1">
              {completedTasks.map((t) => (
                <li key={t.id} className="text-sm text-ink-muted">
                  {t.title}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelHeading>Learning completed</PanelHeading>
          {completedResources === undefined || completedResources.length === 0 ? (
            <p className="text-sm text-ink-faint">Nothing finished this week.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {completedResources.map((r) => (
                <li key={r.id} className="text-sm text-ink-muted">
                  {r.title}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelHeading>Still open</PanelHeading>
          {unresolvedTasks.length === 0 ? (
            <p className="text-sm text-ink-faint">Nothing left hanging — well done.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {unresolvedTasks.map((t) => (
                <li key={t.id} className="text-sm text-ink-muted">
                  {t.title}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelHeading>Next week</PanelHeading>
          {nextWeekItems === undefined || nextWeekItems.length === 0 ? (
            <p className="text-sm text-ink-faint">Nothing scheduled yet.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {nextWeekItems
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-ink-muted">{item.title}</span>
                  </li>
                ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
