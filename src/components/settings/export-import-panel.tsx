"use client";

import { useRef, useState } from "react";
import { Download, Upload, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { exportAllData, downloadExport, importAllData, resetAllData } from "@/lib/export-import";

export function ExportImportPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmingImport, setConfirmingImport] = useState<File | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  async function handleExport() {
    const payload = await exportAllData();
    downloadExport(payload);
    toast.success("Backup downloaded");
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
          <p className="text-xs text-ink-faint">Download everything as a JSON backup file.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="size-3.5" strokeWidth={1.75} />
          Export
        </Button>
      </div>

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
