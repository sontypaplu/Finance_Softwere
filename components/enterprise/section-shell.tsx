import type { ReactNode } from 'react';

export function SectionShell({ eyebrow, title, description, children, actions }: { eyebrow?: string; title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {eyebrow ? <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{eyebrow}</div> : null}
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h2>
          {description ? <p className="mt-2 max-w-[780px] text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
