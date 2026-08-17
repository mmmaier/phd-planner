"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Plus, Settings2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePeople, addPerson, deletePerson } from "@/lib/db/people";

export function PersonManager() {
  const people = usePeople();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addPerson({ name: trimmed, role: role.trim(), notes: "" });
    setName("");
    setRole("");
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-muted hover:border-border-strong hover:text-ink"
        >
          <Settings2 className="size-3.5" strokeWidth={1.75} />
          People
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-40 w-72 rounded-xl border border-border bg-surface-raised p-4 shadow-xl outline-none"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
            People
          </p>
          <ul className="mb-3 flex flex-col gap-1">
            {(people ?? []).map((p) => (
              <li key={p.id} className="group flex items-center gap-2 rounded-lg px-1.5 py-1">
                <span className="flex-1 text-sm text-ink">
                  {p.name}
                  {p.role && <span className="ml-1.5 text-xs text-ink-faint">{p.role}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => deletePerson(p.id)}
                  aria-label={`Remove ${p.name}`}
                  className="rounded p-0.5 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
            {people !== undefined && people.length === 0 && (
              <li className="px-1.5 text-sm text-ink-faint">No one added yet.</li>
            )}
          </ul>
          <form
            className="flex flex-col gap-2 border-t border-border pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <div className="flex items-center gap-2">
              <button
                type="submit"
                aria-label="Add person"
                className="shrink-0 rounded-md p-0.5 text-ink-faint transition-colors hover:text-ink"
              >
                <Plus className="size-3.5" />
              </button>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name…"
                className="border-none bg-transparent px-0 py-1 text-sm focus:border-none"
              />
            </div>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role (optional) — e.g. Supervisor"
              className="text-xs"
            />
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
