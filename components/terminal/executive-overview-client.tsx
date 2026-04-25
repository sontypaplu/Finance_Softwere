'use client';

import { Sparkles } from 'lucide-react';
import { NewsCarousel, type NewsItem } from '@/components/terminal/news-carousel';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { AllocationChart, PerformanceChart } from '@/components/terminal/charts';
import { FinanceNewsSection } from '@/components/terminal/finance-news-section';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import { useOverviewData } from '@/features/overview/hooks/use-overview-data';
import { usePortfolioWorkspace } from '@/components/terminal/portfolio-workspace-provider';
import { StateBanner } from '@/components/enterprise/state-banner';
import { SourceMetaRow } from '@/components/enterprise/source-meta-row';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function ExecutiveOverviewClient() {
  const { selectedPortfolio } = usePortfolioWorkspace();
  const { data: overview, meta, loading, error } = useOverviewData(selectedPortfolio?.id);

  return (
    <TerminalShell
      eyebrow="Executive overview"
      title="Finance terminal home"
      description="Premium top-level workspace with live-style ticker flow, research spotlight, portfolio charts, recent activity, and risk-aware overview blocks."
      rightSlot={<div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]"><Sparkles size={15} /> Home surface active</div>}
    >
      {overview ? (
        <div className="space-y-6">
          <SourceMetaRow meta={meta} />
          <StateBanner title="Executive overview uses a shared feature hook" detail="This page is now fed by a typed API envelope and mock repository adapter instead of reading seed files conceptually from the page layer." />
          <NewsCarousel items={overview.news as NewsItem[]} />
          <KPIGrid items={overview.kpis} />
          <FinanceNewsSection />
          <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
            <div className={surface}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Performance curve</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Portfolio vs benchmark</div>
                </div>
                <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600">+18.4% YTD</div>
              </div>
              <div className="mt-4"><PerformanceChart data={overview.trend} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Allocation map</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Capital mix</div>
              <div className="mt-4"><AllocationChart data={overview.allocation} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {overview.allocation.map((item: { name: string; value: number }) => (
                  <div key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="text-sm text-slate-500">{item.name}</div>
                    <div className="mt-1 text-lg font-semibold text-slate-950">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Recent activity</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Latest portfolio actions</div>
              <div className="mt-5 space-y-3">
                {overview.recent.map((row: { id: string; title: string; meta: string; amount: string; date: string }) => (
                  <div key={row.id} className="flex items-center justify-between rounded-[24px] border border-slate-100 bg-slate-50/80 px-4 py-4">
                    <div>
                      <div className="text-base font-medium text-slate-950">{row.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{row.meta}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-semibold text-slate-950">{row.amount}</div>
                      <div className="mt-1 text-sm text-slate-500">{row.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Risk & alert center</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Priority watchlist</div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {overview.alerts.map((alert: { title: string; detail: string }) => (
                  <div key={alert.title} className="rounded-[26px] border border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0.92))] p-5">
                    <div className="text-lg font-semibold leading-tight tracking-[-0.03em] text-slate-950">{alert.title}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{alert.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className={surface}>Loading terminal surface…</div>
      ) : (
        <div className={surface}>Unable to load overview. {error}</div>
      )}
    </TerminalShell>
  );
}
