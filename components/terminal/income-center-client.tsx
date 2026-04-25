'use client';

import { useEffect, useState } from 'react';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { AllocationChart, CashFlowChart, PassiveIncomeChart } from '@/components/terminal/charts';
import { FreeCashFlowLine } from '@/components/terminal/advanced-charts';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { IncomeCenterPayload } from '@/lib/types/master-scope';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function IncomeCenterClient() {
  const [data, setData] = useState<IncomeCenterPayload | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch('/api/terminal/income-center');
      const payload = await res.json();
      if (!cancelled) setData(payload);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <TerminalShell
      eyebrow="Cash flow & income"
      title="Income and cash-flow center"
      description="A premium personal-finance layer for savings rate, passive income growth, liability oversight, obligations, and deployable surplus — broken into clear analytical tiles."
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />
          <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Cash movement</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Monthly income, expenses, investment deployment</div>
              <div className="mt-4"><CashFlowChart data={data.monthlyFlow} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Passive income engine</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Dividends, interest, rent</div>
              <div className="mt-4"><PassiveIncomeChart data={data.passiveMix} /></div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Source split</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Income composition</div>
              <div className="mt-4"><AllocationChart data={data.incomeSources} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Liquidity curve</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Free cash flow trend</div>
              <div className="mt-4"><FreeCashFlowLine data={data.freeCashflow} /></div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {data.obligations.map((item) => (
                  <div key={item.title} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-600">Due {item.due}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">{item.type}</span>
                      <span className="text-base font-semibold text-slate-950">{item.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 2xl:grid-cols-[1.12fr_0.88fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Liabilities</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Debt schedule and coverage</div>
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    <tr><th className="pb-3">Lender</th><th className="pb-3">Outstanding</th><th className="pb-3">Rate</th><th className="pb-3">EMI</th><th className="pb-3">Tenure</th><th className="pb-3">Coverage</th></tr>
                  </thead>
                  <tbody>
                    {data.liabilities.map((row) => (
                      <tr key={row.lender} className="border-t border-slate-100/90 text-slate-700">
                        <td className="py-4 font-semibold text-slate-950">{row.lender}</td><td>{row.outstanding}</td><td>{row.rate}</td><td>{row.emi}</td><td>{row.tenure}</td><td>{row.coverage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Upcoming obligations</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Cash call board</div>
              <div className="mt-5 space-y-3">
                {data.obligations.map((item) => (
                  <div key={`${item.title}-${item.due}`} className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-100 bg-slate-50/80 px-4 py-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.type} · {item.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">{item.due}</div>
                      <div className="mt-1 text-base font-semibold text-slate-950">{item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : <div className={surface}>Loading income center…</div>}
    </TerminalShell>
  );
}
