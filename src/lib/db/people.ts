import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { Person } from "./types";

export type NewPerson = Omit<Person, "id" | "createdAt" | "updatedAt">;

export function addPerson(data: NewPerson) {
  return createRecord(db.people, data);
}

export function updatePerson(id: string, changes: Partial<NewPerson>) {
  return updateRecord(db.people, id, changes);
}

export function deletePerson(id: string) {
  return deleteRecord(db.people, id);
}

export function usePeople() {
  return useLiveQuery(() => db.people.orderBy("name").toArray(), []);
}

export function usePerson(id: string | undefined) {
  return useLiveQuery(() => (id ? db.people.get(id) : undefined), [id]);
}
