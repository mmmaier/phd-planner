// Fictional sample data for demo/onboarding purposes only — never contains
// real user content. Safe to ship in source; loaded on demand via a button,
// never automatically, so a fresh install starts genuinely empty.
import { addDays, subDays } from "date-fns";
import { db } from "./db";
import { newId, now } from "@/lib/id";
import { toDateStamp } from "@/lib/dates";
import type {
  Project,
  Milestone,
  Task,
  CalendarEvent,
  Routine,
  Resource,
  Topic,
  ProgressEntry,
  SupervisorMeeting,
  ResearchQuestion,
  InboxItem,
} from "./types";

function d(offsetDays: number) {
  return toDateStamp(addDays(new Date(), offsetDays));
}

export async function seedDemoData() {
  const timestamp = now();
  const meta = () => ({ createdAt: timestamp, updatedAt: timestamp });

  const topics: Topic[] = [
    { id: newId(), name: "Medical AI", color: "#2f7a6f", ...meta() },
    { id: newId(), name: "Multimodal AI", color: "#5b7a9d", ...meta() },
    { id: newId(), name: "Interpretability", color: "#8874a3", ...meta() },
    { id: newId(), name: "Evaluation", color: "#b98b2a", ...meta() },
  ];
  const [topicMedical, topicMultimodal, topicInterp, topicEval] = topics;

  const projects: Project[] = [
    {
      id: newId(),
      title: "Multimodal Diagnosis Assistant",
      description:
        "Combining imaging and clinical notes to support differential diagnosis suggestions.",
      status: "active",
      priority: "high",
      startDate: d(-60),
      targetDate: d(120),
      nextAction: "Finish preprocessing pipeline for the imaging encoder",
      notes: "Baseline model trained; now iterating on fusion strategy.",
      links: [{ label: "Project repo", url: "https://example.com/repo" }],
      color: "var(--color-type-task)",
      archived: false,
      ...meta(),
    },
    {
      id: newId(),
      title: "Failure Mode Taxonomy for Clinical LLMs",
      description: "Cataloguing how clinical LLMs fail across subgroups and question types.",
      status: "writing",
      priority: "medium",
      startDate: d(-150),
      targetDate: d(30),
      nextAction: "Finish related-work section",
      notes: "Draft is ~70% done; needs a stronger discussion section.",
      links: [],
      color: "var(--color-type-paper)",
      archived: false,
      ...meta(),
    },
    {
      id: newId(),
      title: "Calibration Under Distribution Shift",
      description: "Early-stage idea: how well do clinical model confidence scores hold up out-of-distribution?",
      status: "idea",
      priority: "low",
      startDate: null,
      targetDate: null,
      nextAction: "Sketch out a first experiment design",
      notes: "",
      links: [],
      color: "var(--color-type-milestone)",
      archived: false,
      ...meta(),
    },
  ];
  const [projDiagnosis, projFailureModes, projCalibration] = projects;

  const resources: Resource[] = [
    {
      id: newId(),
      title: "Attention Is All You Need",
      url: "https://arxiv.org/abs/1706.03762",
      type: "paper",
      topicIds: [topicMultimodal.id],
      notes: "",
      estimatedDurationMinutes: 45,
      status: "unread",
      dateAdded: d(-10),
      dateCompleted: null,
      ...meta(),
    },
    {
      id: newId(),
      title: "A Survey of Multimodal Large Language Models in Medicine",
      url: "https://example.com/multimodal-medicine-survey",
      type: "paper",
      topicIds: [topicMedical.id, topicMultimodal.id],
      notes: "Good overview, worth citing in related work.",
      estimatedDurationMinutes: 60,
      status: "unread",
      dateAdded: d(-5),
      dateCompleted: null,
      ...meta(),
    },
    {
      id: newId(),
      title: "Interpretability Illusions in Attribution Methods",
      url: "https://example.com/interpretability-illusions",
      type: "paper",
      topicIds: [topicInterp.id],
      notes: "",
      estimatedDurationMinutes: 30,
      status: "unread",
      dateAdded: d(-3),
      dateCompleted: null,
      ...meta(),
    },
    {
      id: newId(),
      title: "How to Evaluate Clinical NLP Models Properly",
      url: "https://example.com/clinical-nlp-evaluation",
      type: "article",
      topicIds: [topicEval.id, topicMedical.id],
      notes: "",
      estimatedDurationMinutes: 15,
      status: "unread",
      dateAdded: d(-2),
      dateCompleted: null,
      ...meta(),
    },
    {
      id: newId(),
      title: "Explaining Transformers in 12 Minutes",
      url: "https://example.com/transformers-explained-video",
      type: "video",
      topicIds: [topicMultimodal.id],
      notes: "",
      estimatedDurationMinutes: 12,
      status: "unread",
      dateAdded: d(-8),
      dateCompleted: null,
      ...meta(),
    },
    {
      id: newId(),
      title: "Calibration Metrics, Briefly",
      url: "https://example.com/calibration-metrics-video",
      type: "video",
      topicIds: [topicEval.id],
      notes: "",
      estimatedDurationMinutes: 9,
      status: "unread",
      dateAdded: d(-1),
      dateCompleted: null,
      ...meta(),
    },
    {
      id: newId(),
      title: "Foundations of Statistical Learning (course)",
      url: "https://example.com/statistical-learning-course",
      type: "course",
      topicIds: [topicEval.id],
      notes: "Working through this slowly on weekends.",
      estimatedDurationMinutes: 600,
      status: "in_progress",
      dateAdded: d(-40),
      dateCompleted: null,
      ...meta(),
    },
    {
      id: newId(),
      title: "Why Subgroup Evaluation Matters in Clinical AI",
      url: "https://example.com/subgroup-evaluation",
      type: "article",
      topicIds: [topicMedical.id, topicEval.id],
      notes: "Read for the failure-mode taxonomy project.",
      estimatedDurationMinutes: 20,
      status: "completed",
      dateAdded: d(-20),
      dateCompleted: d(-14),
      ...meta(),
    },
  ];

  const milestones: Milestone[] = [
    {
      id: newId(),
      title: "Ethics approval for imaging dataset",
      type: "ethics",
      date: d(-45),
      projectId: projDiagnosis.id,
      completed: true,
      notes: "",
      ...meta(),
    },
    {
      id: newId(),
      title: "Complete data collection",
      type: "data_collection",
      date: d(14),
      projectId: projDiagnosis.id,
      completed: false,
      notes: "",
      ...meta(),
    },
    {
      id: newId(),
      title: "Submit failure-mode taxonomy paper",
      type: "submission",
      date: d(30),
      projectId: projFailureModes.id,
      completed: false,
      notes: "Targeting a workshop track.",
      ...meta(),
    },
    {
      id: newId(),
      title: "Present at MedAI Symposium",
      type: "conference",
      date: d(75),
      projectId: null,
      completed: false,
      notes: "",
      ...meta(),
    },
  ];

  const tasks: Task[] = [
    {
      id: newId(),
      title: "Fix imaging encoder normalization bug",
      date: d(0),
      completed: false,
      completedAt: null,
      projectId: projDiagnosis.id,
      priority: "high",
      notes: "",
      ...meta(),
    },
    {
      id: newId(),
      title: "Draft related-work paragraph on subgroup fairness",
      date: d(0),
      completed: false,
      completedAt: null,
      projectId: projFailureModes.id,
      priority: "medium",
      notes: "",
      ...meta(),
    },
    {
      id: newId(),
      title: "Reply to reviewer questions from lab meeting",
      date: d(1),
      completed: false,
      completedAt: null,
      projectId: null,
      priority: "medium",
      notes: "",
      ...meta(),
    },
    {
      id: newId(),
      title: "Sketch first experiment for calibration idea",
      date: d(3),
      completed: false,
      completedAt: null,
      projectId: projCalibration.id,
      priority: "low",
      notes: "",
      ...meta(),
    },
    {
      id: newId(),
      title: "Clean up preprocessing scripts",
      date: d(-1),
      completed: true,
      completedAt: subDays(new Date(), 1).getTime(),
      projectId: projDiagnosis.id,
      priority: "low",
      notes: "",
      ...meta(),
    },
  ];

  const calendarEvents: CalendarEvent[] = [
    {
      id: newId(),
      title: "MedAI Symposium paper deadline",
      type: "paper_deadline",
      startDate: d(30),
      endDate: null,
      allDay: true,
      projectId: projFailureModes.id,
      notes: "",
      location: "",
      ...meta(),
    },
    {
      id: newId(),
      title: "MedAI Symposium",
      type: "conference",
      startDate: d(75),
      endDate: d(77),
      allDay: true,
      projectId: null,
      notes: "",
      location: "Boston, MA",
      ...meta(),
    },
    {
      id: newId(),
      title: "Weekly supervisor meeting",
      type: "meeting",
      startDate: d(2),
      endDate: null,
      allDay: false,
      projectId: null,
      notes: "",
      location: "Office 4.12",
      ...meta(),
    },
  ];

  const routines: Routine[] = [
    {
      id: newId(),
      title: "Work on paper",
      weekdays: [1, 2, 3, 4, 5],
      color: "var(--color-type-paper)",
      active: true,
      archived: false,
      ...meta(),
    },
    {
      id: newId(),
      title: "Read",
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      color: "var(--color-type-task)",
      active: true,
      archived: false,
      ...meta(),
    },
    {
      id: newId(),
      title: "Update research notes",
      weekdays: [1, 2, 3, 4, 5],
      color: "var(--color-type-milestone)",
      active: true,
      archived: false,
      ...meta(),
    },
    {
      id: newId(),
      title: "Exercise",
      weekdays: [1, 3, 5],
      color: "var(--color-type-routine)",
      active: true,
      archived: false,
      ...meta(),
    },
  ];

  const progressEntries: ProgressEntry[] = [
    {
      id: newId(),
      text: "Implemented baseline fusion model for imaging + notes.",
      date: d(-6),
      projectId: projDiagnosis.id,
      ...meta(),
    },
    {
      id: newId(),
      text: "Finished first full draft of introduction.",
      date: d(-4),
      projectId: projFailureModes.id,
      ...meta(),
    },
    {
      id: newId(),
      text: "Found why experiment 3 was failing — mismatched tokenizer.",
      date: d(-2),
      projectId: projDiagnosis.id,
      ...meta(),
    },
    {
      id: newId(),
      text: "Read subgroup evaluation article, added notes to related work.",
      date: d(-1),
      projectId: projFailureModes.id,
      ...meta(),
    },
  ];

  const supervisorMeetings: SupervisorMeeting[] = [
    {
      id: newId(),
      date: d(-5),
      agenda: "Review fusion model results, discuss ethics amendment.",
      discussionNotes:
        "Results look promising on the held-out set. Supervisor suggested trying an ablation without the imaging branch.",
      decisions: "Proceed with ablation study before the symposium deadline.",
      actionItems: [
        { id: newId(), text: "Run ablation without imaging branch", done: false, taskId: null },
        { id: newId(), text: "Draft ethics amendment for extended dataset", done: false, taskId: null },
      ],
      questionsForNextTime: "Is the workshop track still the right target, or should we aim higher?",
      ...meta(),
    },
  ];

  const researchQuestions: ResearchQuestion[] = [
    {
      id: newId(),
      question: "Why does the diagnosis model fail more often on the pediatric subgroup?",
      projectId: projDiagnosis.id,
      status: "open",
      notes: "",
      ...meta(),
    },
    {
      id: newId(),
      question: "Would a clinically-motivated evaluation framework change our model ranking?",
      projectId: projFailureModes.id,
      status: "open",
      notes: "",
      ...meta(),
    },
  ];

  const inboxItems: InboxItem[] = [
    {
      id: newId(),
      content: "Idea: try contrastive pretraining on the imaging encoder before fusion.",
      guessedType: "idea",
      processed: false,
      ...meta(),
    },
    {
      id: newId(),
      content: "https://example.com/interesting-related-paper",
      guessedType: "url",
      processed: false,
      ...meta(),
    },
  ];

  await db.transaction(
    "rw",
    [
      db.topics,
      db.projects,
      db.resources,
      db.milestones,
      db.tasks,
      db.calendarEvents,
      db.routines,
      db.progressEntries,
      db.supervisorMeetings,
      db.researchQuestions,
      db.inboxItems,
    ],
    async () => {
      await db.topics.bulkAdd(topics);
      await db.projects.bulkAdd(projects);
      await db.resources.bulkAdd(resources);
      await db.milestones.bulkAdd(milestones);
      await db.tasks.bulkAdd(tasks);
      await db.calendarEvents.bulkAdd(calendarEvents);
      await db.routines.bulkAdd(routines);
      await db.progressEntries.bulkAdd(progressEntries);
      await db.supervisorMeetings.bulkAdd(supervisorMeetings);
      await db.researchQuestions.bulkAdd(researchQuestions);
      await db.inboxItems.bulkAdd(inboxItems);
    },
  );
}
