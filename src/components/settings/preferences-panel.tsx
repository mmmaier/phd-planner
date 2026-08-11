"use client";

import { cn } from "@/lib/utils";
import { useSettings, updateSettings } from "@/lib/db/settings";
import { useTopics } from "@/lib/db/topics";

export function PreferencesPanel() {
  const settings = useSettings();
  const topics = useTopics();

  function toggleFocusTopic(id: string) {
    const next = settings.focusTopicIds.includes(id)
      ? settings.focusTopicIds.filter((t) => t !== id)
      : [...settings.focusTopicIds, id];
    updateSettings({ focusTopicIds: next });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink">Short watch threshold</p>
          <p className="text-xs text-ink-faint">
            Videos at or under this length are eligible for Today&apos;s Short Watch.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            value={settings.shortWatchThresholdMinutes}
            onChange={(e) =>
              updateSettings({ shortWatchThresholdMinutes: Number(e.target.value) || 15 })
            }
            className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink outline-none"
          />
          <span className="text-xs text-ink-faint">min</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink">Week starts on</p>
          <p className="text-xs text-ink-faint">Applies to the calendar and weekly review.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {[
            { value: 1, label: "Mon" },
            { value: 0, label: "Sun" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateSettings({ weekStartsOn: opt.value as 0 | 1 })}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                settings.weekStartsOn === opt.value
                  ? "bg-accent/10 text-accent-hover"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {topics !== undefined && topics.length > 0 && (
        <div>
          <p className="mb-1 text-sm text-ink">Focus topics</p>
          <p className="mb-2 text-xs text-ink-faint">
            The Daily Learning Pick will lean toward these when possible.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleFocusTopic(t.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  settings.focusTopicIds.includes(t.id)
                    ? "border-transparent text-accent-foreground"
                    : "border-border text-ink-muted hover:border-border-strong",
                )}
                style={
                  settings.focusTopicIds.includes(t.id)
                    ? { backgroundColor: t.color }
                    : undefined
                }
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
