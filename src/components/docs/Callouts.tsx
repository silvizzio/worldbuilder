export function Callouts({ title, cautions }: { title?: string; cautions?: string[] }) {
  if (!cautions || cautions.length === 0) return null;

  return (
    <div className="not-prose mt-4 rounded-2xl border border-fd-warning/30 bg-fd-warning/10 p-4 text-sm text-fd-foreground">
      <div className="font-medium">{title ?? 'Notes'}</div>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {cautions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
