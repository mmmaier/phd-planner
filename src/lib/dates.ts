import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type DateStamp = string; // yyyy-MM-dd

export function toDateStamp(date: Date): DateStamp {
  return format(date, "yyyy-MM-dd");
}

export function todayStamp(): DateStamp {
  return toDateStamp(new Date());
}

export function fromDateStamp(stamp: DateStamp): Date {
  return parseISO(stamp);
}

export function getMonthGrid(monthDate: Date, weekStartsOn: 0 | 1 = 1): Date[][] {
  const firstDay = startOfWeek(startOfMonth(monthDate), { weekStartsOn });
  const lastDay = endOfWeek(endOfMonth(monthDate), { weekStartsOn });

  const weeks: Date[][] = [];
  let cursor = firstDay;
  while (cursor <= lastDay) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function getWeekDays(date: Date, weekStartsOn: 0 | 1 = 1): Date[] {
  const first = startOfWeek(date, { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => addDays(first, i));
}

export function isInMonth(date: Date, monthDate: Date): boolean {
  return isSameMonth(date, monthDate);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function relativeDayLabel(stamp: DateStamp): string {
  const diff = differenceInCalendarDays(fromDateStamp(stamp), fromDateStamp(todayStamp()));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  if (diff < -1 && diff > -7) return `${Math.abs(diff)} days ago`;
  return format(fromDateStamp(stamp), "MMM d");
}
