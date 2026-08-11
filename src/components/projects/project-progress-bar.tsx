"use client";

import { useMilestonesForProject } from "@/lib/db/milestones";

export function ProjectProgressBar({ projectId }: { projectId: string }) {
  const milestones = useMilestonesForProject(projectId);

  if (!milestones || milestones.length === 0) return null;

  const completed = milestones.filter((m) => m.completed).length;
  const percent = Math.round((completed / milestones.length) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/5">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-xs text-ink-faint">
        {completed}/{milestones.length} milestones
      </span>
    </div>
  );
}
