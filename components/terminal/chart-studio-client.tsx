'use client';

import { useEffect, useState } from 'react';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { AllocationChart, CashFlowChart, ExposureBarChart, PassiveIncomeChart, PerformanceChart } from '@/components/terminal/charts';
import { AllocationTreemapChart, DrawdownChart, RealizedUnrealizedChart } from '@/components/terminal/advanced-charts';
import { CorrelationHeatmap, DailyPnlBars, DebtPayoffChart, FunnelView, GoalProgressCards, IncomeCapitalSplit, RollingWithOneYear, RunwayChart, SankeyLike, SavingsRateTrend, WaterfallContribution } from '@/components/terminal/chart-studio-extras';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { ChartStudioPayload } from '@/lib/types/chart-studio';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

function heatTone(value: number) {
  if (value >= 2) return 'bg-emerald-100 text-emerald-700';
  if (value > 0) return 'bg-emerald-50 text-emerald-600';
  if (value === 0) return 'bg-slate-100 text-slate-500';
  if (value <= -1) return 'bg-rose-100 text-rose-700';
  return 'bg-rose-50 text-rose-600';
}

export function ChartStudioClient() {
  const [data, setData] = useState<ChartStudioPayload | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch('/api/terminal/chart-studio');
      const payload = await res.json();
      if (!cancelled) setData(payload);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <TerminalShell
      eyebrow="Master charts"
      title="Chart and graph studio"
      description="This page is focused on your original chart/graph list first: performance, allocation, risk, cash flow, debt, obligations, goals, funnel and flow visuals — each in separate premium cards."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Full chart coverage pass</div>}
    >
      {data ? (
        <div className="space-y-6">
          <KPIGrid items={data.hero} />

          <div className="grid gap-6 2xl:grid-cols-[1.12fr_0.88fr]">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Portfolio value over time</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Cumulative return vs benchmark</div><div className="mt-4"><PerformanceChart data={data.cumulative} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Rolling stack</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">1M · 3M · 6M · 1Y returns</div><div className="mt-4"><RollingWithOneYear data={data.rolling} /></div></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Daily P&L</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Daily gain/loss bars</div><div className="mt-4"><DailyPnlBars data={data.dailyPnl} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Income vs capital</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Return source split</div><div className="mt-4"><IncomeCapitalSplit data={data.incomeVsCapital} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Contribution waterfall</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Attribution bridge</div><div className="mt-4"><WaterfallContribution data={data.waterfall} /></div></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Drawdown</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Portfolio drawdown path</div><div className="mt-4"><DrawdownChart data={data.drawdown} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Monthly heatmap</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Return heat signature</div><div className="mt-5 overflow-x-auto"><div className="min-w-[760px] space-y-3">{data.heatmap.map((row)=><div key={row.year} className="grid grid-cols-[90px_repeat(12,minmax(0,1fr))] gap-2"><div className="flex items-center text-sm font-semibold text-slate-600">{row.year}</div>{row.months.map((cell)=><div key={`${row.year}-${cell.label}`} className={`rounded-2xl px-3 py-3 text-center text-sm font-medium ${heatTone(cell.value)}`}><div className="text-[11px] uppercase tracking-[0.18em] opacity-70">{cell.label}</div><div className="mt-1">{cell.value > 0 ? '+' : ''}{cell.value.toFixed(1)}%</div></div>)}</div>)}</div></div></div>
          </div>

          <div className="grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Realized vs unrealized</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Gain composition</div><div className="mt-4"><RealizedUnrealizedChart data={data.realizedVsUnrealized} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Asset allocation</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Treemap allocation</div><div className="mt-4"><AllocationTreemapChart data={data.assetAllocation} /></div></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Sector allocation</div><div className="mt-4"><ExposureBarChart data={data.sectorAllocation} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Geography allocation</div><div className="mt-4"><ExposureBarChart data={data.geographyAllocation} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Market-cap allocation</div><div className="mt-4"><ExposureBarChart data={data.marketCapAllocation} /></div></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Account allocation</div><div className="mt-4"><ExposureBarChart data={data.accountAllocation} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Strategy allocation</div><div className="mt-4"><ExposureBarChart data={data.strategyAllocation} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Top holdings concentration</div><div className="mt-4"><ExposureBarChart data={data.topHoldings} dataKey="value" labelKey="name" /></div></div>
          </div>

          <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Correlation heatmap</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Cross-holding relationship map</div><div className="mt-5"><CorrelationHeatmap labels={data.correlation.labels} matrix={data.correlation.matrix} /></div></div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Risk contribution</div><div className="mt-4"><ExposureBarChart data={data.riskContribution} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Beta exposure</div><div className="mt-4"><ExposureBarChart data={data.betaExposure} /></div></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Drawdown distribution</div><div className="mt-4"><ExposureBarChart data={data.drawdownDistribution} dataKey="value" labelKey="bucket" /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Scenario stress</div><div className="mt-4"><ExposureBarChart data={data.scenarioStress} /></div></div>
          </div>

          <div className="grid gap-6 2xl:grid-cols-[1.06fr_0.94fr]">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Income vs expense</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Monthly cash-flow view</div><div className="mt-4"><CashFlowChart data={data.monthlyIncomeExpense} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Income timeline</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Dividend / interest / rent</div><div className="mt-4"><PassiveIncomeChart data={data.dividendInterestTimeline} /></div></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Savings rate trend</div><div className="mt-4"><SavingsRateTrend data={data.savingsRate} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Cash runway</div><div className="mt-4"><RunwayChart data={data.cashRunway} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Emergency fund</div><div className="mt-4"><RunwayChart data={data.emergencyFund} /></div></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Debt payoff</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Liability reduction schedule</div><div className="mt-4"><DebtPayoffChart data={data.debtPayoff} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Upcoming obligations calendar</div><div className="mt-5 grid gap-3">{data.obligations.map((item)=><div key={item.title} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4"><div className="flex items-center justify-between gap-3"><div className="text-sm font-semibold text-slate-950">{item.title}</div><div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">{item.type}</div></div><div className="mt-2 text-sm text-slate-600">Due {item.due}</div><div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.amount}</div></div>)}</div></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Goal funding progress</div><div className="mt-5"><GoalProgressCards items={data.goals} /></div></div>
            <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Salary to investment funnel</div><div className="mt-4"><FunnelView data={data.funnel} /></div></div>
          </div>

          <div className={surface}><div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Flow map</div><div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Income → expenses → savings → investments</div><div className="mt-5"><SankeyLike data={data.sankey} /></div></div>
        </div>
      ) : <div className={surface}>Loading chart studio…</div>}
    </TerminalShell>
  );
}
