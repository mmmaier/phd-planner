import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { ResearchQuestion } from "./types";

export type NewResearchQuestion = Omit<
  ResearchQuestion,
  "id" | "createdAt" | "updatedAt"
>;

export function addResearchQuestion(data: NewResearchQuestion) {
  return createRecord(db.researchQuestions, data);
}

export function updateResearchQuestion(
  id: string,
  changes: Partial<NewResearchQuestion>,
) {
  return updateRecord(db.researchQuestions, id, changes);
}

export function deleteResearchQuestion(id: string) {
  return deleteRecord(db.researchQuestions, id);
}

export function useResearchQuestions() {
  return useLiveQuery(
    () => db.researchQuestions.orderBy("updatedAt").reverse().toArray(),
    [],
  );
}

export function useOpenResearchQuestions() {
  return useLiveQuery(
    () => db.researchQuestions.where("status").equals("open").toArray(),
    [],
  );
}
