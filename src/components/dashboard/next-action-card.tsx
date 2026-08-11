"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { useActiveProjects } from "@/lib/db/projects";
import { PRIORITY_LABELS } from "@/lib/constants";
import type { Project } from "@/lib/db/types";

const PRIORITY_RANK: Record<Project["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function pickFocusProject(projects: Project[]): Project | undefined {
  const withNextAction = projects.filter((p) => p.nextAction.trim().length > 0);
  const pool = withNextAction.length > 0 ? withNextAction : projects;
  return [...pool].sort((a, b) => {
    const rank = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    return rank !== 0 ? rank : b.updatedAt - a.updatedAt;
  })[0];
}

export function NextActionCard() {
  const projects = useActiveProjects();
  const focus = projects ? pickFocusProject(projects) : undefined;

  return (
    <Panel>
      <PanelHeading>Next action</PanelHeading>
      {projects === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : !focus ? (
        <p className="text-sm text-ink-faint">
          No active projects yet — add one to see your next action here.
        </p>
      ) : (
        <Link
          href={`/projects/${focus.id}`}
          className="group flex flex-col gap-2 rounded-lg -mx-1 px-1 py-1 transition-colors hover:bg-ink/5"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-hover">
              {PRIORITY_LABELS[focus.priority]} priority
            </span>
            <span className="text-xs text-ink-faint">{focus.title}</span>
          </div>
          <p className="flex items-start justify-between gap-2 text-sm text-ink">
            <span>{focus.nextAction || "No next action set yet."}</span>
            <ArrowRight className="mt-0.5 size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
          </p>
        </Link>
      )}
    </Panel>
  );
}
