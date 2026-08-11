"use client";

import { useState } from "react";
import { DailyPickCard } from "@/components/learnings/daily-pick-card";
import { TopicManager } from "@/components/learnings/topic-manager";
import { AddResourceDialog } from "@/components/learnings/add-resource-dialog";
import { ResourceRow } from "@/components/learnings/resource-row";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useResources } from "@/lib/db/resources";
import { RESOURCE_TYPES, RESOURCE_STATUSES } from "@/lib/db/types";
import { RESOURCE_TYPE_LABELS, RESOURCE_STATUS_LABELS } from "@/lib/constants";

export default function LearningsPage() {
  const resources = useResources();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = (resources ?? []).filter((r) => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="text-sm text-ink-faint">Your library</p>
        <h1 className="font-display text-3xl text-ink">Learnings</h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DailyPickCard kind="paper" />
        <DailyPickCard kind="video" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-40"
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-auto py-1.5 pr-7 text-xs"
          >
            <option value="all">All types</option>
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {RESOURCE_TYPE_LABELS[t]}
              </option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-auto py-1.5 pr-7 text-xs"
          >
            <option value="all">All statuses</option>
            {RESOURCE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {RESOURCE_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <TopicManager />
          <AddResourceDialog />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface">
        {resources === undefined ? (
          <p className="p-5 text-sm text-ink-faint">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-5 text-sm text-ink-faint">
            {resources.length === 0
              ? "Your library is empty — add a paper, article, or video to get started."
              : "Nothing matches these filters."}
          </p>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((r) => (
              <ResourceRow key={r.id} resource={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
