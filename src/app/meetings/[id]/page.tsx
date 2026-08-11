"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ListChecks, Plus, X } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { DetailSection } from "@/components/ui/detail-section";
import { EditableText } from "@/components/ui/editable-text";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  useSupervisorMeeting,
  updateSupervisorMeeting,
  deleteSupervisorMeeting,
  addActionItem,
  updateActionItem,
  removeActionItem,
  convertActionItemToTask,
} from "@/lib/db/supervisor-meetings";

export default function MeetingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const meeting = useSupervisorMeeting(params.id);
  const [newItem, setNewItem] = useState("");

  if (meeting === undefined) {
    return <p className="text-sm text-ink-faint">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => router.push("/meetings")}
        className="mb-6 flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        Meetings
      </button>

      <div className="mb-6 flex items-center gap-3">
        <input
          type="date"
          value={meeting.date}
          onChange={(e) => updateSupervisorMeeting(meeting.id, { date: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-ink outline-none"
        />
      </div>

      <Panel className="flex flex-col gap-6">
        <DetailSection title="Agenda">
          <EditableText
            as="textarea"
            value={meeting.agenda}
            onSave={(agenda) => updateSupervisorMeeting(meeting.id, { agenda })}
            placeholder="What do you want to cover?"
          />
        </DetailSection>

        <DetailSection title="Discussion notes">
          <EditableText
            as="textarea"
            value={meeting.discussionNotes}
            onSave={(discussionNotes) =>
              updateSupervisorMeeting(meeting.id, { discussionNotes })
            }
            placeholder="What came up?"
          />
        </DetailSection>

        <DetailSection title="Decisions">
          <EditableText
            as="textarea"
            value={meeting.decisions}
            onSave={(decisions) => updateSupervisorMeeting(meeting.id, { decisions })}
            placeholder="What was decided?"
          />
        </DetailSection>

        <DetailSection title="Action items">
          <ul className="mb-3 flex flex-col gap-1">
            {meeting.actionItems.map((item) => (
              <li
                key={item.id}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink/5"
              >
                <Checkbox
                  checked={item.done}
                  onCheckedChange={(done) => updateActionItem(meeting.id, item.id, { done })}
                  aria-label={item.text}
                />
                <span
                  className={
                    item.done
                      ? "flex-1 text-sm text-ink-faint line-through"
                      : "flex-1 text-sm text-ink"
                  }
                >
                  {item.text}
                </span>
                {!item.taskId ? (
                  <button
                    type="button"
                    onClick={() => convertActionItemToTask(meeting.id, item.id)}
                    title="Add as task"
                    className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                  >
                    <ListChecks className="size-3.5" strokeWidth={1.75} />
                  </button>
                ) : (
                  <span className="text-[10px] text-ink-faint">task added</span>
                )}
                <button
                  type="button"
                  onClick={() => removeActionItem(meeting.id, item.id)}
                  aria-label={`Remove ${item.text}`}
                  className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
            {meeting.actionItems.length === 0 && (
              <li className="px-2 text-sm text-ink-faint">No action items yet.</li>
            )}
          </ul>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = newItem.trim();
              if (!trimmed) return;
              addActionItem(meeting.id, trimmed);
              setNewItem("");
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
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add an action item…"
              className="border-none bg-transparent px-0 py-1 focus:border-none"
            />
          </form>
        </DetailSection>

        <DetailSection title="Questions for next time">
          <EditableText
            as="textarea"
            value={meeting.questionsForNextTime}
            onSave={(questionsForNextTime) =>
              updateSupervisorMeeting(meeting.id, { questionsForNextTime })
            }
            placeholder="What do you want to ask next?"
          />
        </DetailSection>

        <DetailSection title="Danger zone">
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              await deleteSupervisorMeeting(meeting.id);
              router.push("/meetings");
            }}
          >
            Delete meeting
          </Button>
        </DetailSection>
      </Panel>
    </div>
  );
}
