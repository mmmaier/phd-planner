"use client";

import * as Popover from "@radix-ui/react-popover";
import { Palette } from "lucide-react";
import { ColorSwatchPicker } from "@/components/ui/color-swatch-picker";
import { useActiveProjects, updateProject } from "@/lib/db/projects";

export function ProjectColorPopover() {
  const projects = useActiveProjects();

  if (!projects || projects.length === 0) return null;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Edit project colors"
          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-muted hover:border-border-strong hover:text-ink"
        >
          <Palette className="size-3.5" strokeWidth={1.75} />
          Colors
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-40 w-72 rounded-xl border border-border bg-surface-raised p-4 shadow-xl outline-none"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Project colors
          </p>
          <div className="flex flex-col gap-4">
            {projects.map((p) => (
              <div key={p.id}>
                <p className="mb-1.5 text-sm text-ink">{p.title}</p>
                <ColorSwatchPicker
                  value={p.color}
                  onChange={(color) => updateProject(p.id, { color })}
                />
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
