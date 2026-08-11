"use client";

import { useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export function EditableText({
  value,
  onSave,
  placeholder,
  className,
  as = "input",
}: {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  as?: "input" | "textarea";
}) {
  const [draft, setDraft] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Reset the draft when the external value changes (e.g. switching
  // records) — done during render, per React's guidance, rather than in an
  // effect, to avoid an extra cascading render.
  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(value);
  }

  function commit() {
    if (draft !== value) onSave(draft);
  }

  const sharedProps = {
    value: draft,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(e.target.value),
    onBlur: commit,
    placeholder,
    className: cn(
      "w-full rounded-lg border border-transparent bg-transparent px-2 py-1 -mx-2 text-ink outline-none transition-colors placeholder:text-ink-faint hover:border-border focus:border-accent focus:bg-surface",
      className,
    ),
  };

  if (as === "textarea") {
    return (
      <textarea
        {...sharedProps}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) e.currentTarget.blur();
        }}
        className={cn(sharedProps.className, "resize-none")}
      />
    );
  }

  return (
    <input
      {...sharedProps}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
}
