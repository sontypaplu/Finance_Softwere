'use client';

import { useEffect, useState } from 'react';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { AnalyticsPayload } from '@/lib/types/terminal-pages';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

function badgeTone(value: string) {
  if (value.startsWith('+')) return 'bg-emerald-50 text-emerald-600';
  if (value.startsWith('-')) return 'bg-rose-50 text-rose-600';
  return 'bg-slate-100 text-slate-600';
}

function severityTone(value: 'high' | 'medium' | 'low') {
  if (value === 'high') return 'bg-rose-50 text-rose-600';
  if (value === 'medium') return 'bg-amber-50 text-amber-600';
  return 'bg-slate-100 text-slate-600';
}

export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch('/api/terminal/analytics');
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
      eyebrow="Analytics tables"
      title="Institutional analytics tables"
      description="Dense, premium table surfaces for holdings, transactions, tax lots, and watchlist alerts — built to connect directly to backend data later."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Structured for server-fed data</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <div className={surface}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Holdings master</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Core exposures</div>
                </div>
                <div className="rounded-full border border-white/70 bg-slate-50 px-4 py-2 text-sm text-slate-600">Pinned columns ready</div>
              </div>
              <div className="mt-5 overflow-x-auto hide-scrollbar">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="pb-3 pr-4">Security</th>
                      <th className="pb-3 pr-4">Account</th>
                      <th className="pb-3 pr-4">Weight</th>
                      <th className="pb-3 pr-4">Market value</th>
                      <th className="pb-3 pr-4">Day</th>
                      <th className="pb-3 pr-4">Total return</th>
                      <th className="pb-3 pr-4">Risk</th>
                      <th className="pb-3">Drift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.holdings.map((row) => (
                      <tr key={row.security} className="border-t border-slate-100 text-sm text-slate-700">
                        <td className="py-4 pr-4 font-semibold text-slate-950">{row.security}</td>
                        <td className="py-4 pr-4">{row.account}</td>
                        <td className="py-4 pr-4">{row.weight}</td>
                        <td className="py-4 pr-4">{row.marketValue}</td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeTone(row.dayChange)}`}>{row.dayChange}</span></td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeTone(row.totalReturn)}`}>{row.totalReturn}</span></td>
                        <td className="py-4 pr-4">{row.risk}</td>
                        <td className="py-4 font-medium text-slate-950">{row.drift}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`${surface} flex flex-col`}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Alert center</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Data quality & watchlist</div>
              </div>
              <div className="mt-5 space-y-4">
                {data.alerts.map((alert) => (
                  <div key={alert.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-slate-950">{alert.title}</div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${severityTone(alert.severity)}`}>{alert.severity}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{alert.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Transaction ledger</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Recent entries</div>
              <div className="mt-5 space-y-3">
                {data.transactions.map((row) => (
                  <div key={`${row.date}-${row.security}-${row.type}`} className="grid grid-cols-[108px_92px_1fr_1fr_120px_110px] items-center gap-3 rounded-[24px] border border-slate-100 bg-slate-50/80 px-4 py-4 text-sm text-slate-700">
                    <div className="font-medium text-slate-950">{row.date}</div>
                    <div>{row.type}</div>
                    <div className="font-medium text-slate-950">{row.security}</div>
                    <div>{row.account}</div>
                    <div className="font-semibold text-slate-950">{row.amount}</div>
                    <div className="text-right"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{row.status}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tax lots</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Holding period visibility</div>
              <div className="mt-5 overflow-x-auto hide-scrollbar">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="pb-3 pr-4">Security</th>
                      <th className="pb-3 pr-4">Lot date</th>
                      <th className="pb-3 pr-4">Remaining</th>
                      <th className="pb-3 pr-4">Cost basis</th>
                      <th className="pb-3 pr-4">Gain</th>
                      <th className="pb-3">Tax class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.taxLots.map((row) => (
                      <tr key={`${row.security}-${row.lotDate}`} className="border-t border-slate-100 text-sm text-slate-700">
                        <td className="py-4 pr-4 font-semibold text-slate-950">{row.security}</td>
                        <td className="py-4 pr-4">{row.lotDate}</td>
                        <td className="py-4 pr-4">{row.remaining}</td>
                        <td className="py-4 pr-4">{row.costBasis}</td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeTone(row.gain)}`}>{row.gain}</span></td>
                        <td className="py-4 font-medium text-slate-950">{row.taxClass}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={surface}>Loading analytics tables…</div>
      )}
    </TerminalShell>
  );
}
