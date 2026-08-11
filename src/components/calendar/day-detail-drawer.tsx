"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useUiStore } from "@/store/ui-store";
import { fromDateStamp } from "@/lib/dates";
import { DailyChecklist } from "@/components/shared/daily-checklist";
import { Checkbox } from "@/components/ui/checkbox";
import { TypedQuickAdd } from "./typed-quick-add";
import {
  useCalendarEventsInRange,
  addCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/db/calendar-events";
import { useMilestonesInRange, addMilestone, updateMilestone, deleteMilestone } from "@/lib/db/milestones";
import { CALENDAR_EVENT_TYPE_LABELS, MILESTONE_TYPE_LABELS, CALENDAR_ITEM_COLOR } from "@/lib/constants";
import { CALENDAR_EVENT_TYPES, MILESTONE_TYPES } from "@/lib/db/types";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-border pt-5 first:border-none first:pt-0">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function DayDetailDrawer() {
  const selectedDate = useUiStore((s) => s.selectedDate);
  const setSelectedDate = useUiStore((s) => s.setSelectedDate);

  const events = useCalendarEventsInRange(selectedDate ?? "", selectedDate ?? "");
  const milestones = useMilestonesInRange(selectedDate ?? "", selectedDate ?? "");

  const open = selectedDate !== null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && setSelectedDate(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-surface-raised px-6 py-6 shadow-2xl outline-none">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="font-display text-xl text-ink">
              {selectedDate ? format(fromDateStamp(selectedDate), "EEEE, MMMM d") : ""}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </Dialog.Close>
          </div>

          {selectedDate && (
            <div className="flex flex-col gap-5">
              <Section title="Checks">
                <DailyChecklist date={selectedDate} />
              </Section>

              <Section title="Events">
                <ul className="mb-3 flex flex-col gap-1">
                  {(events ?? []).map((e) => (
                    <li
                      key={e.id}
                      className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink/5"
                    >
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: CALENDAR_ITEM_COLOR[e.type] }}
                      />
                      <span className="flex-1 text-sm text-ink">{e.title}</span>
                      <span className="text-xs text-ink-faint">
                        {CALENDAR_EVENT_TYPE_LABELS[e.type]}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteCalendarEvent(e.id)}
                        aria-label={`Remove ${e.title}`}
                        className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                  {(events ?? []).length === 0 && (
                    <li className="px-2 text-sm text-ink-faint">No events yet.</li>
                  )}
                </ul>
                <TypedQuickAdd
                  placeholder="Add an event…"
                  typeOptions={CALENDAR_EVENT_TYPES.map((t) => ({
                    value: t,
                    label: CALENDAR_EVENT_TYPE_LABELS[t],
                  }))}
                  onAdd={(title, type) =>
                    addCalendarEvent({
                      title,
                      type,
                      startDate: selectedDate,
                      endDate: null,
                      allDay: true,
                      projectId: null,
                      notes: "",
                      location: "",
                    })
                  }
                />
              </Section>

              <Section title="Milestones">
                <ul className="mb-3 flex flex-col gap-1">
                  {(milestones ?? []).map((m) => (
                    <li
                      key={m.id}
                      className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink/5"
                    >
                      <Checkbox
                        checked={m.completed}
                        onCheckedChange={(completed) => updateMilestone(m.id, { completed })}
                        aria-label={m.title}
                      />
                      <span
                        className={
                          m.completed
                            ? "flex-1 text-sm text-ink-faint line-through"
                            : "flex-1 text-sm text-ink"
                        }
                      >
                        {m.title}
                      </span>
                      <span className="text-xs text-ink-faint">
                        {MILESTONE_TYPE_LABELS[m.type]}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteMilestone(m.id)}
                        aria-label={`Remove ${m.title}`}
                        className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                  {(milestones ?? []).length === 0 && (
                    <li className="px-2 text-sm text-ink-faint">No milestones yet.</li>
                  )}
                </ul>
                <TypedQuickAdd
                  placeholder="Add a milestone…"
                  typeOptions={MILESTONE_TYPES.map((t) => ({
                    value: t,
                    label: MILESTONE_TYPE_LABELS[t],
                  }))}
                  onAdd={(title, type) =>
                    addMilestone({
                      title,
                      type,
                      date: selectedDate,
                      projectId: null,
                      completed: false,
                      notes: "",
                    })
                  }
                />
              </Section>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
