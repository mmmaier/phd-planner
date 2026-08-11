"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { fromDateStamp, relativeDayLabel, todayStamp } from "@/lib/dates";
import { useNextSupervisorMeeting } from "@/lib/db/supervisor-meetings";

export function NextMeetingNote() {
  const meeting = useNextSupervisorMeeting(todayStamp());
  if (!meeting) return null;

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong"
    >
      <Users className="size-4 shrink-0 text-type-meeting" strokeWidth={1.75} />
      <span className="flex-1 text-sm text-ink">
        Next supervisor meeting{" "}
        <span className="text-ink-muted">
          {format(fromDateStamp(meeting.date), "EEEE, MMM d")}
        </span>
      </span>
      <span className="shrink-0 text-xs text-ink-faint">{relativeDayLabel(meeting.date)}</span>
    </Link>
  );
}
