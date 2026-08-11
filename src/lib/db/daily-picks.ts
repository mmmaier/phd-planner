import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import type { DailyPick } from "./types";
import { newId, now } from "@/lib/id";
import type { DateStamp } from "@/lib/dates";

export function useDailyPick(date: DateStamp) {
  return useLiveQuery(
    () => db.dailyPicks.where("date").equals(date).first(),
    [date],
  );
}

export async function getDailyPick(date: DateStamp) {
  return db.dailyPicks.where("date").equals(date).first();
}

export async function saveDailyPick(
  date: DateStamp,
  changes: Partial<Omit<DailyPick, "id" | "date" | "createdAt" | "updatedAt">>,
) {
  const existing = await getDailyPick(date);
  const timestamp = now();

  if (existing) {
    await db.dailyPicks.update(existing.id, { ...changes, updatedAt: timestamp });
    return { ...existing, ...changes, updatedAt: timestamp };
  }

  const record: DailyPick = {
    id: newId(),
    date,
    paperResourceId: null,
    videoResourceId: null,
    shownResourceIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    ...changes,
  };

  try {
    await db.dailyPicks.add(record);
    return record;
  } catch (err) {
    // Another tab/caller inserted this date's row between our check and our
    // add — the unique index on `date` rejects it. Fall back to updating
    // whatever won the race instead of surfacing an error for this.
    if (err instanceof Error && err.name === "ConstraintError") {
      const winner = await getDailyPick(date);
      if (winner) {
        await db.dailyPicks.update(winner.id, { ...changes, updatedAt: timestamp });
        return { ...winner, ...changes, updatedAt: timestamp };
      }
    }
    throw err;
  }
}

export function useRecentlyShownResourceIds(limit = 14): string[] | undefined {
  return useLiveQuery(async () => {
    const picks = await db.dailyPicks.orderBy("date").reverse().limit(limit).toArray();
    return Array.from(new Set(picks.flatMap((p) => p.shownResourceIds)));
  }, [limit]);
}
