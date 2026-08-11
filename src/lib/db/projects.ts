import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { Project } from "./types";

export type NewProject = Omit<Project, "id" | "createdAt" | "updatedAt">;

export function addProject(data: NewProject) {
  return createRecord(db.projects, data);
}

export function updateProject(id: string, changes: Partial<NewProject>) {
  return updateRecord(db.projects, id, changes);
}

export function deleteProject(id: string) {
  return deleteRecord(db.projects, id);
}

export function useProjects() {
  return useLiveQuery(
    () => db.projects.orderBy("updatedAt").reverse().toArray(),
    [],
  );
}

export function useActiveProjects() {
  return useLiveQuery(
    () => db.projects.filter((p) => !p.archived).sortBy("updatedAt"),
    [],
  );
}

export function useProject(id: string | undefined) {
  return useLiveQuery(() => (id ? db.projects.get(id) : undefined), [id]);
}
