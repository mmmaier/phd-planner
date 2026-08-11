"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { DetailSection } from "@/components/ui/detail-section";
import { EditableText } from "@/components/ui/editable-text";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/projects/status-badge";
import { ProjectProgressBar } from "@/components/projects/project-progress-bar";
import { ProjectMilestones } from "@/components/projects/project-milestones";
import { ProjectTasks } from "@/components/projects/project-tasks";
import { ProjectLinks } from "@/components/projects/project-links";
import { DangerZone } from "@/components/projects/danger-zone";
import { ColorSwatchPicker } from "@/components/ui/color-swatch-picker";
import { useProject, updateProject } from "@/lib/db/projects";
import { PROJECT_STATUSES, PRIORITIES } from "@/lib/db/types";
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useProject(params.id);

  if (project === undefined) {
    return <p className="text-sm text-ink-faint">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => router.push("/projects")}
        className="mb-6 flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        Projects
      </button>

      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <span
            className="mt-1 size-3 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <EditableText
            value={project.title}
            onSave={(title) => updateProject(project.id, { title })}
            className="flex-1 font-display text-3xl"
          />
        </div>
      </div>

      <div className="mb-6">
        <ColorSwatchPicker
          value={project.color}
          onChange={(color) => updateProject(project.id, { color })}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select
          value={project.status}
          onChange={(e) =>
            updateProject(project.id, {
              status: e.target.value as (typeof PROJECT_STATUSES)[number],
            })
          }
          className="w-auto py-1.5 pr-7 text-xs"
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {PROJECT_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select
          value={project.priority}
          onChange={(e) =>
            updateProject(project.id, { priority: e.target.value as (typeof PRIORITIES)[number] })
          }
          className="w-auto py-1.5 pr-7 text-xs"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]} priority
            </option>
          ))}
        </Select>
        <StatusBadge status={project.status} />
      </div>

      <Panel className="mb-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">
          Next action
        </p>
        <EditableText
          value={project.nextAction}
          onSave={(nextAction) => updateProject(project.id, { nextAction })}
          placeholder="What's the next concrete step?"
          className="text-base"
        />
      </Panel>

      <Panel className="flex flex-col gap-6">
        <DetailSection title="Description">
          <EditableText
            as="textarea"
            value={project.description}
            onSave={(description) => updateProject(project.id, { description })}
            placeholder="What is this project about?"
          />
        </DetailSection>

        <DetailSection title="Dates">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              Start
              <input
                type="date"
                value={project.startDate ?? ""}
                onChange={(e) =>
                  updateProject(project.id, { startDate: e.target.value || null })
                }
                className="rounded-md border border-border bg-surface px-2 py-1 text-sm outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              Target
              <input
                type="date"
                value={project.targetDate ?? ""}
                onChange={(e) =>
                  updateProject(project.id, { targetDate: e.target.value || null })
                }
                className="rounded-md border border-border bg-surface px-2 py-1 text-sm outline-none"
              />
            </label>
          </div>
        </DetailSection>

        <DetailSection title="Milestones">
          <ProjectProgressBar projectId={project.id} />
          <div className="mt-3">
            <ProjectMilestones projectId={project.id} />
          </div>
        </DetailSection>

        <DetailSection title="Tasks">
          <ProjectTasks projectId={project.id} />
        </DetailSection>

        <DetailSection title="Notes">
          <EditableText
            as="textarea"
            value={project.notes}
            onSave={(notes) => updateProject(project.id, { notes })}
            placeholder="Anything worth remembering…"
          />
        </DetailSection>

        <DetailSection title="Links">
          <ProjectLinks projectId={project.id} links={project.links} />
        </DetailSection>

        <DetailSection title="Danger zone">
          <DangerZone project={project} />
        </DetailSection>
      </Panel>
    </div>
  );
}
