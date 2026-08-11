"use client";

import { format } from "date-fns";

export function TodayHeader() {
  const now = new Date();

  return (
    <div className="mb-8">
      <p className="text-sm text-ink-faint">{format(now, "EEEE, MMMM d")}</p>
      <h1 className="font-display text-3xl text-ink">What matters today</h1>
    </div>
  );
}
