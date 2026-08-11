import type {
  ProjectStatus,
  Priority,
  MilestoneType,
  CalendarEventType,
  ResourceType,
  ResourceStatus,
  ResearchQuestionStatus,
  InboxItemType,
} from "./db/types";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: "Idea",
  planning: "Planning",
  active: "Active",
  waiting: "Waiting",
  writing: "Writing",
  submitted: "Submitted",
  complete: "Complete",
  paused: "Paused",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const MILESTONE_TYPE_LABELS: Record<MilestoneType, string> = {
  proposal: "Proposal / confirmation",
  ethics: "Ethics approval",
  data_collection: "Data collection",
  experiments: "Experiments",
  submission: "Paper submission",
  conference: "Conference",
  thesis_chapter: "Thesis chapter",
  thesis_submission: "Thesis submission",
  defense: "Defense",
  other: "Other",
};

export const CALENDAR_EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  deadline: "Deadline",
  meeting: "Meeting",
  conference: "Conference",
  paper_deadline: "Paper deadline",
  other: "Other",
};

// A single source of truth mapping every calendar-visible item kind to its
// accent color token (defined in globals.css) — keeps task/deadline/meeting/
// conference/paper/milestone/routine visually distinct wherever they appear.
export type CalendarItemKind = CalendarEventType | "task" | "milestone" | "routine";

export const CALENDAR_ITEM_COLOR: Record<CalendarItemKind, string> = {
  task: "var(--color-type-task)",
  deadline: "var(--color-type-deadline)",
  meeting: "var(--color-type-meeting)",
  conference: "var(--color-type-conference)",
  paper_deadline: "var(--color-type-paper)",
  other: "var(--color-type-task)",
  milestone: "var(--color-type-milestone)",
  routine: "var(--color-type-routine)",
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  paper: "Paper",
  article: "Article",
  video: "Video",
  website: "Website",
  course: "Course",
};

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
  unread: "Unread",
  in_progress: "In progress",
  completed: "Completed",
};

export const RESEARCH_QUESTION_STATUS_LABELS: Record<ResearchQuestionStatus, string> = {
  open: "Open",
  resolved: "Resolved",
};

export const INBOX_ITEM_TYPE_LABELS: Record<InboxItemType, string> = {
  idea: "Idea",
  paper: "Paper",
  url: "URL",
  task: "Task",
  other: "Other",
};

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
