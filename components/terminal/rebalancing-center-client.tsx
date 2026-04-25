'use client';

import { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';
import { CompareBarChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { RebalancingPayload } from '@/lib/types/terminal-intelligence';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function RebalancingCenterClient() {
  const [data, setData] = useState<RebalancingPayload | null>(null);

  useEffect(() => {
    fetch('/api/terminal/rebalancing').then((res) => res.json()).then(setData).catch(() => null);
  }, []);

  return (
    <TerminalShell
      eyebrow="Rebalancing center"
      title="Allocation drift and trade plan"
      description="See current vs target sleeve weights, actionable drift, and a premium rebalance plan that can later connect directly to your real portfolio engine."
      rightSlot={<div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]"><Scale size={15} /> Policy-band rebalance layer</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Target comparison</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Current vs target sleeve mix</div>
              <div className="mt-4"><CompareBarChart data={data.bands} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Portfolio manager notes</div>
              <div className="mt-4 space-y-3">
                {data.actions.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-base font-semibold text-slate-950">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Drift register</div>
              <div className="mt-4 overflow-x-auto hide-scrollbar">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="pb-3 pr-4">Sleeve</th>
                      <th className="pb-3 pr-4">Current</th>
                      <th className="pb-3 pr-4">Target</th>
                      <th className="pb-3 pr-4">Drift</th>
                      <th className="pb-3 pr-4">Action</th>
                      <th className="pb-3">Trade value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.drifts.map((row) => (
                      <tr key={row.sleeve} className="border-t border-slate-100 text-sm text-slate-700">
                        <td className="py-4 pr-4 font-semibold text-slate-950">{row.sleeve}</td>
                        <td className="py-4 pr-4">{row.current}</td>
                        <td className="py-4 pr-4">{row.target}</td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${row.drift.startsWith('+') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{row.drift}</span></td>
                        <td className="py-4 pr-4 font-medium text-slate-950">{row.action}</td>
                        <td className="py-4 font-semibold text-slate-950">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Suggested trade list</div>
              <div className="mt-4 space-y-3">
                {data.tradeList.map((trade) => (
                  <div key={`${trade.side}-${trade.security}`} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-slate-950">{trade.side} · {trade.security}</div>
                      <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${trade.side === 'Buy' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{trade.amount}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">{trade.account}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{trade.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={surface}>Loading rebalancing center…</div>
      )}
    </TerminalShell>
  );
}
