'use client';

import { useEffect, useState } from 'react';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { RealizedUnrealizedChart } from '@/components/terminal/advanced-charts';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { TaxCenterPayload } from '@/lib/types/master-scope';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function TaxCenterClient() {
  const [data, setData] = useState<TaxCenterPayload | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch('/api/terminal/tax-center');
      const payload = await res.json();
      if (!cancelled) setData(payload);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <TerminalShell
      eyebrow="Tax intelligence"
      title="Tax and lot center"
      description="A dedicated tax surface with realized vs unrealized reporting, tax-lot review, harvesting candidates, and post-tax diagnostics — organized into multiple readable panels."
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Gain mix</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Realized vs unrealized by bucket</div>
              <div className="mt-4"><RealizedUnrealizedChart data={data.realizedVsUnrealized} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tax summary</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Current tax posture</div>
              <div className="mt-5 grid gap-3">
                {data.summary.map((item) => (
                  <div key={item.title} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-sm font-medium text-slate-500">{item.title}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{item.value}</div>
                    <div className="mt-2 text-sm text-slate-600">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 2xl:grid-cols-[1.22fr_0.78fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tax lots</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Lot review and harvest tags</div>
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    <tr><th className="pb-3">Security</th><th className="pb-3">Lot date</th><th className="pb-3">Qty</th><th className="pb-3">Cost basis</th><th className="pb-3">Current</th><th className="pb-3">Gain</th><th className="pb-3">Term</th><th className="pb-3">Harvest</th></tr>
                  </thead>
                  <tbody>
                    {data.lots.map((row) => (
                      <tr key={`${row.security}-${row.lotDate}`} className="border-t border-slate-100/90 text-slate-700">
                        <td className="py-4 font-semibold text-slate-950">{row.security}</td><td>{row.lotDate}</td><td>{row.quantity}</td><td>{row.costBasis}</td><td>{row.currentValue}</td><td className={row.gain.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}>{row.gain}</td><td>{row.term}</td><td>{row.harvest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid gap-6">
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tax buckets</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Estimated liability blocks</div>
                <div className="mt-5 space-y-3">
                  {data.taxes.map((item) => (
                    <div key={item.bucket} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-950">{item.bucket}</div>
                        <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">{item.rate}</div>
                      </div>
                      <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">{item.amount}</div>
                      <div className="mt-2 text-sm text-slate-600">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Harvest ideas</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Candidate actions</div>
                <div className="mt-5 space-y-3">
                  {data.harvesting.map((item) => (
                    <div key={item.security} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-base font-semibold text-slate-950">{item.security}</div>
                        <div className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600">{item.loss}</div>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">Wash-sale status: {item.washSale}</div>
                      <div className="mt-2 text-sm text-slate-500">{item.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : <div className={surface}>Loading tax center…</div>}
    </TerminalShell>
  );
}
