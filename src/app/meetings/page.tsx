"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonManager } from "@/components/people/person-manager";
import { fromDateStamp, todayStamp } from "@/lib/dates";
import { useSupervisorMeetings, addSupervisorMeeting } from "@/lib/db/supervisor-meetings";
import { usePeople } from "@/lib/db/people";
import type { SupervisorMeeting } from "@/lib/db/types";

function MeetingRow({ meeting }: { meeting: SupervisorMeeting }) {
  const openActionItems = meeting.actionItems.filter((a) => !a.done).length;
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-border-strong"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">
          {format(fromDateStamp(meeting.date), "EEEE, MMMM d, yyyy")}
        </p>
        {meeting.agenda && (
          <p className="mt-0.5 truncate text-xs text-ink-muted">{meeting.agenda}</p>
        )}
      </div>
      {openActionItems > 0 && (
        <span className="shrink-0 rounded-full bg-type-conference/10 px-2 py-0.5 text-[11px] font-medium text-type-conference">
          {openActionItems} open
        </span>
      )}
    </Link>
  );
}

export default function MeetingsPage() {
  const router = useRouter();
  const meetings = useSupervisorMeetings();
  const people = usePeople();

  async function handleNew(personId: string | null) {
    const meeting = await addSupervisorMeeting({
      date: todayStamp(),
      personId,
      agenda: "",
      discussionNotes: "",
      decisions: "",
      actionItems: [],
      questionsForNextTime: "",
    });
    router.push(`/meetings/${meeting.id}`);
  }

  const unassigned = (meetings ?? []).filter((m) => !m.personId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-faint">Organized by person</p>
          <h1 className="font-display text-3xl text-ink">Meeting Notes</h1>
        </div>
        <div className="flex items-center gap-2">
          <PersonManager />
          <Button onClick={() => handleNew(null)}>
            <Plus className="size-4" strokeWidth={1.75} />
            New note
          </Button>
        </div>
      </div>

      {meetings === undefined || people === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : people.length === 0 && meetings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">
            Add a person (e.g. your supervisor) above, then log meeting notes under them.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {people.map((person) => {
            const personMeetings = meetings.filter((m) => m.personId === person.id);
            return (
              <div key={person.id}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-baseline gap-2">
                    <span className="font-display text-lg text-ink">{person.name}</span>
                    {person.role && (
                      <span className="text-xs text-ink-faint">{person.role}</span>
                    )}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleNew(person.id)}
                    className="flex items-center gap-1 text-xs text-ink-faint hover:text-ink"
                  >
                    <Plus className="size-3.5" strokeWidth={1.75} />
                    Add note
                  </button>
                </div>
                {personMeetings.length === 0 ? (
                  <p className="text-sm text-ink-faint">No notes yet.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {personMeetings.map((m) => (
                      <li key={m.id}>
                        <MeetingRow meeting={m} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          {unassigned.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-lg text-ink-muted">Unassigned</h2>
              <ul className="flex flex-col gap-2">
                {unassigned.map((m) => (
                  <li key={m.id}>
                    <MeetingRow meeting={m} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
