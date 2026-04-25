'use client';

import { useEffect, useMemo, useState } from 'react';
import { Filter, LayoutPanelTop, PanelRightOpen, SlidersHorizontal } from 'lucide-react';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { DeepTablesPayload } from '@/lib/types/deep-tables';
import type { AssetDetailPayload } from '@/lib/types/terminal-ops';

type HoldingsView = 'overview' | 'performance' | 'risk' | 'income' | 'tax';
type OpsView = 'ledger' | 'lots' | 'risk' | 'cashflow' | 'liabilities' | 'alerts';
type Density = 'comfortable' | 'compact';
type RatioGroupMode = string;

type CellRow = { key: string; values: string[]; raw?: Record<string, string> };

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';
const softBlue = 'border-sky-100/80 bg-[linear-gradient(180deg,rgba(248,251,255,0.98),rgba(255,255,255,0.92))]';
const softEmerald = 'border-emerald-100/80 bg-[linear-gradient(180deg,rgba(247,255,251,0.98),rgba(255,255,255,0.92))]';
const softAmber = 'border-amber-100/80 bg-[linear-gradient(180deg,rgba(255,252,246,0.98),rgba(255,255,255,0.92))]';
const softRose = 'border-rose-100/80 bg-[linear-gradient(180deg,rgba(255,249,250,0.98),rgba(255,255,255,0.92))]';

function PillTabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { id: T; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = value === item.id;
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

function ScreenFitTable({ headers, rows, density = 'comfortable', onSelect, selectedKey }: { headers: string[]; rows: CellRow[]; density?: Density; onSelect?: (row: CellRow) => void; selectedKey?: string }) {
  return (
    <div className="mt-5 overflow-hidden rounded-[24px] border border-white/70 bg-white/88">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.24em] text-slate-400">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const active = selectedKey === row.key;
            return (
              <tr
                key={row.key}
                onClick={() => onSelect?.(row)}
                className={`border-t border-slate-100/90 text-slate-700 ${onSelect ? 'cursor-pointer' : ''} ${active ? 'bg-slate-50/90' : 'hover:bg-slate-50/50'}`}
              >
                {row.values.map((value, index) => (
                  <td key={`${row.key}-${index}`} className={`px-4 ${density === 'compact' ? 'py-3' : 'py-4'} align-top`}>
                    <div className={`truncate ${index === 0 ? 'font-semibold text-slate-950' : ''}`}>{value}</div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MetricCard({ label, value, benchmark, note }: { label: string; value: string; benchmark?: string; note?: string }) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/92 p-4">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{value}</div>
      {benchmark ? <div className="mt-2 text-sm text-slate-600">Ref: {benchmark}</div> : null}
      {note ? <div className="mt-2 text-sm text-slate-500">{note}</div> : null}
    </div>
  );
}

function InfoCard({ title, value, detail, tone = 'slate' }: { title: string; value: string; detail: string; tone?: 'slate' | 'emerald' | 'rose' | 'amber' }) {
  const toneClass = tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : tone === 'rose' ? 'bg-rose-50 text-rose-700' : tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700';
  return (
    <div className="rounded-[22px] border border-white/70 bg-white/88 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{value}</div>
      <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${toneClass}`}>{detail}</div>
    </div>
  );
}

export function DeepTablesClient() {
  const [data, setData] = useState<DeepTablesPayload | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetDetailPayload | null>(null);
  const [holdingsView, setHoldingsView] = useState<HoldingsView>('overview');
  const [opsView, setOpsView] = useState<OpsView>('ledger');
  const [density, setDensity] = useState<Density>('comfortable');
  const [selectedHoldingKey, setSelectedHoldingKey] = useState('');
  const [selectedOpsKey, setSelectedOpsKey] = useState('');
  const [selectedSecurity, setSelectedSecurity] = useState('');
  const [ratioGroup, setRatioGroup] = useState<RatioGroupMode>('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch('/api/terminal/deep-tables');
      const payload = await res.json();
      if (!cancelled) {
        setData(payload);
        const firstKey = `${payload.holdingsMaster[0]?.instrument}-${payload.holdingsMaster[0]?.account}`;
        const firstSymbol = payload.holdingsMaster[0]?.instrument || 'NVDA';
        setSelectedHoldingKey(firstKey);
        setSelectedSecurity(firstSymbol);
        setSelectedOpsKey(`ledger-${payload.transactionLedger[0]?.date}-${payload.transactionLedger[0]?.symbol}`);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedSecurity) return;
    let cancelled = false;
    async function loadAsset() {
      const res = await fetch(`/api/terminal/assets/${selectedSecurity}`);
      const payload = await res.json();
      if (!cancelled) {
        setSelectedAsset(payload);
        setRatioGroup(payload.ratioGroups?.[0]?.title || '');
      }
    }
    loadAsset();
    return () => { cancelled = true; };
  }, [selectedSecurity]);

  const holdingsTable = useMemo(() => {
    if (!data) return { headers: [], rows: [] as CellRow[] };
    switch (holdingsView) {
      case 'performance':
        return { headers: ['Security', 'Day %', 'Total Return', 'Contribution', 'Market Value'], rows: data.holdingsMaster.map((r) => ({ key: `${r.instrument}-${r.account}`, values: [r.instrument, r.dayChangePct, r.totalReturn, r.contributionReturn, r.marketValue], raw: r })) };
      case 'risk':
        return { headers: ['Security', 'Beta', 'Volatility', 'Sharpe', 'Max DD'], rows: data.holdingsMaster.map((r) => ({ key: `${r.instrument}-${r.account}`, values: [r.instrument, r.beta, r.volatility, r.sharpe, r.maxDrawdown], raw: r })) };
      case 'income':
        return { headers: ['Security', 'Div Yield', 'Yield on Cost', 'Tax Status', 'Weight'], rows: data.holdingsMaster.map((r) => ({ key: `${r.instrument}-${r.account}`, values: [r.instrument, r.dividendYield, r.yieldOnCost, r.taxStatus, r.weight], raw: r })) };
      case 'tax':
        return { headers: ['Security', 'Rebalance Gap', 'Tax Status', 'Concentration', 'Stale'], rows: data.holdingsMaster.map((r) => ({ key: `${r.instrument}-${r.account}`, values: [r.instrument, r.rebalanceGap, r.taxStatus, r.concentration, r.stalePrice], raw: r })) };
      default:
        return { headers: ['Security', 'Account', 'Weight', 'Market Value', 'Return'], rows: data.holdingsMaster.map((r) => ({ key: `${r.instrument}-${r.account}`, values: [r.instrument, r.account, r.weight, r.marketValue, r.totalReturn], raw: r })) };
    }
  }, [data, holdingsView]);

  const opsTable = useMemo(() => {
    if (!data) return { headers: [], rows: [] as CellRow[] };
    switch (opsView) {
      case 'lots':
        return { headers: ['Security', 'Lot Date', 'Holding Period', 'Gain', 'Harvest'], rows: data.taxLots.map((r) => ({ key: `lot-${r.security}-${r.lotDate}`, values: [r.security, r.lotDate, r.holdingPeriod, r.unrealizedGain, r.harvestFlag], raw: r as unknown as Record<string, string> })) };
      case 'risk':
        return { headers: ['Sleeve', 'Vol', 'VaR', 'Alpha', 'Recovery'], rows: data.riskTable.map((r) => ({ key: `risk-${r.sleeve}`, values: [r.sleeve, r.volatility, r.var95, r.alpha, r.recoveryTime], raw: r as unknown as Record<string, string> })) };
      case 'cashflow':
        return { headers: ['Month', 'Income Mix', 'Expenses', 'Savings', 'Deploy'], rows: data.cashflowIncome.map((r) => ({ key: `cf-${r.month}`, values: [r.month, `${r.salary} + ${r.business}`, `${r.fixedExpenses} / ${r.variableExpenses}`, r.monthlySavings, r.deploymentRate], raw: r as unknown as Record<string, string> })) };
      case 'liabilities':
        return { headers: ['Lender', 'Outstanding', 'EMI', 'Tenure', 'Coverage'], rows: data.liabilities.map((r) => ({ key: `liab-${r.lender}`, values: [r.lender, r.principalOutstanding, r.emi, r.tenureLeft, r.debtServiceRatio], raw: r as unknown as Record<string, string> })) };
      case 'alerts':
        return { headers: ['Type', 'Title', 'Severity', 'Action', 'Detail'], rows: data.alerts.map((r, i) => ({ key: `alert-${i}`, values: [r.type, r.title, r.severity, r.action, r.detail], raw: r as unknown as Record<string, string> })) };
      default:
        return { headers: ['Date', 'Symbol', 'Type', 'Amount Clues', 'Notes'], rows: data.transactionLedger.map((r) => ({ key: `ledger-${r.date}-${r.symbol}`, values: [r.date, r.symbol, r.txnType, `${r.executionPrice} · ${r.fees}`, r.notes], raw: r as unknown as Record<string, string> })) };
    }
  }, [data, opsView]);

  const selectedHolding = useMemo(() => data?.holdingsMaster.find((r) => `${r.instrument}-${r.account}` === selectedHoldingKey) ?? data?.holdingsMaster[0], [data, selectedHoldingKey]);
  const selectedOps = useMemo(() => opsTable.rows.find((r) => r.key === selectedOpsKey) ?? opsTable.rows[0], [opsTable, selectedOpsKey]);
  const activeRatioGroup = useMemo(() => selectedAsset?.ratioGroups.find((group) => group.title === ratioGroup) ?? selectedAsset?.ratioGroups[0], [selectedAsset, ratioGroup]);
  const securityOptions = useMemo(() => Array.from(new Set((data?.holdingsMaster || []).map((row) => row.instrument))), [data]);

  useEffect(() => {
    if (selectedHolding?.instrument && selectedHolding.instrument !== selectedSecurity) setSelectedSecurity(selectedHolding.instrument);
  }, [selectedHolding?.instrument, selectedSecurity]);

  useEffect(() => {
    if (!data || !selectedSecurity) return;
    const match = data.holdingsMaster.find((row) => row.instrument === selectedSecurity);
    if (match) setSelectedHoldingKey(`${match.instrument}-${match.account}`);
  }, [data, selectedSecurity]);

  if (!data) {
    return (
      <TerminalShell eyebrow="Deep tables" title="Loading deep-table center" description="Preparing clean screen-fit analytical tables.">
        <div className={surface}>Loading…</div>
      </TerminalShell>
    );
  }

  return (
    <TerminalShell
      eyebrow="Deep table center"
      title="Controlled analytics tables"
      description="Portfolio tables stay screen-fit, while the right-side analysis area now focuses on single-security metrics with category buttons for security-level plus both-level ratios calculated at the security view."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Security analysis active</div>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto_auto]">
          <div className="rounded-[28px] border border-white/55 bg-white/76 p-4 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5"><LayoutPanelTop size={14} /> 2-table view</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5"><Filter size={14} /> Category buttons</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5"><PanelRightOpen size={14} /> Single-security analysis</span>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/55 bg-white/76 p-3 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
            <PillTabs value={density} onChange={setDensity} items={[{ id: 'comfortable', label: 'Comfortable' }, { id: 'compact', label: 'Compact' }]} />
          </div>
          <div className="rounded-[28px] border border-white/55 bg-white/76 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl text-sm text-slate-600">
            <label className="flex items-center gap-3">
              <span className="whitespace-nowrap">Analyze security</span>
              <select value={selectedSecurity} onChange={(e) => setSelectedSecurity(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none">
                {securityOptions.map((symbol) => <option key={symbol} value={symbol}>{symbol}</option>)}
              </select>
            </label>
          </div>
          <div className="rounded-[28px] border border-white/55 bg-white/76 p-3 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl text-sm text-slate-600">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2"><SlidersHorizontal size={14} /> More controls next</div>
          </div>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1.05fr_1.05fr_0.9fr]">
          <div className={`${surface} ${softBlue}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Holdings view</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Primary holdings table</div>
              </div>
              <PillTabs value={holdingsView} onChange={setHoldingsView} items={[
                { id: 'overview', label: 'Overview' },
                { id: 'performance', label: 'Performance' },
                { id: 'risk', label: 'Risk' },
                { id: 'income', label: 'Income' },
                { id: 'tax', label: 'Tax / Rebalance' }
              ]} />
            </div>
            <ScreenFitTable headers={holdingsTable.headers} rows={holdingsTable.rows} density={density} onSelect={(row) => setSelectedHoldingKey(row.key)} selectedKey={selectedHoldingKey} />
          </div>

          <div className={`${surface} ${softEmerald}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Operations view</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Secondary table library</div>
              </div>
              <PillTabs value={opsView} onChange={setOpsView} items={[
                { id: 'ledger', label: 'Ledger' },
                { id: 'lots', label: 'Lots' },
                { id: 'risk', label: 'Risk' },
                { id: 'cashflow', label: 'Cashflow' },
                { id: 'liabilities', label: 'Debt' },
                { id: 'alerts', label: 'Alerts' }
              ]} />
            </div>
            <ScreenFitTable headers={opsTable.headers} rows={opsTable.rows} density={density} onSelect={(row) => setSelectedOpsKey(row.key)} selectedKey={selectedOpsKey} />
          </div>

          <div className={`${surface} ${softAmber}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Single-security control</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{selectedAsset?.symbol || selectedSecurity}</div>
            {selectedHolding ? (
              <div className="mt-5 space-y-3">
                <InfoCard title="Selected security" value={selectedHolding.instrument} detail={`${selectedHolding.account} · ${selectedHolding.assetClass}`} />
                <InfoCard title="Total return" value={selectedHolding.totalReturn} detail={`Weight ${selectedHolding.weight}`} tone="emerald" />
                <InfoCard title="Current focus" value={holdingsView === 'tax' ? selectedHolding.rebalanceGap : holdingsView === 'income' ? selectedHolding.dividendYield : holdingsView === 'risk' ? selectedHolding.volatility : selectedHolding.totalReturn} detail={holdingsView === 'tax' ? 'Rebalance gap' : holdingsView === 'income' ? 'Dividend yield' : holdingsView === 'risk' ? 'Volatility' : 'Total return'} tone={holdingsView === 'tax' && selectedHolding.rebalanceGap.startsWith('+') ? 'rose' : 'amber'} />
                <div className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Selected secondary row</div>
                  <div className="mt-3 text-sm leading-6 text-slate-600">{selectedOps?.values.join(' · ')}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className={`${surface} ${softRose}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Security ratio analysis</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Security-level + both-level ratios for {selectedAsset?.symbol || selectedSecurity}</div>
            </div>
            {selectedAsset ? (
              <PillTabs value={activeRatioGroup?.title || ratioGroup} onChange={(v) => setRatioGroup(v)} items={selectedAsset.ratioGroups.map((group) => ({ id: group.title, label: group.title }))} />
            ) : null}
          </div>
          {activeRatioGroup ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {activeRatioGroup.items.map((item) => (
                <MetricCard key={`${activeRatioGroup.title}-${item.label}`} label={item.label} value={item.value} benchmark={item.benchmark} note={item.note} />
              ))}
            </div>
          ) : <div className="mt-5 text-sm text-slate-500">Loading ratio groups…</div>}
        </div>
      </div>
    </TerminalShell>
  );
}
