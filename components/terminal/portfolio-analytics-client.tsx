'use client';

import { useEffect, useState } from 'react';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { ExposureBarChart, PerformanceChart } from '@/components/terminal/charts';
import { AllocationTreemapChart, DrawdownChart, RollingRiskChart } from '@/components/terminal/advanced-charts';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { PortfolioAnalyticsPayload } from '@/lib/types/master-scope';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

function heatTone(value: number) {
  if (value >= 2) return 'bg-emerald-100 text-emerald-700';
  if (value > 0) return 'bg-emerald-50 text-emerald-600';
  if (value === 0) return 'bg-slate-100 text-slate-500';
  if (value <= -1) return 'bg-rose-100 text-rose-700';
  return 'bg-rose-50 text-rose-600';
}

export function PortfolioAnalyticsClient() {
  const [data, setData] = useState<PortfolioAnalyticsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch('/api/terminal/portfolio-analytics');
      const payload = await response.json();
      if (!cancelled) setData(payload);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <TerminalShell
      eyebrow="Portfolio analytics"
      title="Portfolio analytics studio"
      description="A deep analytical layer for cumulative return, drawdown behavior, rolling risk, allocation structure, and contribution intelligence — organized in multiple premium surfaces instead of one oversized table."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Master analytics scope active</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />
          <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Growth curve</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Compounded return vs benchmark</div>
              <div className="mt-4"><PerformanceChart data={data.cumulative} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Allocation structure</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Asset mix treemap</div>
              <div className="mt-4"><AllocationTreemapChart data={data.treemap} /></div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Risk experience</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Drawdown path</div>
              <div className="mt-4"><DrawdownChart data={data.drawdown} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Rolling quality</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Volatility, Sharpe, Sortino</div>
              <div className="mt-4"><RollingRiskChart data={data.rollingRisk} /></div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Contribution map</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Return contribution by sleeve</div>
              <div className="mt-4"><ExposureBarChart data={data.contributors} dataKey="contribution" labelKey="name" /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Ratio scorecards</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Selected performance diagnostics</div>
              <div className="mt-5 space-y-3">
                {data.scorecards.map((row) => (
                  <div key={row.label} className="grid gap-3 rounded-[24px] border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-[1.1fr_0.55fr_0.55fr]">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{row.label}</div>
                      <div className="mt-1 text-sm text-slate-600">{row.note}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Portfolio</div>
                      <div className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">{row.portfolio}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Benchmark</div>
                      <div className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">{row.benchmark}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Monthly heat signature</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Return heatmap</div>
            <div className="mt-5 overflow-x-auto">
              <div className="min-w-[760px] space-y-3">
                {data.heatmap.map((row) => (
                  <div key={row.year} className="grid grid-cols-[90px_repeat(12,minmax(0,1fr))] gap-2">
                    <div className="flex items-center text-sm font-semibold text-slate-600">{row.year}</div>
                    {row.months.map((cell) => (
                      <div key={`${row.year}-${cell.label}`} className={`rounded-2xl px-3 py-3 text-center text-sm font-medium ${heatTone(cell.value)}`}>
                        <div className="text-[11px] uppercase tracking-[0.18em] opacity-70">{cell.label}</div>
                        <div className="mt-1">{cell.value > 0 ? '+' : ''}{cell.value.toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : <div className={surface}>Loading analytics studio…</div>}
    </TerminalShell>
  );
}
