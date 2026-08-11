import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { Topic } from "./types";

export type NewTopic = Omit<Topic, "id" | "createdAt" | "updatedAt">;

export function addTopic(data: NewTopic) {
  return createRecord(db.topics, data);
}

export function updateTopic(id: string, changes: Partial<NewTopic>) {
  return updateRecord(db.topics, id, changes);
}

export function deleteTopic(id: string) {
  return deleteRecord(db.topics, id);
}

export function useTopics() {
  return useLiveQuery(() => db.topics.orderBy("name").toArray(), []);
}
