"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateProject, deleteProject } from "@/lib/db/projects";
import type { Project } from "@/lib/db/types";

export function DangerZone({ project }: { project: Project }) {
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => updateProject(project.id, { archived: !project.archived })}
      >
        {project.archived ? "Unarchive" : "Archive"}
      </Button>

      {confirmingDelete ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted">Delete this project?</span>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              await deleteProject(project.id);
              router.push("/projects");
            }}
          >
            Confirm delete
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="danger" size="sm" onClick={() => setConfirmingDelete(true)}>
          Delete
        </Button>
      )}
    </div>
  );
}
