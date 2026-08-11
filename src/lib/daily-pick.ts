import { db } from "./db/db";
import { getDailyPick, saveDailyPick } from "./db/daily-picks";
import { todayStamp, type DateStamp } from "./dates";
import type { Resource } from "./db/types";

const RECENT_HISTORY_DAYS = 14;

async function getRecentlyShownIds(excludeDate: DateStamp): Promise<Set<string>> {
  const picks = await db.dailyPicks.orderBy("date").reverse().limit(RECENT_HISTORY_DAYS).toArray();
  const ids = picks.filter((p) => p.date !== excludeDate).flatMap((p) => p.shownResourceIds);
  return new Set(ids);
}

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

// Prefers unread items, then items not shown recently, then items matching
// the user's focus topics — each preference only applied if it doesn't
// empty out the candidate pool entirely.
function selectFrom(
  pool: Resource[],
  recentlyShown: Set<string>,
  focusTopicIds: string[],
): Resource | undefined {
  if (pool.length === 0) return undefined;

  const unread = pool.filter((r) => r.status === "unread");
  const candidates = unread.length > 0 ? unread : pool;

  const notRecent = candidates.filter((r) => !recentlyShown.has(r.id));
  const afterRecency = notRecent.length > 0 ? notRecent : candidates;

  if (focusTopicIds.length > 0) {
    const focused = afterRecency.filter((r) => r.topicIds.some((t) => focusTopicIds.includes(t)));
    if (focused.length > 0) return pickRandom(focused);
  }

  return pickRandom(afterRecency);
}

function paperPool(resources: Resource[]) {
  return resources.filter((r) => r.type === "paper" || r.type === "article");
}

function videoPool(resources: Resource[], thresholdMinutes: number) {
  return resources.filter(
    (r) => r.type === "video" && (r.estimatedDurationMinutes ?? Infinity) <= thresholdMinutes,
  );
}

async function loadContext(date: DateStamp) {
  const [resources, settings, recentlyShown] = await Promise.all([
    db.resources.toArray(),
    db.appSettings.get("settings"),
    getRecentlyShownIds(date),
  ]);
  return {
    resources,
    thresholdMinutes: settings?.shortWatchThresholdMinutes ?? 15,
    focusTopicIds: settings?.focusTopicIds ?? [],
    recentlyShown,
  };
}

export async function ensureDailyPick(date: DateStamp = todayStamp()) {
  const existing = await getDailyPick(date);
  if (existing) return existing;

  const { resources, thresholdMinutes, focusTopicIds, recentlyShown } = await loadContext(date);

  const paper = selectFrom(paperPool(resources), recentlyShown, focusTopicIds);
  const video = selectFrom(videoPool(resources, thresholdMinutes), recentlyShown, focusTopicIds);

  return saveDailyPick(date, {
    paperResourceId: paper?.id ?? null,
    videoResourceId: video?.id ?? null,
    shownResourceIds: [paper?.id, video?.id].filter((id): id is string => !!id),
  });
}

export async function reshufflePaperPick(date: DateStamp = todayStamp()) {
  const existing = await getDailyPick(date);
  const { resources, focusTopicIds, recentlyShown } = await loadContext(date);

  const pool = paperPool(resources).filter((r) => r.id !== existing?.paperResourceId);
  const picked = selectFrom(pool, recentlyShown, focusTopicIds);

  return saveDailyPick(date, {
    paperResourceId: picked?.id ?? null,
    shownResourceIds: mergeShown(existing?.shownResourceIds, picked?.id),
  });
}

export async function reshuffleVideoPick(date: DateStamp = todayStamp()) {
  const existing = await getDailyPick(date);
  const { resources, thresholdMinutes, focusTopicIds, recentlyShown } = await loadContext(date);

  const pool = videoPool(resources, thresholdMinutes).filter(
    (r) => r.id !== existing?.videoResourceId,
  );
  const picked = selectFrom(pool, recentlyShown, focusTopicIds);

  return saveDailyPick(date, {
    videoResourceId: picked?.id ?? null,
    shownResourceIds: mergeShown(existing?.shownResourceIds, picked?.id),
  });
}

function mergeShown(existing: string[] | undefined, newId: string | undefined): string[] {
  const set = new Set(existing ?? []);
  if (newId) set.add(newId);
  return Array.from(set);
}
