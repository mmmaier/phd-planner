import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { Task } from "./types";
import { now } from "@/lib/id";
import type { DateStamp } from "@/lib/dates";

export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt">;

export function addTask(data: NewTask) {
  return createRecord(db.tasks, data);
}

export function updateTask(id: string, changes: Partial<NewTask>) {
  return updateRecord(db.tasks, id, changes);
}

export function deleteTask(id: string) {
  return deleteRecord(db.tasks, id);
}

export async function toggleTaskCompleted(id: string, completed: boolean) {
  await db.tasks.update(id, {
    completed,
    completedAt: completed ? now() : null,
    updatedAt: now(),
  });
}

export function useTasksForDate(date: DateStamp | undefined) {
  return useLiveQuery(
    () => (date ? db.tasks.where("date").equals(date).toArray() : []),
    [date],
  );
}

export function useTasksInRange(start: DateStamp, end: DateStamp) {
  return useLiveQuery(
    () => db.tasks.where("date").between(start, end, true, true).toArray(),
    [start, end],
  );
}

// `deadline` isn't indexed (same reasoning as the boolean fields — it's
// nullable and only a handful of tasks will ever have one set), so this
// filters in memory rather than using a Dexie `.where()`.
export function useTasksWithDeadlineInRange(start: DateStamp, end: DateStamp) {
  return useLiveQuery(
    () =>
      db.tasks
        .filter((t) => !!t.deadline && t.deadline >= start && t.deadline <= end)
        .toArray(),
    [start, end],
  );
}

export function useAllTasks() {
  return useLiveQuery(() => db.tasks.toArray(), []);
}

export function useTasksForProject(projectId: string | undefined) {
  return useLiveQuery(
    () =>
      projectId
        ? db.tasks.where("projectId").equals(projectId).toArray()
        : [],
    [projectId],
  );
}

export function useTasksCompletedInRange(startMs: number, endMs: number) {
  return useLiveQuery(
    () =>
      db.tasks
        .filter((t) => t.completed && !!t.completedAt && t.completedAt >= startMs && t.completedAt <= endMs)
        .toArray(),
    [startMs, endMs],
  );
}

export function useUpcomingTasks(fromDate: DateStamp, limit = 10) {
  return useLiveQuery(
    () =>
      db.tasks
        .filter((t) => !t.completed && !!t.date && t.date >= fromDate)
        .toArray()
        .then((tasks) =>
          tasks.sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")).slice(0, limit),
        ),
    [fromDate, limit],
  );
}
