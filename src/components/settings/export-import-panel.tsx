"use client";

import { useRef, useState } from "react";
import { Download, Upload, TriangleAlert, FileCog, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  exportAllData,
  exportToFile,
  importAllData,
  resetAllData,
  clearBackupFileHandle,
  supportsFileSystemAccess,
} from "@/lib/export-import";
import { useBackupFileHandleName } from "@/lib/db/file-handles";

export function ExportImportPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmingImport, setConfirmingImport] = useState<File | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const backupFileName = useBackupFileHandleName();

  async function handleExport() {
    const payload = await exportAllData();
    const result = await exportToFile(payload);
    if (result.destination === "picked-file") {
      toast.success(`Backup saved to "${result.fileName}"`);
    } else if (result.destination === "download") {
      toast.success("Backup downloaded");
    }
    // "cancelled" (user closed the save dialog) — no toast needed.
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const result = await importAllData(json);
      if (result.ok) {
        toast.success("Data restored from backup");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Couldn't read that file — is it valid JSON?");
    } finally {
      setConfirmingImport(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleReset() {
    await resetAllData();
    setConfirmingReset(false);
    toast.success("All local data cleared");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink">Export all data</p>
          <p className="text-xs text-ink-faint">
            {supportsFileSystemAccess
              ? backupFileName
                ? `Overwrites "${backupFileName}" — wherever you saved it.`
                : "First export lets you pick where to save it; every export after that overwrites the same file."
              : "Downloads a JSON backup file. Your browser doesn't support overwriting a chosen file directly, so each export is a new download."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="size-3.5" strokeWidth={1.75} />
          Export
        </Button>
      </div>
      {backupFileName && (
        <div className="-mt-3 flex items-center gap-2 pl-0 text-xs text-ink-faint">
          <FileCog className="size-3.5 shrink-0" strokeWidth={1.75} />
          <span className="flex-1">Backing up to &ldquo;{backupFileName}&rdquo;</span>
          <button
            type="button"
            onClick={async () => {
              await clearBackupFileHandle();
              toast.success("Forgot backup location — next export will ask again");
            }}
            className="flex items-center gap-1 rounded p-1 text-ink-faint hover:text-ink"
          >
            <X className="size-3" />
            Change
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink">Import from backup</p>
          <p className="text-xs text-ink-faint">Replaces all current data with the backup file.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="size-3.5" strokeWidth={1.75} />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setConfirmingImport(file);
          }}
        />
      </div>
      {confirmingImport && (
        <div className="flex items-center gap-3 rounded-lg border border-type-conference/30 bg-type-conference/10 p-3">
          <TriangleAlert className="size-4 shrink-0 text-type-conference" strokeWidth={1.75} />
          <p className="flex-1 text-xs text-ink-muted">
            This replaces ALL current data with &ldquo;{confirmingImport.name}&rdquo;. This can&apos;t
            be undone.
          </p>
          <Button variant="danger" size="sm" onClick={() => handleImportFile(confirmingImport)}>
            Replace data
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirmingImport(null)}>
            Cancel
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
        <div>
          <p className="text-sm text-ink">Reset local data</p>
          <p className="text-xs text-ink-faint">Permanently deletes everything in this browser.</p>
        </div>
        {confirmingReset ? (
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" onClick={handleReset}>
              Confirm delete everything
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmingReset(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="danger" size="sm" onClick={() => setConfirmingReset(true)}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
