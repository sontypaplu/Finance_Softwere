'use client';

import { useEffect, useState } from 'react';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { AttributionChart, PerformanceChart, RollingReturnChart } from '@/components/terminal/charts';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { PerformancePayload } from '@/lib/types/terminal-pages';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

function heatTone(value: number) {
  if (value >= 2) return 'bg-emerald-100 text-emerald-700';
  if (value > 0) return 'bg-emerald-50 text-emerald-600';
  if (value === 0) return 'bg-slate-100 text-slate-500';
  if (value <= -1) return 'bg-rose-100 text-rose-700';
  return 'bg-rose-50 text-rose-600';
}

export function PerformanceClient() {
  const [data, setData] = useState<PerformancePayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch('/api/terminal/performance');
      const payload = await response.json();
      if (!cancelled) setData(payload);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TerminalShell
      eyebrow="Performance & benchmark"
      title="Performance intelligence"
      description="Track cumulative outperformance, rolling return regimes, attribution drivers, and monthly heat signatures in a premium benchmark surface."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Updated from dedicated performance feed</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />
          <div className="grid gap-6 2xl:grid-cols-[1.24fr_0.76fr]">
            <div className={surface}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Compounded curve</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Portfolio vs benchmark</div>
                </div>
                <div className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">+4.62% active</div>
              </div>
              <div className="mt-4"><PerformanceChart data={data.trend} /></div>
            </div>
            <div className={`${surface} flex flex-col justify-between`}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">What is working</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Manager notes</div>
              </div>
              <div className="mt-5 space-y-4">
                {data.beats.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-base font-semibold text-slate-950">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Rolling regimes</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">1M, 3M, 6M return stack</div>
              <div className="mt-4"><RollingReturnChart data={data.rolling} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Return attribution</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Contribution by sleeve</div>
              <div className="mt-4"><AttributionChart data={data.attribution} /></div>
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
      ) : (
        <div className={surface}>Loading performance intelligence…</div>
      )}
    </TerminalShell>
  );
}
