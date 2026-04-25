'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Clock3 } from 'lucide-react';
import { ExposureBarChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { CalendarPayload } from '@/lib/types/terminal-intelligence';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

const typeTone = {
  earnings: 'bg-indigo-50 text-indigo-600',
  dividend: 'bg-emerald-50 text-emerald-600',
  obligation: 'bg-amber-50 text-amber-700',
  macro: 'bg-slate-100 text-slate-600'
} as const;

export function EventsCalendarClient() {
  const [data, setData] = useState<CalendarPayload | null>(null);

  useEffect(() => {
    fetch('/api/terminal/calendar').then((res) => res.json()).then(setData).catch(() => null);
  }, []);

  return (
    <TerminalShell
      eyebrow="Events calendar"
      title="Earnings, dividends, and obligations"
      description="Terminal-style event layer covering earnings, dividend receipts, macro catalysts, and personal finance obligations in one premium calendar surface."
      rightSlot={<div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]"><CalendarDays size={15} /> Daily event command layer</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-6 2xl:grid-cols-[1.12fr_0.88fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Timeline</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Upcoming event stack</div>
              <div className="mt-5 space-y-4">
                {data.timeline.map((block) => (
                  <div key={block.day} className="rounded-[28px] border border-slate-100 bg-slate-50/75 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-slate-950">{block.day}</div>
                        <div className="mt-1 text-sm text-slate-500">{block.date}</div>
                      </div>
                      <div className="rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{block.items.length} events</div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {block.items.map((item) => (
                        <div key={`${block.day}-${item.time}-${item.title}`} className="grid gap-3 rounded-[22px] border border-white/80 bg-white/88 px-4 py-4 lg:grid-cols-[90px_108px_1fr_110px] lg:items-center">
                          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500"><Clock3 size={14} /> {item.time}</div>
                          <div className={`inline-flex justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${typeTone[item.type]}`}>{item.type}</div>
                          <div>
                            <div className="text-base font-semibold text-slate-950">{item.title}</div>
                            <div className="mt-1 text-sm text-slate-500">{item.detail}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-slate-950">{item.value}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{item.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Event mix</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">This-week distribution</div>
                <div className="mt-4"><ExposureBarChart data={data.distribution} /></div>
              </div>
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Earnings board</div>
                <div className="mt-4 space-y-3">
                  {data.earnings.map((item) => (
                    <div key={item.symbol} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-base font-semibold text-slate-950">{item.symbol} · {item.name}</div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.when}</div>
                      </div>
                      <div className="mt-2 text-sm text-slate-500">{item.focus}</div>
                      <div className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{item.estimate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Dividend calendar</div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      {['Security', 'Ex-date', 'Payable', 'Amount', 'Note'].map((heading) => <th key={heading} className="pb-3 font-medium">{heading}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {data.dividends.map((row) => (
                      <tr key={`${row.security}-${row.exDate}`} className="border-t border-slate-100/90 text-slate-700">
                        <td className="py-4 font-semibold text-slate-950">{row.security}</td>
                        <td className="py-4">{row.exDate}</td>
                        <td className="py-4">{row.payable}</td>
                        <td className="py-4 font-semibold text-slate-950">{row.amount}</td>
                        <td className="py-4">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Obligations</div>
              <div className="mt-4 space-y-3">
                {data.obligations.map((row) => (
                  <div key={row.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-slate-950">{row.title}</div>
                      <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{row.status}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">Due {row.due}</div>
                    <div className="mt-1 text-lg font-semibold text-slate-950">{row.amount}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{row.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={surface}>Loading calendar and event surfaces…</div>
      )}
    </TerminalShell>
  );
}
