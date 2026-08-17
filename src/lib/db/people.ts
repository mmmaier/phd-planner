import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import { now } from "@/lib/id";
import type { Person } from "./types";

export type NewPerson = Omit<Person, "id" | "createdAt" | "updatedAt">;

export function addPerson(data: NewPerson) {
  return createRecord(db.people, data);
}

export function updatePerson(id: string, changes: Partial<NewPerson>) {
  return updateRecord(db.people, id, changes);
}

export async function deletePerson(id: string) {
  // Without this, meeting notes still pointing at the deleted person's id
  // would vanish from the UI entirely — not shown under any person group
  // (it no longer exists) and not under "Unassigned" either (personId is
  // still set, just to nothing). Reassigning to Unassigned keeps them
  // visible and editable instead of silently orphaning them.
  await db.transaction("rw", [db.people, db.supervisorMeetings], async () => {
    // personId isn't indexed (same reasoning as other nullable fields in
    // this app), so this filters in memory rather than using `.where()`.
    await db.supervisorMeetings
      .filter((m) => m.personId === id)
      .modify({ personId: null, updatedAt: now() });
    await deleteRecord(db.people, id);
  });
}

export function usePeople() {
  return useLiveQuery(() => db.people.orderBy("name").toArray(), []);
}

export function usePerson(id: string | undefined) {
  return useLiveQuery(() => (id ? db.people.get(id) : undefined), [id]);
}
