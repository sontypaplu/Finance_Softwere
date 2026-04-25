'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Newspaper, Radar } from 'lucide-react';
import { ExposureBarChart, PerformanceChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { WatchlistPayload } from '@/lib/types/terminal-intelligence';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function WatchlistMarketClient() {
  const [data, setData] = useState<WatchlistPayload | null>(null);

  useEffect(() => {
    fetch('/api/terminal/watchlist').then((res) => res.json()).then(setData).catch(() => null);
  }, []);

  return (
    <TerminalShell
      eyebrow="Watchlist & market board"
      title="Live market board"
      description="Premium watchlist surface combining market pulse, pinned idea monitoring, breadth, and high-conviction setup tracking in one terminal page."
      rightSlot={<div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]"><Radar size={15} /> Live-style watchlist layer</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {data.board.map((item) => (
              <div key={item.symbol} className="rounded-[28px] border border-white/55 bg-white/78 p-5 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.region}</div>
                    <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.symbol}</div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${item.direction === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{item.change}</div>
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{item.price}</div>
                <div className="mt-2 text-sm text-slate-500">{item.name}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 2xl:grid-cols-[1.16fr_0.84fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Board pulse</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Watchlist momentum vs broad tape</div>
              <div className="mt-4"><PerformanceChart data={data.pulse} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Breadth</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Internal market structure</div>
              <div className="mt-4"><ExposureBarChart data={data.breadth} /></div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className={surface}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Pinned ideas</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Watchlist register</div>
                </div>
                <div className="rounded-full border border-white/70 bg-slate-50 px-4 py-2 text-sm text-slate-600">Actionable ideas only</div>
              </div>
              <div className="mt-5 overflow-x-auto hide-scrollbar">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="pb-3 pr-4">Symbol</th>
                      <th className="pb-3 pr-4">Last</th>
                      <th className="pb-3 pr-4">Change</th>
                      <th className="pb-3 pr-4">Volume</th>
                      <th className="pb-3 pr-4">Trigger</th>
                      <th className="pb-3">Thesis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.watchlist.map((row) => (
                      <tr key={row.symbol} className="border-t border-slate-100 text-sm text-slate-700">
                        <td className="py-4 pr-4">
                          <Link href={row.route} className="group inline-flex items-center gap-2 font-semibold text-slate-950">
                            {row.symbol}
                            <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" />
                          </Link>
                          <div className="mt-1 text-xs text-slate-500">{row.name}</div>
                        </td>
                        <td className="py-4 pr-4 font-medium text-slate-950">{row.last}</td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${row.change.startsWith('-') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{row.change}</span></td>
                        <td className="py-4 pr-4">{row.volume}</td>
                        <td className="py-4 pr-4 text-slate-950">{row.trigger}</td>
                        <td className="py-4 text-slate-600">{row.thesis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className={surface}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><Newspaper size={14} /> Movers</div>
                <div className="mt-4 space-y-3">
                  {data.movers.map((item) => (
                    <div key={item.symbol} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-base font-semibold text-slate-950">{item.symbol} · {item.name}</div>
                          <div className="mt-1 text-sm text-slate-500">{item.reason}</div>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${item.change.startsWith('-') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{item.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Theme board</div>
                <div className="mt-4 space-y-3">
                  {data.themes.map((item) => (
                    <div key={item.title} className="rounded-[24px] border border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0.92))] p-5">
                      <div className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.title}</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={surface}>Loading watchlist and market board…</div>
      )}
    </TerminalShell>
  );
}
