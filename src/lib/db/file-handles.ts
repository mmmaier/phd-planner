import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";

const BACKUP_HANDLE_ID = "backup";

export async function getBackupFileHandle(): Promise<FileSystemFileHandle | undefined> {
  const record = await db.fileHandles.get(BACKUP_HANDLE_ID);
  return record?.handle;
}

export async function setBackupFileHandle(handle: FileSystemFileHandle): Promise<void> {
  await db.fileHandles.put({ id: BACKUP_HANDLE_ID, handle });
}

export async function clearBackupFileHandle(): Promise<void> {
  await db.fileHandles.delete(BACKUP_HANDLE_ID);
}

export function useBackupFileHandleName(): string | undefined {
  return useLiveQuery(async () => (await db.fileHandles.get(BACKUP_HANDLE_ID))?.handle.name, []);
}
