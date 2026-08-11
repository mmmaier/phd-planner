import { TodayHeader } from "@/components/dashboard/today-header";
import { TodayChecklist } from "@/components/dashboard/today-checklist";
import { NextActionCard } from "@/components/dashboard/next-action-card";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { ProgressPulse } from "@/components/dashboard/progress-pulse";
import { DailyPickCard } from "@/components/learnings/daily-pick-card";

export default function TodayPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <TodayHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <TodayChecklist />
          <ProgressPulse />
        </div>
        <div className="flex flex-col gap-6">
          <NextActionCard />
          <UpcomingDeadlines />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <DailyPickCard kind="paper" />
        <DailyPickCard kind="video" />
      </div>
    </div>
  );
}
