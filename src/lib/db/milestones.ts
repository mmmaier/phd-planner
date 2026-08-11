import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { Milestone } from "./types";
import type { DateStamp } from "@/lib/dates";

export type NewMilestone = Omit<Milestone, "id" | "createdAt" | "updatedAt">;

export function addMilestone(data: NewMilestone) {
  return createRecord(db.milestones, data);
}

export function updateMilestone(id: string, changes: Partial<NewMilestone>) {
  return updateRecord(db.milestones, id, changes);
}

export function deleteMilestone(id: string) {
  return deleteRecord(db.milestones, id);
}

export function useMilestonesInRange(start: DateStamp, end: DateStamp) {
  return useLiveQuery(
    () => db.milestones.where("date").between(start, end, true, true).toArray(),
    [start, end],
  );
}

export function useMilestonesForProject(projectId: string | undefined) {
  return useLiveQuery(
    () =>
      projectId
        ? db.milestones.where("projectId").equals(projectId).sortBy("date")
        : [],
    [projectId],
  );
}

export function useUpcomingMilestones(fromDate: DateStamp, limit = 5) {
  return useLiveQuery(
    () =>
      db.milestones
        .filter((m) => !m.completed && m.date >= fromDate)
        .toArray()
        .then((milestones) =>
          milestones.sort((a, b) => a.date.localeCompare(b.date)).slice(0, limit),
        ),
    [fromDate, limit],
  );
}
