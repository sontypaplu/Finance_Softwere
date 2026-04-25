'use client';

import { useEffect, useMemo, useState } from 'react';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { ExposureBarChart } from '@/components/terminal/charts';
import { RadarScoreChart, RiskReturnScatterChart } from '@/components/terminal/advanced-charts';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { RatioCenterPayload } from '@/lib/types/master-scope';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

type GroupMode = 'all' | string;

function PillTabs({ value, onChange, items }: { value: GroupMode; onChange: (value: GroupMode) => void; items: { id: GroupMode; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? 'bg-slate-950 text-white shadow-[0_10px_30px_rgba(15,23,40,0.18)]' : 'border border-white/70 bg-white/80 text-slate-600 hover:bg-white'}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, benchmark, note }: { label: string; value: string; benchmark?: string; note?: string }) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{value}</div>
      {benchmark ? <div className="mt-2 text-sm text-slate-600">Reference: {benchmark}</div> : null}
      {note ? <div className="mt-2 text-sm text-slate-500">{note}</div> : null}
    </div>
  );
}

export function RatioCenterClient() {
  const [data, setData] = useState<RatioCenterPayload | null>(null);
  const [activeGroup, setActiveGroup] = useState<GroupMode>('all');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch('/api/terminal/ratio-center');
      const payload = await res.json();
      if (!cancelled) setData(payload);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const displayedGroups = useMemo(() => {
    if (!data) return [];
    if (activeGroup === 'all') return data.groups;
    return data.groups.filter((group) => group.title === activeGroup);
  }, [data, activeGroup]);

  return (
    <TerminalShell
      eyebrow="Ratio center"
      title="Ratios and metrics atlas"
      description="This page now focuses only on portfolio-level and both-level metrics. Every ratio group is selectable, and each metric is shown as a readable KPI-style card instead of one giant grid."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Portfolio + both-level metrics</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.hero} />

          <div className={surface}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Metric categories</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Select which ratio category to review</div>
              </div>
              <PillTabs
                value={activeGroup}
                onChange={setActiveGroup}
                items={[
                  { id: 'all', label: 'All' },
                  ...data.groups.map((group) => ({ id: group.title, label: group.title.replace(' metrics', '').replace(' ratios', '') }))
                ]}
              />
            </div>
          </div>

          <div className="grid gap-6">
            {displayedGroups.map((group) => (
              <div key={group.title} className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{group.title}</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {group.items.map((item) => (
                    <MetricCard key={`${group.title}-${item.label}`} label={item.label} value={item.value} benchmark={item.benchmark} note={item.note} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Quality radar</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Portfolio vs benchmark profile</div>
              <div className="mt-4"><RadarScoreChart data={data.radar} /></div>
            </div>
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Risk-return map</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Holdings opportunity quadrant</div>
              <div className="mt-4"><RiskReturnScatterChart data={data.scatter} /></div>
            </div>
          </div>

          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Factor mix</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Style exposure</div>
            <div className="mt-4"><ExposureBarChart data={data.factorExposure} /></div>
          </div>
        </div>
      ) : <div className={surface}>Loading ratio center…</div>}
    </TerminalShell>
  );
}
