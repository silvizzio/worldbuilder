import type { ReactNode } from 'react';

export function FeatureHero({
  title,
  summary,
  meta,
}: {
  title: string;
  summary: string;
  meta?: ReactNode;
}) {
  return (
    <div className="not-prose mb-6 rounded-2xl border border-fd-border bg-fd-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-2xl font-semibold tracking-tight text-fd-foreground">{title}</div>
          <div className="text-sm leading-6 text-fd-muted-foreground">{summary}</div>
        </div>
        {meta ? <div className="shrink-0">{meta}</div> : null}
      </div>
    </div>
  );
}
