"use client";

import { cn } from "@/lib/utils";

export const ACCENT_COLORS = [
  "var(--color-type-task)",
  "var(--color-type-deadline)",
  "var(--color-type-meeting)",
  "var(--color-type-conference)",
  "var(--color-type-paper)",
  "var(--color-type-milestone)",
  "var(--color-type-routine)",
  "var(--color-ink-faint)",
];

export function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACCENT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={`Choose color ${color}`}
          className={cn(
            "size-6 rounded-full ring-offset-2 ring-offset-surface transition-shadow",
            value === color && "ring-2 ring-ink/40",
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
