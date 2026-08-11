import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import type { SupervisorMeeting } from "./types";
import type { DateStamp } from "@/lib/dates";

export type NewSupervisorMeeting = Omit<
  SupervisorMeeting,
  "id" | "createdAt" | "updatedAt"
>;

export function addSupervisorMeeting(data: NewSupervisorMeeting) {
  return createRecord(db.supervisorMeetings, data);
}

export function updateSupervisorMeeting(
  id: string,
  changes: Partial<NewSupervisorMeeting>,
) {
  return updateRecord(db.supervisorMeetings, id, changes);
}

export function deleteSupervisorMeeting(id: string) {
  return deleteRecord(db.supervisorMeetings, id);
}

export function useSupervisorMeetings() {
  return useLiveQuery(
    () => db.supervisorMeetings.orderBy("date").reverse().toArray(),
    [],
  );
}

export function useSupervisorMeeting(id: string | undefined) {
  return useLiveQuery(
    () => (id ? db.supervisorMeetings.get(id) : undefined),
    [id],
  );
}

export function useNextSupervisorMeeting(fromDate: DateStamp) {
  return useLiveQuery(
    () =>
      db.supervisorMeetings
        .filter((m) => m.date >= fromDate)
        .toArray()
        .then((meetings) => meetings.sort((a, b) => a.date.localeCompare(b.date))[0]),
    [fromDate],
  );
}
