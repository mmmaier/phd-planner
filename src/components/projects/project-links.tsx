"use client";

import { useState } from "react";
import { ExternalLink, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateProject } from "@/lib/db/projects";
import type { ProjectLink } from "@/lib/db/types";

export function ProjectLinks({
  projectId,
  links,
}: {
  projectId: string;
  links: ProjectLink[];
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  function handleAdd() {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    const trimmedLabel = label.trim() || trimmedUrl;
    updateProject(projectId, { links: [...links, { label: trimmedLabel, url: trimmedUrl }] });
    setLabel("");
    setUrl("");
  }

  function handleRemove(index: number) {
    updateProject(projectId, { links: links.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <ul className="mb-3 flex flex-col gap-1">
        {links.map((link, i) => (
          <li
            key={`${link.url}-${i}`}
            className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink/5"
          >
            <ExternalLink className="size-3.5 shrink-0 text-ink-faint" strokeWidth={1.75} />
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-sm text-ink hover:text-accent-hover"
            >
              {link.label}
            </a>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              aria-label={`Remove ${link.label}`}
              className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
        {links.length === 0 && (
          <li className="px-2 text-sm text-ink-faint">No links yet.</li>
        )}
      </ul>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <Plus className="size-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label…"
          className="w-28 shrink-0 border-none bg-transparent px-0 py-1 focus:border-none"
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="min-w-0 flex-1 border-none bg-transparent px-0 py-1 focus:border-none"
        />
      </form>
    </div>
  );
}
