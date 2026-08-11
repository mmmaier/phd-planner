import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { ProgressEntry } from "./types";
import type { DateStamp } from "@/lib/dates";

export type NewProgressEntry = Omit<ProgressEntry, "id" | "createdAt" | "updatedAt">;

export function addProgressEntry(data: NewProgressEntry) {
  return createRecord(db.progressEntries, data);
}

export function updateProgressEntry(id: string, changes: Partial<NewProgressEntry>) {
  return updateRecord(db.progressEntries, id, changes);
}

export function deleteProgressEntry(id: string) {
  return deleteRecord(db.progressEntries, id);
}

export function useProgressEntries(limit?: number) {
  return useLiveQuery(() => {
    const query = db.progressEntries.orderBy("date").reverse();
    return limit ? query.limit(limit).toArray() : query.toArray();
  }, [limit]);
}

export function useProgressEntriesInRange(start: DateStamp, end: DateStamp) {
  return useLiveQuery(async () => {
    const entries = await db.progressEntries
      .where("date")
      .between(start, end, true, true)
      .toArray();
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  }, [start, end]);
}
