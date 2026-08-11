import { z } from "zod";
import { db } from "./db/db";
import {
  PROJECT_STATUSES,
  PRIORITIES,
  MILESTONE_TYPES,
  CALENDAR_EVENT_TYPES,
  RESOURCE_TYPES,
  RESOURCE_STATUSES,
  RESEARCH_QUESTION_STATUSES,
  INBOX_ITEM_TYPES,
} from "./db/types";

const withMeta = { id: z.string(), createdAt: z.number(), updatedAt: z.number() };

const projectSchema = z.object({
  ...withMeta,
  title: z.string(),
  description: z.string(),
  status: z.enum(PROJECT_STATUSES),
  priority: z.enum(PRIORITIES),
  startDate: z.string().nullable(),
  targetDate: z.string().nullable(),
  nextAction: z.string(),
  notes: z.string(),
  links: z.array(z.object({ label: z.string(), url: z.string() })),
  color: z.string(),
  archived: z.boolean(),
});

const milestoneSchema = z.object({
  ...withMeta,
  title: z.string(),
  type: z.enum(MILESTONE_TYPES),
  date: z.string(),
  projectId: z.string().nullable(),
  completed: z.boolean(),
  notes: z.string(),
});

const taskSchema = z.object({
  ...withMeta,
  title: z.string(),
  date: z.string().nullable(),
  completed: z.boolean(),
  completedAt: z.number().nullable(),
  projectId: z.string().nullable(),
  priority: z.enum(PRIORITIES).nullable(),
  notes: z.string(),
});

const calendarEventSchema = z.object({
  ...withMeta,
  title: z.string(),
  type: z.enum(CALENDAR_EVENT_TYPES),
  startDate: z.string(),
  endDate: z.string().nullable(),
  allDay: z.boolean(),
  projectId: z.string().nullable(),
  notes: z.string(),
  location: z.string(),
});

const routineSchema = z.object({
  ...withMeta,
  title: z.string(),
  weekdays: z.array(z.number()),
  color: z.string(),
  active: z.boolean(),
  archived: z.boolean(),
});

const routineCompletionSchema = z.object({
  ...withMeta,
  routineId: z.string(),
  date: z.string(),
  completedAt: z.number(),
});

const resourceSchema = z.object({
  ...withMeta,
  title: z.string(),
  url: z.string(),
  type: z.enum(RESOURCE_TYPES),
  topicIds: z.array(z.string()),
  notes: z.string(),
  estimatedDurationMinutes: z.number().nullable(),
  status: z.enum(RESOURCE_STATUSES),
  dateAdded: z.string(),
  dateCompleted: z.string().nullable(),
});

const topicSchema = z.object({
  ...withMeta,
  name: z.string(),
  color: z.string(),
});

const dailyPickSchema = z.object({
  ...withMeta,
  date: z.string(),
  paperResourceId: z.string().nullable(),
  videoResourceId: z.string().nullable(),
  shownResourceIds: z.array(z.string()),
});

const progressEntrySchema = z.object({
  ...withMeta,
  text: z.string(),
  date: z.string(),
  projectId: z.string().nullable(),
});

const actionItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean(),
  taskId: z.string().nullable(),
});

const supervisorMeetingSchema = z.object({
  ...withMeta,
  date: z.string(),
  agenda: z.string(),
  discussionNotes: z.string(),
  decisions: z.string(),
  actionItems: z.array(actionItemSchema),
  questionsForNextTime: z.string(),
});

const researchQuestionSchema = z.object({
  ...withMeta,
  question: z.string(),
  projectId: z.string().nullable(),
  status: z.enum(RESEARCH_QUESTION_STATUSES),
  notes: z.string(),
});

const inboxItemSchema = z.object({
  ...withMeta,
  content: z.string(),
  guessedType: z.enum(INBOX_ITEM_TYPES),
  processed: z.boolean(),
});

