"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TypedQuickAdd<T extends string>({
  placeholder,
  typeOptions,
  onAdd,
}: {
  placeholder: string;
  typeOptions: { value: T; label: string }[];
  onAdd: (title: string, type: T) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<T>(typeOptions[0].value);

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, type);
    setTitle("");
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="border-none bg-transparent px-0 py-1 focus:border-none"
      />
      {typeOptions.length > 1 && (
        <select
          value={type}
          onChange={(e) => setType(e.target.value as T)}
          className="shrink-0 rounded-md border border-border bg-surface px-1.5 py-1 text-xs text-ink-muted outline-none"
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </form>
  );
}
