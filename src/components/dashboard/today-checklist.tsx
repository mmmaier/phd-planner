"use client";

import { Panel, PanelHeading } from "@/components/ui/panel";
import { DailyChecklist } from "@/components/shared/daily-checklist";
import { todayStamp } from "@/lib/dates";

export function TodayChecklist() {
  return (
    <Panel>
      <PanelHeading>Today&apos;s checks</PanelHeading>
      <DailyChecklist date={todayStamp()} />
    </Panel>
  );
}
