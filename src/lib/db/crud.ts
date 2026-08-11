import type { EntityTable } from "dexie";
import type { WithMeta } from "./types";
import { newId, now } from "@/lib/id";

export async function createRecord<T extends WithMeta>(
  table: EntityTable<T, "id">,
  data: Omit<T, "id" | "createdAt" | "updatedAt">,
): Promise<T> {
  const timestamp = now();
  const record = {
    ...data,
    id: newId(),
    createdAt: timestamp,
    updatedAt: timestamp,
  } as T;
  await table.add(record);
  return record;
}

export async function updateRecord<T extends WithMeta>(
  table: EntityTable<T, "id">,
  id: string,
  changes: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
): Promise<void> {
  // Dexie's IDType/UpdateSpec can't be reduced from a generic T, so this last
  // mile needs an escape hatch — every entity's "id" is a plain string uuid
  // and `changes` is always a partial of that same entity's own fields.
  await table.update(id as never, { ...changes, updatedAt: now() } as never);
}

export async function deleteRecord<T extends WithMeta>(
  table: EntityTable<T, "id">,
  id: string,
): Promise<void> {
  await table.delete(id as never);
}
