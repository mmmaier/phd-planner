import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { Routine, RoutineCompletion } from "./types";
import { newId, now } from "@/lib/id";
import type { DateStamp } from "@/lib/dates";

export type NewRoutine = Omit<Routine, "id" | "createdAt" | "updatedAt">;

export function addRoutine(data: NewRoutine) {
  return createRecord(db.routines, data);
}

export function updateRoutine(id: string, changes: Partial<NewRoutine>) {
  return updateRecord(db.routines, id, changes);
}

export function deleteRoutine(id: string) {
  return deleteRecord(db.routines, id);
}

export function useActiveRoutines() {
  return useLiveQuery(
    () => db.routines.filter((r) => r.active && !r.archived).toArray(),
    [],
  );
}

export function useRoutinesForWeekday(weekday: number) {
  return useLiveQuery(
    () =>
      db.routines
        .filter((r) => r.active && !r.archived && r.weekdays.includes(weekday))
        .toArray(),
    [weekday],
  );
}

export function useRoutineCompletionsForDate(date: DateStamp) {
  return useLiveQuery(
    () => db.routineCompletions.where("date").equals(date).toArray(),
    [date],
  );
}

export async function setRoutineCompletion(
  routineId: string,
  date: DateStamp,
  completed: boolean,
) {
  const existing = await db.routineCompletions
    .where("[routineId+date]")
    .equals([routineId, date])
    .first();

  if (completed && !existing) {
    const timestamp = now();
    const record: RoutineCompletion = {
      id: newId(),
      routineId,
      date,
      completedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await db.routineCompletions.add(record);
  } else if (!completed && existing) {
    await db.routineCompletions.delete(existing.id);
  }
}

export function useRoutineCompletionsInRange(start: DateStamp, end: DateStamp) {
  return useLiveQuery(
    () => db.routineCompletions.where("date").between(start, end, true, true).toArray(),
    [start, end],
  );
}
