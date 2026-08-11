import Dexie, { type EntityTable } from "dexie";
import type {
  Project,
  Milestone,
  Task,
  CalendarEvent,
  Routine,
  RoutineCompletion,
  Resource,
  Topic,
  DailyPick,
  ProgressEntry,
  SupervisorMeeting,
  ResearchQuestion,
  InboxItem,
  AppSettings,
} from "./types";

export class PhdPlannerDB extends Dexie {
  projects!: EntityTable<Project, "id">;
  milestones!: EntityTable<Milestone, "id">;
  tasks!: EntityTable<Task, "id">;
  calendarEvents!: EntityTable<CalendarEvent, "id">;
  routines!: EntityTable<Routine, "id">;
  routineCompletions!: EntityTable<RoutineCompletion, "id">;
  resources!: EntityTable<Resource, "id">;
  topics!: EntityTable<Topic, "id">;
  dailyPicks!: EntityTable<DailyPick, "id">;
  progressEntries!: EntityTable<ProgressEntry, "id">;
  supervisorMeetings!: EntityTable<SupervisorMeeting, "id">;
  researchQuestions!: EntityTable<ResearchQuestion, "id">;
  inboxItems!: EntityTable<InboxItem, "id">;
  appSettings!: EntityTable<AppSettings, "id">;

  constructor() {
    super("phd-planner");

    // Note: boolean fields (archived, completed, active, processed) are
    // deliberately NOT indexed — booleans aren't a valid IndexedDB key type,
    // so those entries would silently be missing from the index. We filter
    // them in memory instead, which is plenty fast at this data scale.
    this.version(1).stores({
      projects: "id, status, priority, updatedAt",
      milestones: "id, projectId, date, type",
      tasks: "id, projectId, date",
      calendarEvents: "id, type, startDate, projectId",
      routines: "id",
      routineCompletions: "id, routineId, date, &[routineId+date]",
      resources: "id, type, status, dateAdded, *topicIds",
      topics: "id, name",
      dailyPicks: "id, &date",
      progressEntries: "id, date, projectId",
      supervisorMeetings: "id, date",
      researchQuestions: "id, projectId, status",
      inboxItems: "id, createdAt",
      appSettings: "id",
    });

    // v2: researchQuestions is sorted by updatedAt in the UI but that field
    // was never indexed, which throws a SchemaError at query time. Adding it
    // here so existing local databases get upgraded, not just fresh ones.
    this.version(2).stores({
      researchQuestions: "id, projectId, status, updatedAt",
    });
  }
}

export const db = new PhdPlannerDB();

export const DEFAULT_SETTINGS: AppSettings = {
  id: "settings",
  shortWatchThresholdMinutes: 15,
  focusTopicIds: [],
  weekStartsOn: 1,
};

export async function ensureSettings(): Promise<AppSettings> {
  const existing = await db.appSettings.get("settings");
  if (existing) return existing;
  await db.appSettings.put(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}
