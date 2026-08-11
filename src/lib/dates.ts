import { differenceInCalendarDays, format, parseISO } from "date-fns";

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

export function relativeDayLabel(stamp: DateStamp): string {
  const diff = differenceInCalendarDays(fromDateStamp(stamp), fromDateStamp(todayStamp()));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  if (diff < -1 && diff > -7) return `${Math.abs(diff)} days ago`;
  return format(fromDateStamp(stamp), "MMM d");
}
