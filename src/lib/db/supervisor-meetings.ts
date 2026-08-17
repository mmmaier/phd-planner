import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, updateRecord, deleteRecord } from "./crud";
import { addTask } from "./tasks";
import { newId } from "@/lib/id";
import type { ActionItem, SupervisorMeeting } from "./types";
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

export async function addActionItem(meetingId: string, text: string) {
  const meeting = await db.supervisorMeetings.get(meetingId);
  if (!meeting) return;
  const item: ActionItem = { id: newId(), text, done: false, taskId: null };
  await updateSupervisorMeeting(meetingId, { actionItems: [...meeting.actionItems, item] });
}

export async function updateActionItem(
  meetingId: string,
  itemId: string,
  changes: Partial<Omit<ActionItem, "id">>,
) {
  const meeting = await db.supervisorMeetings.get(meetingId);
  if (!meeting) return;
  const actionItems = meeting.actionItems.map((a) =>
    a.id === itemId ? { ...a, ...changes } : a,
  );
  await updateSupervisorMeeting(meetingId, { actionItems });
}

export async function removeActionItem(meetingId: string, itemId: string) {
  const meeting = await db.supervisorMeetings.get(meetingId);
  if (!meeting) return;
  await updateSupervisorMeeting(meetingId, {
    actionItems: meeting.actionItems.filter((a) => a.id !== itemId),
  });
}

export async function convertActionItemToTask(meetingId: string, itemId: string) {
  const meeting = await db.supervisorMeetings.get(meetingId);
  const item = meeting?.actionItems.find((a) => a.id === itemId);
  if (!meeting || !item || item.taskId) return;

  const task = await addTask({
    title: item.text,
    date: null,
    deadline: null,
    completed: false,
    completedAt: null,
    projectId: null,
    priority: null,
    notes: "",
  });
  await updateActionItem(meetingId, itemId, { taskId: task.id });
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
