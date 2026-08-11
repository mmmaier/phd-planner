"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fromDateStamp, todayStamp } from "@/lib/dates";
import { useSupervisorMeetings, addSupervisorMeeting } from "@/lib/db/supervisor-meetings";

export default function MeetingsPage() {
  const router = useRouter();
  const meetings = useSupervisorMeetings();

  async function handleNew() {
    const meeting = await addSupervisorMeeting({
      date: todayStamp(),
      agenda: "",
      discussionNotes: "",
      decisions: "",
      actionItems: [],
      questionsForNextTime: "",
    });
    router.push(`/meetings/${meeting.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-faint">Supervisor</p>
          <h1 className="font-display text-3xl text-ink">Meetings</h1>
        </div>
        <Button onClick={handleNew}>
          <Plus className="size-4" strokeWidth={1.75} />
          New meeting
        </Button>
      </div>

      {meetings === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : meetings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">
            No meetings recorded yet — log your next one to keep track of decisions and
            action items.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {meetings.map((m) => {
            const openActionItems = m.actionItems.filter((a) => !a.done).length;
            return (
              <li key={m.id}>
                <Link
                  href={`/meetings/${m.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {format(fromDateStamp(m.date), "EEEE, MMMM d, yyyy")}
                    </p>
                    {m.agenda && (
                      <p className="mt-0.5 truncate text-xs text-ink-muted">{m.agenda}</p>
                    )}
                  </div>
                  {openActionItems > 0 && (
                    <span className="shrink-0 rounded-full bg-type-conference/10 px-2 py-0.5 text-[11px] font-medium text-type-conference">
                      {openActionItems} open
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
