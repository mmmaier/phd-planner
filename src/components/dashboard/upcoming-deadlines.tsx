"use client";

import { Panel, PanelHeading } from "@/components/ui/panel";
import { todayStamp, relativeDayLabel } from "@/lib/dates";
import { useUpcomingCalendarEvents } from "@/lib/db/calendar-events";
import { useUpcomingMilestones } from "@/lib/db/milestones";
import { CALENDAR_EVENT_TYPE_LABELS, CALENDAR_ITEM_COLOR } from "@/lib/constants";

type Item = {
  key: string;
  title: string;
  date: string;
  typeLabel: string;
  color: string;
};

export function UpcomingDeadlines() {
  const today = todayStamp();
  const events = useUpcomingCalendarEvents(today, 8);
  const milestones = useUpcomingMilestones(today, 8);

  const loading = events === undefined || milestones === undefined;

  const items: Item[] = loading
    ? []
    : [
        ...events!.map((e) => ({
          key: `event-${e.id}`,
          title: e.title,
          date: e.startDate,
          typeLabel: CALENDAR_EVENT_TYPE_LABELS[e.type],
          color: CALENDAR_ITEM_COLOR[e.type],
        })),
        ...milestones!.map((m) => ({
          key: `milestone-${m.id}`,
          title: m.title,
          date: m.date,
          typeLabel: "Milestone",
          color: CALENDAR_ITEM_COLOR.milestone,
        })),
      ]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5);

  return (
    <Panel>
      <PanelHeading>Upcoming</PanelHeading>
      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-ink-faint">
          Nothing on the horizon — add deadlines and milestones from the calendar.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.key} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-ink">{item.title}</p>
                <p className="text-xs text-ink-faint">{item.typeLabel}</p>
              </div>
              <span className="shrink-0 text-xs text-ink-faint">
                {relativeDayLabel(item.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
