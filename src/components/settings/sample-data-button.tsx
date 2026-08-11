"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { seedDemoData } from "@/lib/db/seed";

export function SampleDataButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await seedDemoData();
      toast.success("Sample data added — explore, then reset whenever you're ready.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-ink">Load sample data</p>
        <p className="text-xs text-ink-faint">
          Adds fictional example projects, tasks, and resources so you can explore the app.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
        <Sparkles className="size-3.5" strokeWidth={1.75} />
        {loading ? "Adding…" : "Load sample data"}
      </Button>
    </div>
  );
}
