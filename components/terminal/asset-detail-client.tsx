'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BadgeDollarSign, Orbit, ShieldCheck } from 'lucide-react';
import { AllocationChart, PerformanceChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { AssetDetailPayload } from '@/lib/types/terminal-ops';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function AssetDetailClient({ symbol }: { symbol: string }) {
  const [data, setData] = useState<AssetDetailPayload | null>(null);

  useEffect(() => {
    fetch(`/api/terminal/assets/${symbol}`).then((res) => res.json()).then(setData).catch(() => null);
  }, [symbol]);

  const normalizedCurve = useMemo(() => {
    if (!data?.priceHistory?.length) return [];
    const basePrice = data.priceHistory[0].price || 1;
    const baseBenchmark = data.priceHistory[0].benchmark || 1;
    return data.priceHistory.map((row) => ({
      month: row.month,
      portfolio: Number(((row.price / basePrice) * 100).toFixed(2)),
      benchmark: Number(((row.benchmark / baseBenchmark) * 100).toFixed(2))
    }));
  }, [data]);

  if (!data) {
    return <TerminalShell eyebrow="Asset detail" title="Loading asset page" description="Preparing security intelligence surface."><div className={surface}>Loading…</div></TerminalShell>;
  }

  return (
    <TerminalShell
      eyebrow="Asset detail"
      title={`${data.name} · ${data.symbol}`}
      description={data.description}
      rightSlot={<div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]"><ArrowUpRight size={15} /> {data.exchange} · {data.price} · {data.change}</div>}
    >
      <div className="space-y-6">
        <KPIGrid items={data.stats.map((item) => ({ label: item.label, value: item.value, change: item.change || '', tone: item.tone || 'flat' }))} />

        <div className="grid gap-6 2xl:grid-cols-[1.16fr_0.84fr]">
          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Normalized performance</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Security vs benchmark index = 100</div>
            <div className="mt-4"><PerformanceChart data={normalizedCurve} /></div>
          </div>
          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Exposure mix</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Portfolio role map</div>
            <div className="mt-4"><AllocationChart data={data.exposure} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.tags.map((tag) => (
                <div key={tag} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700">{tag}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><Orbit size={14} /> Position ledger</div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    {['Date', 'Type', 'Account', 'Qty', 'Price', 'Amount'].map((heading) => <th key={heading} className="pb-3 font-medium">{heading}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.trades.map((trade) => (
                    <tr key={`${trade.date}-${trade.type}`} className="border-t border-slate-100/90 text-slate-700">
                      <td className="py-4">{trade.date}</td>
                      <td className="py-4 font-medium text-slate-950">{trade.type}</td>
                      <td className="py-4">{trade.account}</td>
                      <td className="py-4">{trade.quantity}</td>
                      <td className="py-4">{trade.price}</td>
                      <td className="py-4 font-semibold text-slate-950">{trade.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><ShieldCheck size={14} /> Benchmark card</div>
            <div className="mt-4 space-y-3">
              {data.benchmark.map((row) => (
                <div key={row.metric} className="grid grid-cols-[1.1fr_0.7fr_0.7fr] items-center gap-3 rounded-[22px] border border-slate-100 bg-slate-50/80 px-4 py-4 text-sm">
                  <div className="font-medium text-slate-600">{row.metric}</div>
                  <div className="font-semibold text-slate-950">{row.asset}</div>
                  <div className="text-slate-500">{row.benchmark}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Security ratio center</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">All core ratios for this security</div>
            <div className="mt-5 grid gap-6">
              {data.ratioGroups.map((group) => (
                <div key={group.title} className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{group.title}</div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((item) => (
                      <div key={item.label} className="rounded-[22px] border border-white/80 bg-white/90 p-4">
                        <div className="text-sm font-medium text-slate-500">{item.label}</div>
                        <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{item.value}</div>
                        {item.benchmark ? <div className="mt-2 text-sm text-slate-600">Benchmark / ref: {item.benchmark}</div> : null}
                        {item.note ? <div className="mt-2 text-sm text-slate-500">{item.note}</div> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><BadgeDollarSign size={14} /> Income stream</div>
            <div className="mt-4 space-y-3">
              {data.income.map((entry) => (
                <div key={`${entry.date}-${entry.amount}`} className="rounded-[22px] border border-slate-100 bg-slate-50/80 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-950">{entry.type}</div>
                    <div className="text-sm font-semibold text-slate-950">{entry.amount}</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{entry.date}</div>
                  <div className="mt-2 text-sm text-slate-600">{entry.note}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Research notes</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Thesis register</div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {data.notes.map((note) => (
                <div key={`thesis-${note.title}`} className="rounded-[24px] border border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0.92))] p-5">
                  <div className="text-lg font-semibold leading-tight tracking-[-0.03em] text-slate-950">{note.title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{note.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TerminalShell>
  );
}
