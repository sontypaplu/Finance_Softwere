'use client';

import { useEffect, useState } from 'react';
import { Flag } from 'lucide-react';
import { AllocationChart, PerformanceChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { GoalsPayload } from '@/lib/types/terminal-intelligence';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function GoalsDashboardClient() {
  const [data, setData] = useState<GoalsPayload | null>(null);

  useEffect(() => {
    fetch('/api/terminal/goals').then((res) => res.json()).then(setData).catch(() => null);
  }, []);

  return (
    <TerminalShell
      eyebrow="Goals dashboard"
      title="Goal funding intelligence"
      description="Track long-term goals, funding progress, milestones, and the projected path of your financial plan in a premium planning workspace."
      rightSlot={<div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]"><Flag size={15} /> Goal engine surface</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-6 2xl:grid-cols-[1.14fr_0.86fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Funding curve</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Projected assets vs target corpus</div>
              <div className="mt-4"><PerformanceChart data={data.projection} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Goal mix</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Capital by goal bucket</div>
              <div className="mt-4"><AllocationChart data={data.buckets} /></div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Goal register</div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {data.goals.map((goal) => (
                  <div key={goal.title} className="rounded-[26px] border border-slate-100 bg-slate-50/80 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{goal.title}</div>
                      <div className="rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{goal.priority}</div>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <div>
                        <div className="text-sm text-slate-500">Current</div>
                        <div className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{goal.current}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">Target</div>
                        <div className="mt-1 text-lg font-semibold text-slate-950">{goal.target}</div>
                      </div>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200/70">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#4f46e5,#0f766e)]" style={{ width: `${goal.funded}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                      <span>{goal.funded}% funded</span>
                      <span>{goal.due}</span>
                    </div>
                    <div className="mt-3 rounded-2xl bg-white/86 px-4 py-3 text-sm text-slate-700">Monthly need: <span className="font-semibold text-slate-950">{goal.monthlyNeed}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Milestones</div>
                <div className="mt-4 space-y-3">
                  {data.milestones.map((item) => (
                    <div key={item.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-base font-semibold text-slate-950">{item.title}</div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">{item.status}</div>
                      </div>
                      <div className="mt-2 text-sm text-slate-500">Due {item.due}</div>
                      <div className="mt-1 text-lg font-semibold text-slate-950">{item.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Planning insights</div>
                <div className="mt-4 space-y-3">
                  {data.insights.map((item) => (
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
        <div className={surface}>Loading goals dashboard…</div>
      )}
    </TerminalShell>
  );
}
