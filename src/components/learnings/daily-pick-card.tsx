"use client";

import { useEffect } from "react";
import { Shuffle, Check } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { ResourceTypeIcon } from "./resource-type-icon";
import { todayStamp } from "@/lib/dates";
import { useDailyPick } from "@/lib/db/daily-picks";
import { useResource, markResourceStatus } from "@/lib/db/resources";
import { ensureDailyPick, reshufflePaperPick, reshuffleVideoPick } from "@/lib/daily-pick";

export function DailyPickCard({ kind }: { kind: "paper" | "video" }) {
  const today = todayStamp();
  const pick = useDailyPick(today);

  useEffect(() => {
    ensureDailyPick(today);
  }, [today]);

  const resourceId = kind === "paper" ? pick?.paperResourceId : pick?.videoResourceId;
  const resource = useResource(resourceId ?? undefined);

  async function handleShuffle() {
    if (kind === "paper") await reshufflePaperPick(today);
    else await reshuffleVideoPick(today);
  }

  async function handleComplete() {
    if (!resource) return;
    await markResourceStatus(resource.id, "completed");
    toast.success("Marked as completed");
  }

  return (
    <Panel>
      <PanelHeading
        action={
          resource ? (
            <button
              type="button"
              onClick={handleShuffle}
              aria-label="Shuffle"
              className="rounded-lg p-1.5 text-ink-faint hover:bg-ink/5 hover:text-ink"
            >
              <Shuffle className="size-3.5" strokeWidth={1.75} />
            </button>
          ) : undefined
        }
      >
        {kind === "paper" ? "Today's Paper" : "Today's Short Watch"}
      </PanelHeading>

      {pick === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : !resource ? (
        <p className="text-sm text-ink-faint">
          {kind === "paper"
            ? "Add a paper or article to your library to get a daily pick."
            : "Add a short video (within your configured watch length) to get a daily pick."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <ResourceTypeIcon
              type={resource.type}
              className="mt-0.5 size-4 shrink-0 text-ink-faint"
            />
            {resource.url ? (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink hover:text-accent-hover"
              >
                {resource.title}
              </a>
            ) : (
              <span className="text-sm font-medium text-ink">{resource.title}</span>
            )}
          </div>
          {resource.estimatedDurationMinutes && (
            <p className="text-xs text-ink-faint">{resource.estimatedDurationMinutes} min</p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleComplete}
            disabled={resource.status === "completed"}
            className="self-start"
          >
            <Check className="size-3.5" strokeWidth={1.75} />
            {resource.status === "completed" ? "Completed" : "Mark completed"}
          </Button>
        </div>
      )}
    </Panel>
  );
}
