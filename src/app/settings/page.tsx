import { ShieldCheck } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { DetailSection } from "@/components/ui/detail-section";
import { RoutineManager } from "@/components/settings/routine-manager";
import { PreferencesPanel } from "@/components/settings/preferences-panel";
import { ExportImportPanel } from "@/components/settings/export-import-panel";
import { SampleDataButton } from "@/components/settings/sample-data-button";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-ink-faint">Configuration</p>
        <h1 className="font-display text-3xl text-ink">Settings</h1>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-type-milestone/30 bg-type-milestone/10 p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-type-milestone" strokeWidth={1.75} />
        <p className="text-sm text-ink-muted">
          Your data is stored locally in this browser. Nothing is sent anywhere — back it up
          with the export below if you want a copy elsewhere.
        </p>
      </div>

      <Panel className="flex flex-col gap-6">
        <DetailSection title="Daily checks">
          <RoutineManager />
        </DetailSection>

        <DetailSection title="Preferences">
          <PreferencesPanel />
        </DetailSection>

        <DetailSection title="Backup and portability">
          <ExportImportPanel />
        </DetailSection>

        <DetailSection title="Try it out">
          <SampleDataButton />
        </DetailSection>
      </Panel>
    </div>
  );
}
