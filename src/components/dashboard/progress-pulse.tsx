"use client";

import { useState } from "react";
import { subDays } from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { Input } from "@/components/ui/input";
import { toDateStamp, todayStamp } from "@/lib/dates";
import { useProgressEntriesInRange, addProgressEntry } from "@/lib/db/progress-entries";
import { useActiveProjects } from "@/lib/db/projects";

export function ProgressPulse() {
  const today = todayStamp();
  const weekAgo = toDateStamp(subDays(new Date(), 6));
  const entries = useProgressEntriesInRange(weekAgo, today);
  const projects = useActiveProjects();

  const [draft, setDraft] = useState("");
  const lastEntryProject = projects?.find((p) => p.id === entries?.[0]?.projectId);

  async function handleAdd() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await addProgressEntry({ text, date: today, projectId: null });
    toast.success("Progress logged");
  }

  return (
    <Panel>
      <PanelHeading>Progress this week</PanelHeading>

      {entries === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-ink-faint">
          Nothing logged yet this week — even small wins count.
        </p>
      ) : (
        <>
          <p className="mb-2 text-sm text-ink">
            <span className="font-medium">{entries.length}</span>{" "}
            {entries.length === 1 ? "entry" : "entries"} logged
          </p>
          <p className="line-clamp-2 flex items-start gap-1.5 text-sm text-ink-muted">
            {lastEntryProject && (
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: lastEntryProject.color }}
              />
            )}
            &ldquo;{entries[0].text}&rdquo;
          </p>
        </>
      )}

      <form
        className="mt-3 flex items-center gap-2 border-t border-border pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <button
          type="submit"
          aria-label="Add"
          className="shrink-0 rounded-md p-0.5 text-ink-faint transition-colors hover:text-ink"
        >
          <Plus className="size-4" strokeWidth={1.75} />
        </button>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Log something you got done…"
          className="border-none bg-transparent px-0 py-1 focus:border-none"
        />
      </form>
    </Panel>
  );
}
