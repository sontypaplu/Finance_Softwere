'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, GitCompareArrows, Search } from 'lucide-react';
import { AllocationChart, PerformanceChart } from '@/components/terminal/charts';
import { KPIGrid } from '@/components/terminal/kpi-grid';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { AssetDetailPayload } from '@/lib/types/terminal-ops';
import type { DeepTablesPayload } from '@/lib/types/deep-tables';

type RatioTab = 'return' | 'risk' | 'income' | 'tax';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';
const softBlue = 'border-sky-100/80 bg-[linear-gradient(180deg,rgba(248,251,255,0.98),rgba(255,255,255,0.92))]';
const softEmerald = 'border-emerald-100/80 bg-[linear-gradient(180deg,rgba(247,255,251,0.98),rgba(255,255,255,0.92))]';
const softAmber = 'border-amber-100/80 bg-[linear-gradient(180deg,rgba(255,252,246,0.98),rgba(255,255,255,0.92))]';

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

export function SecurityDrilldownClient() {
  const [assetSymbol, setAssetSymbol] = useState('NVDA');
  const [ratioTab, setRatioTab] = useState<RatioTab>('return');
  const [asset, setAsset] = useState<AssetDetailPayload | null>(null);
  const [deepTables, setDeepTables] = useState<DeepTablesPayload | null>(null);

  useEffect(() => {
    fetch(`/api/terminal/assets/${assetSymbol}`).then((res) => res.json()).then(setAsset).catch(() => null);
  }, [assetSymbol]);

  useEffect(() => {
    fetch('/api/terminal/deep-tables').then((res) => res.json()).then(setDeepTables).catch(() => null);
  }, []);

  const normalizedCurve = useMemo(() => {
    if (!asset?.priceHistory?.length) return [];
    const basePrice = asset.priceHistory[0].price || 1;
    const baseBenchmark = asset.priceHistory[0].benchmark || 1;
    return asset.priceHistory.map((row) => ({
      month: row.month,
      portfolio: Number(((row.price / basePrice) * 100).toFixed(2)),
      benchmark: Number(((row.benchmark / baseBenchmark) * 100).toFixed(2))
    }));
  }, [asset]);

  const selectedRatioGroup = useMemo(() => {
    if (!asset) return null;
    const titleMap: Record<RatioTab, string[]> = {
      return: ['Return metrics'],
      risk: ['Risk metrics', 'Risk-adjusted'],
      income: ['Income / yield / contribution'],
      tax: ['Tax / portfolio role']
    };
    return asset.ratioGroups.filter((group) => titleMap[ratioTab].includes(group.title));
  }, [asset, ratioTab]);

  const selectedLots = useMemo(() => deepTables?.taxLots.filter((lot) => lot.security.toUpperCase().includes(assetSymbol.toUpperCase())) ?? [], [deepTables, assetSymbol]);
  const selectedHolding = useMemo(() => deepTables?.holdingsMaster.find((row) => row.instrument.toUpperCase() === assetSymbol.toUpperCase()), [deepTables, assetSymbol]);

  if (!asset) {
    return <TerminalShell eyebrow="Security drill-down" title="Loading drill-down" description="Preparing single-asset control surface."><div className={surface}>Loading…</div></TerminalShell>;
  }

  const assets = [
    { symbol: 'NVDA', label: 'NVIDIA Corp.' },
    { symbol: 'AAPL', label: 'Apple Inc.' },
    { symbol: 'HDFCBANK', label: 'HDFC Bank' }
  ];

  return (
    <TerminalShell
      eyebrow="Security drill-down"
      title="Single-asset intelligence lab"
      description="Now rebuilt with a proper asset selector, focused ratio tabs, selected-asset tables, and softer differentiated panels so you can control one security at a time."
      rightSlot={<div className="rounded-full border border-white/55 bg-white/78 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]">Selected asset: {asset.symbol}</div>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto]">
          <div className="rounded-[28px] border border-white/55 bg-white/76 p-4 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700"><Search size={14} /> Single asset selector</div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700"><GitCompareArrows size={14} /> Compare mode later</div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/55 bg-white/76 p-3 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
            <label className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700">
              Asset
              <select value={assetSymbol} onChange={(e) => setAssetSymbol(e.target.value)} className="bg-transparent outline-none">
                {assets.map((item) => <option key={item.symbol} value={item.symbol}>{item.symbol} · {item.label}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
          <div className="rounded-[28px] border border-white/55 bg-white/76 p-3 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
            <PillTabs value={ratioTab} onChange={setRatioTab} items={[{ id: 'return', label: 'Return' }, { id: 'risk', label: 'Risk' }, { id: 'income', label: 'Income' }, { id: 'tax', label: 'Tax / Role' }]} />
          </div>
        </div>

        <KPIGrid items={asset.stats.map((item) => ({ label: item.label, value: item.value, change: item.change || '', tone: item.tone || 'flat' }))} />

        <div className="grid gap-6 2xl:grid-cols-[1.12fr_0.88fr]">
          <div className={`${surface} ${softBlue}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Normalized performance</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Selected security vs benchmark</div>
            <div className="mt-4"><PerformanceChart data={normalizedCurve} /></div>
          </div>
          <div className={`${surface} ${softEmerald}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Exposure role</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Where this asset sits in portfolio</div>
            <div className="mt-4"><AllocationChart data={asset.exposure} /></div>
            <div className="mt-4 flex flex-wrap gap-2">
              {asset.tags.map((tag) => <div key={tag} className="rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700">{tag}</div>)}
            </div>
          </div>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1.12fr_0.88fr]">
          <div className={`${surface} ${softAmber}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Ratio center</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Selected ratio group only</div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {selectedRatioGroup?.flatMap((group) => group.items).map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                  <div className="text-sm font-medium text-slate-500">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{item.value}</div>
                  {item.benchmark ? <div className="mt-2 text-sm text-slate-600">Ref: {item.benchmark}</div> : null}
                  {item.note ? <div className="mt-2 text-sm text-slate-500">{item.note}</div> : null}
                </div>
              ))}
            </div>
          </div>
          <div className={`${surface} ${softBlue}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Selected asset controls</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Quick reference panel</div>
            <div className="mt-5 space-y-3">
              <div className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                <div className="text-sm font-medium text-slate-500">Description</div>
                <div className="mt-2 text-sm leading-6 text-slate-700">{asset.description}</div>
              </div>
              <div className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                <div className="text-sm font-medium text-slate-500">Holding status</div>
                <div className="mt-2 text-base font-semibold text-slate-950">{selectedHolding ? `${selectedHolding.marketValue} · ${selectedHolding.weight}` : 'Not in holdings snapshot'}</div>
                <div className="mt-2 text-sm text-slate-600">{selectedHolding ? `Rebalance gap ${selectedHolding.rebalanceGap} · Tax status ${selectedHolding.taxStatus}` : 'No holding details available.'}</div>
              </div>
              <div className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                <div className="text-sm font-medium text-slate-500">Next phase controls</div>
                <div className="mt-2 text-sm text-slate-600">Compare two securities, benchmark selector, date-range control, and saved views can plug into this layout without redesign.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className={`${surface} ${softBlue}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Transactions</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Selected asset ledger</div>
            <div className="mt-5 overflow-hidden rounded-[24px] border border-white/70 bg-white/88">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  <tr>{['Date','Type','Account','Qty','Amount'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {asset.trades.map((trade) => (
                    <tr key={`${trade.date}-${trade.type}`} className="border-t border-slate-100/90 text-slate-700 hover:bg-slate-50/50">
                      <td className="px-4 py-4">{trade.date}</td>
                      <td className="px-4 py-4 font-semibold text-slate-950">{trade.type}</td>
                      <td className="px-4 py-4">{trade.account}</td>
                      <td className="px-4 py-4">{trade.quantity}</td>
                      <td className="px-4 py-4">{trade.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={`${surface} ${softEmerald}`}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tax lots</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Selected asset lots</div>
            <div className="mt-5 overflow-hidden rounded-[24px] border border-white/70 bg-white/88">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  <tr>{['Lot date','Qty','Current','Gain','Harvest'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {(selectedLots.length ? selectedLots : [{ lotDate: '—', quantityRemaining: '—', currentValue: '—', unrealizedGain: '—', harvestFlag: 'No lots found' } as any]).map((lot, i) => (
                    <tr key={`${lot.lotDate}-${i}`} className="border-t border-slate-100/90 text-slate-700 hover:bg-slate-50/50">
                      <td className="px-4 py-4">{lot.lotDate}</td>
                      <td className="px-4 py-4">{lot.quantityRemaining}</td>
                      <td className="px-4 py-4">{lot.currentValue}</td>
                      <td className="px-4 py-4">{lot.unrealizedGain}</td>
                      <td className="px-4 py-4">{lot.harvestFlag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </TerminalShell>
  );
}
