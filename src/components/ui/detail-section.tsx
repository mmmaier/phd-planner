import type { ReactNode } from "react";

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-border pt-6 first:border-none first:pt-0">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
        {title}
      </h2>
      {children}
    </div>
  );
}
