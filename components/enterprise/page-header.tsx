import type { ReactNode } from 'react';
import { StatusBadge } from '@/components/enterprise/status-badge';

export function PageHeader({ eyebrow, title, description, badgeLabel, children }: { eyebrow: string; title: string; description: string; badgeLabel?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 backdrop-blur-xl">{eyebrow}</div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-5xl font-semibold tracking-[-0.05em] text-slate-950">{title}</h1>
          {badgeLabel ? <StatusBadge label={badgeLabel} tone="info" /> : null}
        </div>
        <p className="mt-3 max-w-[860px] text-lg leading-8 text-slate-600">{description}</p>
      </div>
      {children ? <div className="xl:pb-1">{children}</div> : null}
    </div>
  );
}
