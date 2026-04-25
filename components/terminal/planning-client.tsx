'use client';

import { useEffect, useState } from 'react';
import { CashFlowChart, PassiveIncomeChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { PlanningPayload } from '@/lib/types/terminal-pages';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function PlanningClient() {
  const [data, setData] = useState<PlanningPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch('/api/terminal/planning');
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
      eyebrow="Cash flow & planning"
      title="Cash intelligence and planning"
      description="Monitor savings quality, passive income progress, liabilities, obligations, and goal funding from a premium planning surface."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Personal finance engine-ready</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Cash flow panel</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Income, expenses, deployment</div>
              <div className="mt-4"><CashFlowChart data={data.cashflow} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Upcoming obligations</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Near-term calendar</div>
              <div className="mt-5 space-y-3">
                {data.upcoming.map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-[24px] border border-slate-100 bg-slate-50/80 px-4 py-4">
                    <div>
                      <div className="text-base font-semibold text-slate-950">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-500">Due {item.due}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-semibold text-slate-950">{item.amount}</div>
                      <div className="mt-1 text-sm text-slate-500">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Goal funding</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Strategic targets</div>
              <div className="mt-5 space-y-4">
                {data.goals.map((goal) => (
                  <div key={goal.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-slate-950">{goal.title}</div>
                        <div className="mt-1 text-sm text-slate-500">Target {goal.target} · Due {goal.due}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-semibold text-slate-950">{goal.current}</div>
                        <div className="mt-1 text-sm text-slate-500">{goal.funded}% funded</div>
                      </div>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#4f46e5_0%,#0f766e_100%)]" style={{ width: `${goal.funded}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Passive income</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Income stack</div>
              <div className="mt-4"><PassiveIncomeChart data={data.passiveIncome} /></div>
            </div>
          </div>

          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Liability ledger</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Debt schedule</div>
            <div className="mt-5 overflow-x-auto hide-scrollbar">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    <th className="pb-3 pr-4">Lender</th>
                    <th className="pb-3 pr-4">Outstanding</th>
                    <th className="pb-3 pr-4">Rate</th>
                    <th className="pb-3 pr-4">EMI</th>
                    <th className="pb-3">Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  {data.liabilities.map((row) => (
                    <tr key={row.lender} className="border-t border-slate-100 text-sm text-slate-700">
                      <td className="py-4 pr-4 font-semibold text-slate-950">{row.lender}</td>
                      <td className="py-4 pr-4">{row.outstanding}</td>
                      <td className="py-4 pr-4">{row.rate}</td>
                      <td className="py-4 pr-4">{row.emi}</td>
                      <td className="py-4 font-medium text-slate-950">{row.tenure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className={surface}>Loading planning workspace…</div>
      )}
    </TerminalShell>
  );
}
