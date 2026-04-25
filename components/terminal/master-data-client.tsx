'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Database, Layers3, ListChecks } from 'lucide-react';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { MasterDataPayload } from '@/lib/types/terminal-ops';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function MasterDataClient() {
  const [payload, setPayload] = useState<MasterDataPayload | null>(null);

  useEffect(() => {
    fetch('/api/terminal/master').then((res) => res.json()).then(setPayload).catch(() => null);
  }, []);

  if (!payload) {
    return <TerminalShell eyebrow="Master data" title="Loading master records" description="Preparing portfolios, accounts, securities, watchlists, and benchmarks."><div className={surface}>Loading…</div></TerminalShell>;
  }

  return (
    <TerminalShell eyebrow="Master data" title="Reference manager" description="Central surface for portfolios, accounts, securities, watchlists, and benchmark records so backend entities can attach later without changing the UI.">
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><Layers3 size={14} /> Portfolios</div>
            <div className="mt-4 space-y-3">
              {payload.portfolios.map((item) => (
                <div key={item.name} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-slate-950">{item.name}</div>
                    <div className="text-sm font-semibold text-slate-950">{item.value}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{item.base} · {item.mandate}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><Database size={14} /> Accounts</div>
            <div className="mt-4 space-y-3">
              {payload.accounts.map((item) => (
                <div key={item.name} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-slate-950">{item.name}</div>
                    <div className="text-sm font-semibold text-slate-950">{item.value}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{item.broker} · {item.type}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><ListChecks size={14} /> Watchlist</div>
            <div className="mt-4 space-y-3">
              {payload.watchlist.map((item) => (
                <div key={item.symbol} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-slate-950">{item.symbol}</div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Trigger</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{item.name}</div>
                  <div className="mt-2 text-sm text-slate-500">{item.trigger}</div>
                  <div className="mt-2 text-sm text-slate-600">{item.thesis}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Securities master</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Tracked instruments</div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-slate-400">
                  <tr>{['Symbol', 'Name', 'Asset class', 'Region', 'Benchmark', 'Page'].map((heading) => <th key={heading} className="pb-3 font-medium">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {payload.securities.map((item) => (
                    <tr key={item.symbol} className="border-t border-slate-100/90 text-slate-700">
                      <td className="py-4 font-semibold text-slate-950">{item.symbol}</td>
                      <td className="py-4">{item.name}</td>
                      <td className="py-4">{item.assetClass}</td>
                      <td className="py-4">{item.region}</td>
                      <td className="py-4">{item.benchmark}</td>
                      <td className="py-4"><Link href={`/terminal/assets/${item.symbol}`} className="rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Open</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Benchmark library</div>
            <div className="mt-4 space-y-3">
              {payload.benchmarks.map((item) => (
                <div key={item.code} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-slate-950">{item.name}</div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{item.code}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{item.scope}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TerminalShell>
  );
}
