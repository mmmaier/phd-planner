import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { CommandPalette } from "./command-palette";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <main className="flex-1 px-4 py-6 md:px-10 md:py-8">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}
