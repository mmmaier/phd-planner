import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { Resource } from "./types";
import { now } from "@/lib/id";
import { todayStamp } from "@/lib/dates";

export type NewResource = Omit<Resource, "id" | "createdAt" | "updatedAt">;

export function addResource(data: NewResource) {
  return createRecord(db.resources, data);
}

export function updateResource(id: string, changes: Partial<NewResource>) {
  return updateRecord(db.resources, id, changes);
}

export function deleteResource(id: string) {
  return deleteRecord(db.resources, id);
}

export async function markResourceStatus(id: string, status: Resource["status"]) {
  await db.resources.update(id, {
    status,
    dateCompleted: status === "completed" ? todayStamp() : null,
    updatedAt: now(),
  });
}

export function useResources() {
  return useLiveQuery(
    () => db.resources.orderBy("dateAdded").reverse().toArray(),
    [],
  );
}

export function useResourcesByStatus(status: Resource["status"]) {
  return useLiveQuery(
    () => db.resources.where("status").equals(status).toArray(),
    [status],
  );
}

export function useResourcesCompletedInRange(start: string, end: string) {
  return useLiveQuery(
    () =>
      db.resources
        .filter((r) => !!r.dateCompleted && r.dateCompleted >= start && r.dateCompleted <= end)
        .toArray(),
    [start, end],
  );
}

export function useResource(id: string | undefined) {
  return useLiveQuery(() => (id ? db.resources.get(id) : undefined), [id]);
}
