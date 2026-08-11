import { cn } from "@/lib/utils";
import { PRIORITY_LABELS } from "@/lib/constants";
import type { Priority } from "@/lib/db/types";

const PRIORITY_COLOR: Record<Priority, string> = {
  high: "bg-type-deadline",
  medium: "bg-type-conference",
  low: "bg-ink-faint",
};

export function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
      <span className={cn("size-1.5 rounded-full", PRIORITY_COLOR[priority])} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
