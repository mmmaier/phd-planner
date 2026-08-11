"use client";

import { ExternalLink, X } from "lucide-react";
import { ResourceTypeIcon } from "./resource-type-icon";
import { Select } from "@/components/ui/select";
import { useTopics } from "@/lib/db/topics";
import { markResourceStatus, deleteResource } from "@/lib/db/resources";
import { RESOURCE_STATUSES } from "@/lib/db/types";
import { RESOURCE_STATUS_LABELS } from "@/lib/constants";
import type { Resource } from "@/lib/db/types";

export function ResourceRow({ resource }: { resource: Resource }) {
  const topics = useTopics();
  const topicNames = (topics ?? []).filter((t) => resource.topicIds.includes(t.id));

  return (
    <div className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-ink/[0.03]">
      <ResourceTypeIcon type={resource.type} className="size-4 shrink-0 text-ink-faint" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {resource.url ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm text-ink hover:text-accent-hover"
            >
              {resource.title}
            </a>
          ) : (
            <span className="truncate text-sm text-ink">{resource.title}</span>
          )}
          {resource.url && (
            <ExternalLink className="size-3 shrink-0 text-ink-faint" strokeWidth={1.75} />
          )}
        </div>
        {topicNames.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {topicNames.map((t) => (
              <span
                key={t.id}
                className="rounded-full px-1.5 py-0.5 text-[10px] text-ink-muted"
                style={{ backgroundColor: `color-mix(in oklab, ${t.color} 14%, transparent)` }}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {resource.estimatedDurationMinutes && (
        <span className="shrink-0 text-xs text-ink-faint">
          {resource.estimatedDurationMinutes} min
        </span>
      )}

      <Select
        value={resource.status}
        onChange={(e) => markResourceStatus(resource.id, e.target.value as Resource["status"])}
        className="w-auto shrink-0 py-1 pr-6 text-xs"
      >
        {RESOURCE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {RESOURCE_STATUS_LABELS[s]}
          </option>
        ))}
      </Select>

      <button
        type="button"
        onClick={() => deleteResource(resource.id)}
        aria-label={`Remove ${resource.title}`}
        className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