const appSettingsSchema = z.object({
  id: z.literal("settings"),
  shortWatchThresholdMinutes: z.number(),
  focusTopicIds: z.array(z.string()),
  weekStartsOn: z.union([z.literal(0), z.literal(1)]),
});

export const exportSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  data: z.object({
    projects: z.array(projectSchema),
    milestones: z.array(milestoneSchema),
    tasks: z.array(taskSchema),
    calendarEvents: z.array(calendarEventSchema),
    routines: z.array(routineSchema),
    routineCompletions: z.array(routineCompletionSchema),
    resources: z.array(resourceSchema),
    topics: z.array(topicSchema),
    dailyPicks: z.array(dailyPickSchema),
    progressEntries: z.array(progressEntrySchema),
    supervisorMeetings: z.array(supervisorMeetingSchema),
    researchQuestions: z.array(researchQuestionSchema),
    inboxItems: z.array(inboxItemSchema),
    appSettings: z.array(appSettingsSchema),
  }),
});

export type ExportPayload = z.infer<typeof exportSchema>;

const ALL_TABLES = [
  db.projects,
  db.milestones,
  db.tasks,
  db.calendarEvents,
  db.routines,
  db.routineCompletions,
  db.resources,
  db.topics,
  db.dailyPicks,
  db.progressEntries,
  db.supervisorMeetings,
  db.researchQuestions,
  db.inboxItems,
  db.appSettings,
];

export async function exportAllData(): Promise<ExportPayload> {
  const [
    projects,
    milestones,
    tasks,
    calendarEvents,
    routines,
    routineCompletions,
    resources,
    topics,
    dailyPicks,
    progressEntries,
    supervisorMeetings,
    researchQuestions,
    inboxItems,
    appSettings,
  ] = await Promise.all([
    db.projects.toArray(),
    db.milestones.toArray(),
    db.tasks.toArray(),
    db.calendarEvents.toArray(),
    db.routines.toArray(),
    db.routineCompletions.toArray(),
    db.resources.toArray(),
    db.topics.toArray(),
    db.dailyPicks.toArray(),
    db.progressEntries.toArray(),
    db.supervisorMeetings.toArray(),
    db.researchQuestions.toArray(),
    db.inboxItems.toArray(),
    db.appSettings.toArray(),
  ]);

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data: {
      projects,
      milestones,
      tasks,
      calendarEvents,
      routines,
      routineCompletions,
      resources,
      topics,
      dailyPicks,
      progressEntries,
      supervisorMeetings,
      researchQuestions,
      inboxItems,
      appSettings,
    },
  };
}

export function downloadExport(payload: ExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `phd-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export type ImportResult =
  | { ok: true }
  | { ok: false; error: string };

export async function importAllData(raw: unknown): Promise<ImportResult> {
  const parsed = exportSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "This file doesn't look like a valid PhD Planner backup." };
  }

  const { data } = parsed.data;

  await db.transaction("rw", ALL_TABLES, async () => {
    await Promise.all(ALL_TABLES.map((table) => table.clear()));
    await Promise.all([
      db.projects.bulkAdd(data.projects),
      db.milestones.bulkAdd(data.milestones),
      db.tasks.bulkAdd(data.tasks),
      db.calendarEvents.bulkAdd(data.calendarEvents),
      db.routines.bulkAdd(data.routines),
      db.routineCompletions.bulkAdd(data.routineCompletions),
      db.resources.bulkAdd(data.resources),
      db.topics.bulkAdd(data.topics),
      db.dailyPicks.bulkAdd(data.dailyPicks),
      db.progressEntries.bulkAdd(data.progressEntries),
      db.supervisorMeetings.bulkAdd(data.supervisorMeetings),
      db.researchQuestions.bulkAdd(data.researchQuestions),
      db.inboxItems.bulkAdd(data.inboxItems),
      db.appSettings.bulkAdd(data.appSettings),
    ]);
  });

  return { ok: true };
}

export async function resetAllData() {
  await db.transaction("rw", ALL_TABLES, async () => {
    await Promise.all(ALL_TABLES.map((table) => table.clear()));
  });
}
