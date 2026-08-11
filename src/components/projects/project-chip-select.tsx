"use client";

import { cn } from "@/lib/utils";
import type { Project } from "@/lib/db/types";

export function ProjectChipSelect({
  projects,
  selectedId,
  onSelect,
}: {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {projects.map((p) => {
        const selected = selectedId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(selected ? "" : p.id)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-all",
              selected ? "border-transparent text-accent-foreground" : "text-ink-muted",
            )}
            style={{
              backgroundColor: selected
                ? p.color
                : `color-mix(in oklab, ${p.color} 14%, transparent)`,
              borderColor: selected ? "transparent" : `color-mix(in oklab, ${p.color} 35%, transparent)`,
            }}
          >
            {p.title}
          </button>
        );
      })}
    </div>
  );
}
