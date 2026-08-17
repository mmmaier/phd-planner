// Shared primitives -----------------------------------------------------

export type Id = string;
export type DateStamp = string; // yyyy-mm-dd, used for day-granularity fields
export type Timestamp = number; // epoch ms

export type WithMeta = {
  id: Id;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Projects ----------------------------------------------------------------

export const PROJECT_STATUSES = [
  "idea",
  "planning",
  "active",
  "waiting",
  "writing",
  "submitted",
  "complete",
  "paused",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type ProjectLink = { label: string; url: string };

export type Project = WithMeta & {
  title: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: DateStamp | null;
  targetDate: DateStamp | null;
  nextAction: string;
  notes: string;
  links: ProjectLink[];
  color: string;
  archived: boolean;
};

// Milestones ----------------------------------------------------------------

export const MILESTONE_TYPES = [
  "proposal",
  "ethics",
  "data_collection",
  "experiments",
  "submission",
  "conference",
  "thesis_chapter",
  "thesis_submission",
  "defense",
  "other",
] as const;
export type MilestoneType = (typeof MILESTONE_TYPES)[number];

export type Milestone = WithMeta & {
  title: string;
  type: MilestoneType;
  date: DateStamp;
  projectId: Id | null;
  completed: boolean;
  notes: string;
};

// Tasks ----------------------------------------------------------------

export type Task = WithMeta & {
  title: string;
  date: DateStamp | null;
  deadline: DateStamp | null; // shown on the calendar in the deadline color
  completed: boolean;
  completedAt: Timestamp | null;
  projectId: Id | null;
  priority: Priority | null;
  notes: string;
};

// Calendar events ----------------------------------------------------------------

export const CALENDAR_EVENT_TYPES = [
  "deadline",
  "meeting",
  "conference",
  "paper_deadline",
  "other",
] as const;
export type CalendarEventType = (typeof CALENDAR_EVENT_TYPES)[number];

export type CalendarEvent = WithMeta & {
  title: string;
  type: CalendarEventType;
  startDate: DateStamp;
  endDate: DateStamp | null;
  allDay: boolean;
  projectId: Id | null;
  notes: string;
  location: string;
};

// Routines / daily checks ----------------------------------------------------------------

export type Routine = WithMeta & {
  title: string;
  weekdays: number[]; // 0 = Sunday .. 6 = Saturday
  color: string;
  active: boolean;
  archived: boolean;
};

export type RoutineCompletion = WithMeta & {
  routineId: Id;
  date: DateStamp;
  completedAt: Timestamp;
};

// Resources / learning library ----------------------------------------------------------------

export const RESOURCE_TYPES = [
  "paper",
  "article",
  "video",
  "website",
  "course",
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const RESOURCE_STATUSES = ["unread", "in_progress", "completed"] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export type Resource = WithMeta & {
  title: string;
  url: string;
  type: ResourceType;
  topicIds: Id[];
  notes: string;
  estimatedDurationMinutes: number | null;
  status: ResourceStatus;
  dateAdded: DateStamp;
  dateCompleted: DateStamp | null;
};

// Topics ----------------------------------------------------------------

export type Topic = WithMeta & {
  name: string;
  color: string;
};

// Daily learning pick ----------------------------------------------------------------

export type DailyPick = WithMeta & {
  date: DateStamp; // unique
  paperResourceId: Id | null;
  videoResourceId: Id | null;
  shownResourceIds: Id[]; // rolling history, used to avoid repeats
};

// Progress log ----------------------------------------------------------------

export type ProgressEntry = WithMeta & {
  text: string;
  date: DateStamp;
  projectId: Id | null;
};

// People ----------------------------------------------------------------

export type Person = WithMeta & {
  name: string;
  role: string; // free text, e.g. "Supervisor", "Collaborator"
  notes: string;
};

// Supervisor meetings ----------------------------------------------------------------

export type ActionItem = {
  id: Id;
  text: string;
  done: boolean;
  taskId: Id | null;
};

export type SupervisorMeeting = WithMeta & {
  date: DateStamp;
  personId: Id | null;
  agenda: string;
  discussionNotes: string;
  decisions: string;
  actionItems: ActionItem[];
  questionsForNextTime: string;
};

// Research questions ----------------------------------------------------------------

export const RESEARCH_QUESTION_STATUSES = ["open", "resolved"] as const;
export type ResearchQuestionStatus = (typeof RESEARCH_QUESTION_STATUSES)[number];

export type ResearchQuestion = WithMeta & {
  question: string;
  projectId: Id | null;
  status: ResearchQuestionStatus;
  notes: string;
};

// Inbox ----------------------------------------------------------------

export const INBOX_ITEM_TYPES = [
  "idea",
  "paper",
  "url",
  "task",
  "other",
] as const;
export type InboxItemType = (typeof INBOX_ITEM_TYPES)[number];

export type InboxItem = WithMeta & {
  content: string;
  guessedType: InboxItemType;
  processed: boolean;
};

// App settings ----------------------------------------------------------------

export type AppSettings = {
  id: "settings";
  shortWatchThresholdMinutes: number;
  focusTopicIds: Id[];
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
};
