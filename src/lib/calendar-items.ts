import { useTasksInRange } from "@/lib/db/tasks";
import { useCalendarEventsInRange } from "@/lib/db/calendar-events";
import { useMilestonesInRange } from "@/lib/db/milestones";
import { CALENDAR_ITEM_COLOR, type CalendarItemKind } from "@/lib/constants";
import type { DateStamp } from "@/lib/dates";

export type CalendarItem = {
  id: string;
  kind: CalendarItemKind;
  title: string;
  date: DateStamp;
  color: string;
  completed: boolean;
};

export function useCalendarItemsInRange(start: DateStamp, end: DateStamp) {
  const tasks = useTasksInRange(start, end);
  const events = useCalendarEventsInRange(start, end);
  const milestones = useMilestonesInRange(start, end);

  const loading = tasks === undefined || events === undefined || milestones === undefined;
  if (loading) return { items: undefined, loading: true as const };

  const items: CalendarItem[] = [
    ...tasks!
      .filter((t) => !!t.date)
      .map((t) => ({
        id: t.id,
        kind: "task" as const,
        title: t.title,
        date: t.date as DateStamp,
        color: CALENDAR_ITEM_COLOR.task,
        completed: t.completed,
      })),
    ...events!.map((e) => ({
      id: e.id,
      kind: e.type,
      title: e.title,
      date: e.startDate,
      color: CALENDAR_ITEM_COLOR[e.type],
      completed: false,
    })),
    ...milestones!.map((m) => ({
      id: m.id,
      kind: "milestone" as const,
      title: m.title,
      date: m.date,
      color: CALENDAR_ITEM_COLOR.milestone,
      completed: m.completed,
    })),
  ];

  return { items, loading: false as const };
}

export function groupItemsByDate(items: CalendarItem[]): Map<DateStamp, CalendarItem[]> {
  const map = new Map<DateStamp, CalendarItem[]>();
  for (const item of items) {
    const existing = map.get(item.date);
    if (existing) existing.push(item);
    else map.set(item.date, [item]);
  }
  return map;
}
