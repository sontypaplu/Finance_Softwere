'use client';

import { useEffect, useState } from 'react';
import { AllocationChart, ExposureBarChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { RiskPayload } from '@/lib/types/terminal-pages';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

function correlationTone(value: number) {
  if (value >= 0.8) return 'bg-indigo-100 text-indigo-700';
  if (value >= 0.5) return 'bg-indigo-50 text-indigo-600';
  if (value >= 0.25) return 'bg-emerald-50 text-emerald-600';
  return 'bg-slate-100 text-slate-500';
}

export function RiskCenterClient() {
  const [data, setData] = useState<RiskPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch('/api/terminal/risk');
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
      eyebrow="Allocation & risk"
      title="Risk and allocation center"
      description="Read allocation balance, sector concentration, factor exposures, correlation structure, and scenario sensitivity in one high-end risk surface."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Scenario set: balanced regime</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-6 2xl:grid-cols-[0.84fr_1.16fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Allocation map</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Capital distribution</div>
              <div className="mt-4"><AllocationChart data={data.allocation} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.allocation.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="text-sm text-slate-500">{item.name}</div>
                    <div className="mt-1 text-lg font-semibold text-slate-950">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Sector exposure</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Concentration by sleeve</div>
              <div className="mt-4"><ExposureBarChart data={data.sectorExposure} /></div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Factor exposure</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Style and factor stack</div>
              <div className="mt-4"><ExposureBarChart data={data.factorExposure.map((item) => ({ name: item.factor, value: item.value }))} /></div>
            </div>

            <div className={`${surface} flex flex-col`}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Risk desk notes</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Priority observations</div>
              </div>
              <div className="mt-5 space-y-4">
                {data.alerts.map((alert) => (
                  <div key={alert.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-base font-semibold text-slate-950">{alert.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{alert.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Correlation matrix</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Cross-sleeve relationships</div>
              <div className="mt-5 overflow-x-auto">
                <div className="min-w-[640px] space-y-2">
                  <div className="grid grid-cols-[140px_repeat(5,minmax(0,1fr))] gap-2">
                    <div />
                    {data.correlation.labels.map((label) => (
                      <div key={`col-${label}`} className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
                    ))}
                  </div>
                  {data.correlation.matrix.map((row, rowIndex) => (
                    <div key={data.correlation.labels[rowIndex]} className="grid grid-cols-[140px_repeat(5,minmax(0,1fr))] gap-2">
                      <div className="flex items-center px-3 py-2 text-sm font-medium text-slate-700">{data.correlation.labels[rowIndex]}</div>
                      {row.map((value, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`} className={`rounded-2xl px-3 py-3 text-center text-sm font-semibold ${correlationTone(value)}`}>
                          {value.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Scenario studio</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Stress outcomes</div>
              <div className="mt-5 space-y-4">
                {data.scenarios.map((scenario) => (
                  <div key={scenario.scenario} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-slate-950">{scenario.scenario}</div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${scenario.impact.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{scenario.impact}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{scenario.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={surface}>Loading risk center…</div>
      )}
    </TerminalShell>
  );
}
