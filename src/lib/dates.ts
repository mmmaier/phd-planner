import { format, parseISO } from "date-fns";

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
