import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { CalendarEvent } from "./types";
import type { DateStamp } from "@/lib/dates";

export type NewCalendarEvent = Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">;

export function addCalendarEvent(data: NewCalendarEvent) {
  return createRecord(db.calendarEvents, data);
}

export function updateCalendarEvent(id: string, changes: Partial<NewCalendarEvent>) {
  return updateRecord(db.calendarEvents, id, changes);
}

export function deleteCalendarEvent(id: string) {
  return deleteRecord(db.calendarEvents, id);
}

export function useCalendarEventsInRange(start: DateStamp, end: DateStamp) {
  return useLiveQuery(
    () =>
      db.calendarEvents
        .filter((e) => e.startDate <= end && (e.endDate ?? e.startDate) >= start)
        .toArray(),
    [start, end],
  );
}

export function useUpcomingCalendarEvents(fromDate: DateStamp, limit = 10) {
  return useLiveQuery(
    () =>
      db.calendarEvents
        .filter((e) => e.startDate >= fromDate)
        .toArray()
        .then((events) =>
          events.sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, limit),
        ),
    [fromDate, limit],
  );
}
