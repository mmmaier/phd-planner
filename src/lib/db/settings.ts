import { useLiveQuery } from "dexie-react-hooks";
import { db, DEFAULT_SETTINGS, ensureSettings } from "./db";
import type { AppSettings } from "./types";

export function useSettings(): AppSettings {
  const settings = useLiveQuery(() => db.appSettings.get("settings"), []);
  return settings ?? DEFAULT_SETTINGS;
}

export async function updateSettings(changes: Partial<Omit<AppSettings, "id">>) {
  await ensureSettings();
  await db.appSettings.update("settings", changes);
}
