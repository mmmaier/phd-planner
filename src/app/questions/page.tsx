"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EditableText } from "@/components/ui/editable-text";
import {
  useResearchQuestions,
  addResearchQuestion,
  updateResearchQuestion,
  deleteResearchQuestion,
} from "@/lib/db/research-questions";
import { useActiveProjects } from "@/lib/db/projects";

export default function QuestionsPage() {
  const questions = useResearchQuestions();
  const projects = useActiveProjects();

  const [question, setQuestion] = useState("");
  const [projectId, setProjectId] = useState("");

  async function handleAdd() {
    const trimmed = question.trim();
    if (!trimmed) return;
    setQuestion("");
    await addResearchQuestion({
      question: trimmed,
      projectId: projectId || null,
      status: "open",
      notes: "",
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-ink-faint">Open threads</p>
        <h1 className="font-display text-3xl text-ink">Research questions</h1>
      </div>

      <form
        className="mb-8 flex items-center gap-2 rounded-2xl border border-border bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <button
          type="submit"
          aria-label="Add"
          className="shrink-0 rounded-md p-0.5 text-ink-faint transition-colors hover:text-ink"
        >
          <Plus className="size-4" strokeWidth={1.75} />
        </button>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Why does model X fail on subgroup Y?"
          className="border-none bg-transparent px-0 focus:border-none"
        />
        {projects !== undefined && projects.length > 0 && (
          <Select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-auto shrink-0 py-1.5 pr-7 text-xs"
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </Select>
        )}
      </form>

      {questions === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">
            No open questions yet — jot down what you&apos;re unsure about.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {questions.map((q) => {
            const project = projects?.find((p) => p.id === q.projectId);
            const resolved = q.status === "resolved";
            return (
              <li
                key={q.id}
                className="group rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Checkbox
                      checked={resolved}
                      onCheckedChange={(checked) =>
                        updateResearchQuestion(q.id, {
                          status: checked ? "resolved" : "open",
                        })
                      }
                      aria-label={q.question}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <EditableText
                      value={q.question}
                      onSave={(text) => updateResearchQuestion(q.id, { question: text })}
                      className={resolved ? "text-sm text-ink-faint line-through" : "text-sm text-ink"}
                    />
                    <EditableText
                      as="textarea"
                      value={q.notes}
                      onSave={(notes) => updateResearchQuestion(q.id, { notes })}
                      placeholder="Notes (optional)…"
                      className="mt-1 text-xs text-ink-muted"
                    />
                  </div>
                  {project && (
                    <span className="shrink-0 text-xs text-ink-faint">{project.title}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteResearchQuestion(q.id)}
                    aria-label="Remove question"
                    className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
