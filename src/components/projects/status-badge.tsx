import { cn } from "@/lib/utils";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import type { ProjectStatus } from "@/lib/db/types";

const ACTIVE_STATUSES: ProjectStatus[] = ["active", "writing"];
const DONE_STATUSES: ProjectStatus[] = ["complete", "submitted"];

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        ACTIVE_STATUSES.includes(status) && "bg-accent/10 text-accent-hover",
        DONE_STATUSES.includes(status) && "bg-type-milestone/10 text-type-milestone",
        !ACTIVE_STATUSES.includes(status) &&
          !DONE_STATUSES.includes(status) &&
          "bg-ink/5 text-ink-muted",
      )}
    >
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}
