'use client';

import { useEffect, useState } from 'react';
import { DownloadCloud } from 'lucide-react';
import { AllocationChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { ReportsPayload } from '@/lib/types/terminal-intelligence';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function ReportsCenterClient() {
  const [data, setData] = useState<ReportsPayload | null>(null);

  useEffect(() => {
    fetch('/api/terminal/reports').then((res) => res.json()).then(setData).catch(() => null);
  }, []);

  return (
    <TerminalShell
      eyebrow="Reports center"
      title="Reporting and export studio"
      description="Premium export surface for executive packs, drift reports, planning statements, and scheduled delivery workflows — ready for a real backend reporting engine later."
      rightSlot={<div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]"><DownloadCloud size={15} /> Export and scheduling layer</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.kpis} />

          <div className="grid gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Report library</div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {data.library.map((item) => (
                  <div key={item.title} className="rounded-[26px] border border-slate-100 bg-slate-50/80 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.title}</div>
                      <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${item.status === 'Ready' ? 'bg-emerald-50 text-emerald-600' : item.status === 'Queued' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{item.status}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">{item.type}</div>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div className="rounded-2xl bg-white/88 px-4 py-3 text-slate-700"><span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Cadence</span>{item.cadence}</div>
                      <div className="rounded-2xl bg-white/88 px-4 py-3 text-slate-700"><span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Format</span>{item.format}</div>
                    </div>
                    <div className="mt-3 text-sm text-slate-500">Last run · {item.lastRun}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Usage mix</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Report categories</div>
                <div className="mt-4"><AllocationChart data={data.categories} /></div>
              </div>
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Notes</div>
                <div className="mt-4 space-y-3">
                  {data.notes.map((note) => (
                    <div key={note.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                      <div className="text-base font-semibold text-slate-950">{note.title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{note.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Recent exports</div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      {['Title', 'Requested', 'Range', 'Size', 'Status'].map((heading) => <th key={heading} className="pb-3 font-medium">{heading}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {data.exports.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100/90 text-slate-700">
                        <td className="py-4 font-semibold text-slate-950">{row.title}</td>
                        <td className="py-4">{row.requested}</td>
                        <td className="py-4">{row.range}</td>
                        <td className="py-4">{row.size}</td>
                        <td className="py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}`}>{row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Scheduled deliveries</div>
              <div className="mt-4 space-y-3">
                {data.scheduled.map((row) => (
                  <div key={row.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-base font-semibold text-slate-950">{row.title}</div>
                    <div className="mt-2 text-sm text-slate-500">{row.cadence}</div>
                    <div className="mt-2 text-sm text-slate-700">Next run · <span className="font-semibold text-slate-950">{row.nextRun}</span></div>
                    <div className="mt-2 text-sm text-slate-600">Recipients · {row.recipients}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={surface}>Loading reports center…</div>
      )}
    </TerminalShell>
  );
}
