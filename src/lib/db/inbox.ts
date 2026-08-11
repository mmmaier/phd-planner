import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { createRecord, deleteRecord } from "./crud";
import type { InboxItem } from "./types";
import { now } from "@/lib/id";

export type NewInboxItem = Omit<InboxItem, "id" | "createdAt" | "updatedAt">;

export function addInboxItem(data: NewInboxItem) {
  return createRecord(db.inboxItems, data);
}

export function deleteInboxItem(id: string) {
  return deleteRecord(db.inboxItems, id);
}

export async function markInboxItemProcessed(id: string) {
  await db.inboxItems.update(id, { processed: true, updatedAt: now() });
}

export function useUnprocessedInboxItems() {
  return useLiveQuery(async () => {
    const items = await db.inboxItems.filter((item) => !item.processed).toArray();
    return items.sort((a, b) => b.createdAt - a.createdAt);
  }, []);
}
