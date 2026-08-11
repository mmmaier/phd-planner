import Link from "next/link";
import { format } from "date-fns";
import { StatusBadge } from "./status-badge";
import { PriorityDot } from "./priority-dot";
import { fromDateStamp } from "@/lib/dates";
import type { Project } from "@/lib/db/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="font-display text-lg leading-tight text-ink">{project.title}</h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="line-clamp-2 text-sm text-ink-muted">{project.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <PriorityDot priority={project.priority} />
        {project.targetDate && (
          <span className="text-xs text-ink-faint">
            Target {format(fromDateStamp(project.targetDate), "MMM yyyy")}
          </span>
        )}
      </div>

      {project.nextAction && (
        <div className="rounded-lg bg-ink/[0.03] px-3 py-2 text-xs text-ink-muted">
          <span className="font-medium text-ink-faint">Next: </span>
          {project.nextAction}
        </div>
      )}
    </Link>
  );
}
