"use client";

import type { DragEvent } from "react";
import { cn } from "@/lib/utils";
import type { CalendarItem } from "@/lib/calendar-items";

export function EventPill({
  item,
  onClick,
  draggable,
  onDragStart,
}: {
  item: CalendarItem;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "flex w-full items-center gap-1.5 truncate rounded-md px-1.5 py-0.5 text-left text-[11px] leading-tight transition-opacity hover:opacity-80",
        item.completed && "opacity-50",
      )}
      style={{ backgroundColor: `color-mix(in oklab, ${item.color} 16%, transparent)` }}
      title={item.title}
    >
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: item.color }}
      />
      <span className={cn("truncate text-ink", item.completed && "line-through")}>
        {item.title}
      </span>
    </button>
  );
}
