"use client";

import { useActiveProjects } from "@/lib/db/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { NewProjectDialog } from "@/components/projects/new-project-dialog";
import type { Project } from "@/lib/db/types";

const STATUS_ORDER: Project["status"][] = [
  "active",
  "writing",
  "planning",
  "waiting",
  "idea",
  "submitted",
  "paused",
  "complete",
];

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const rank = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    return rank !== 0 ? rank : b.updatedAt - a.updatedAt;
  });
}

export default function ProjectsPage() {
  const projects = useActiveProjects();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-faint">Your research</p>
          <h1 className="font-display text-3xl text-ink">Projects</h1>
        </div>
        <NewProjectDialog />
      </div>

      {projects === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">
            No projects yet. Start one to track where your research stands.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortProjects(projects).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
