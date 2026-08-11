export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-start justify-center gap-2">
      <h1 className="font-display text-2xl text-ink">{title}</h1>
      <p className="max-w-md text-sm text-ink-muted">{description}</p>
    </div>
  );
}
