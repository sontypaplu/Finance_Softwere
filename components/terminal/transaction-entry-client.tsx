'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FileStack, Plus, Sparkles, X } from 'lucide-react';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { NewSecurityInput, SecurityOption } from '@/lib/types/terminal-ops';
import { usePortfolioWorkspace } from '@/components/terminal/portfolio-workspace-provider';
import { useTransactionsConsole } from '@/features/transactions/hooks/use-transactions-console';
import { emitDataRefresh } from '@/lib/client/data-refresh';
import { SourceMetaRow } from '@/components/enterprise/source-meta-row';
import { StateBanner } from '@/components/enterprise/state-banner';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';
const emptySecurityForm: NewSecurityInput = {
  symbol: '',
  name: '',
  isin: '',
  exchange: '',
  assetClass: 'Equity',
  sector: '',
  region: 'US',
  currency: 'USD',
  benchmark: '',
  notes: ''
};

export function TransactionEntryClient() {
  const { portfolios, selectedPortfolio } = usePortfolioWorkspace();
  const { data: payload, meta, submitTransaction, refresh } = useTransactionsConsole(selectedPortfolio?.id);
  const [customSecurities, setCustomSecurities] = useState<SecurityOption[]>([]);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityForm, setSecurityForm] = useState<NewSecurityInput>(emptySecurityForm);
  const [securityMessage, setSecurityMessage] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    portfolioId: '',
    account: '',
    broker: '',
    transactionType: '',
    security: '',
    currency: '',
    tradeDate: '2026-04-21',
    settlementDate: '2026-04-23',
    strategy: '',
    region: '',
    quantity: '100',
    price: '',
    grossAmount: '',
    fees: '',
    taxes: '',
    otherCharges: '',
    fxRate: '1',
    brokerReference: '',
    tags: '',
    notes: ''
  });


  useEffect(() => {
    if (!payload) return;
    setForm((current) => ({
      ...current,
      portfolioId: selectedPortfolio?.id || portfolios[0]?.id || current.portfolioId || '',
      account: payload.suggestedDefaults.account,
      broker: payload.suggestedDefaults.broker,
      transactionType: payload.suggestedDefaults.transactionType,
      currency: payload.suggestedDefaults.currency,
      strategy: payload.suggestedDefaults.strategy,
      region: payload.suggestedDefaults.region,
      security: payload.options.securities[0]?.symbol || current.security || ''
    }));
  }, [payload, portfolios, selectedPortfolio]);

  useEffect(() => {
    if (selectedPortfolio?.id) {
      setForm((current) => ({ ...current, portfolioId: selectedPortfolio.id }));
    }
  }, [selectedPortfolio]);

  const allSecurities = useMemo(() => {
    return [...(payload?.options.securities || []), ...customSecurities];
  }, [payload, customSecurities]);

  const selectedSecurity = useMemo(() => allSecurities.find((item) => item.symbol === form.security), [allSecurities, form.security]);

  useEffect(() => {
    if (selectedSecurity) {
      setForm((current) => ({ ...current, currency: selectedSecurity.currency }));
    }
  }, [selectedSecurity]);

  const estimatedAmount = useMemo(() => {
    const quantity = Number(form.quantity || 0);
    const price = Number(form.price || 0);
    const fees = Number(form.fees || 0);
    const taxes = Number(form.taxes || 0);
    const other = Number(form.otherCharges || 0);
    const total = quantity * price + fees + taxes + other;
    return total ? `${form.currency} ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : `${form.currency || 'USD'} 0`;
  }, [form]);

  const selectedPortfolioName = portfolios.find((item) => item.id === form.portfolioId)?.name || selectedPortfolio?.name || 'Portfolio 1';

  async function submit() {
    const data = await submitTransaction({
      ...form,
      portfolioId: form.portfolioId || selectedPortfolio?.id,
      security: form.security,
      portfolioName: selectedPortfolioName,
      securityMeta: selectedSecurity
    });
    setMessage(data.message || 'Saved');
    emitDataRefresh({ scope: 'transactions', portfolioId: form.portfolioId || selectedPortfolio?.id, reason: 'transaction-created' });
    emitDataRefresh({ scope: 'overview', portfolioId: form.portfolioId || selectedPortfolio?.id, reason: 'transaction-created' });
    await refresh();
  }

  const onField = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const onSecurityField = (key: keyof NewSecurityInput, value: string) => setSecurityForm((current) => ({ ...current, [key]: value }));

  async function saveNewSecurity() {
    if (!securityForm.symbol.trim() || !securityForm.name.trim()) {
      setSecurityMessage('Security symbol and name are required.');
      return;
    }
    try {
      const response = await fetch('/api/securities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          symbol: securityForm.symbol.trim().toUpperCase(),
          name: securityForm.name.trim(),
          isin: securityForm.isin || null,
          exchange: securityForm.exchange.trim() || 'Custom',
          assetClass: securityForm.assetClass,
          sector: securityForm.sector || null,
          currency: securityForm.currency,
          country: securityForm.region || null
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setSecurityMessage(data.message || 'Unable to create security.');
        return;
      }
      const next: SecurityOption = {
        symbol: data.data.item.symbol,
        name: data.data.item.name,
        exchange: data.data.item.exchange || 'Custom',
        assetClass: data.data.item.assetClass,
        currency: data.data.item.currency
      };
      setCustomSecurities((current) => {
        const filtered = current.filter((item) => item.symbol !== next.symbol);
        return [...filtered, next];
      });
      setForm((current) => ({ ...current, security: next.symbol, currency: next.currency, region: securityForm.region }));
      setShowSecurityModal(false);
      setSecurityForm(emptySecurityForm);
      setSecurityMessage('');
      await refresh();
    } catch (error) {
      setSecurityMessage(error instanceof Error ? error.message : 'Unable to create security.');
    }
  }

  return (
    <TerminalShell
      eyebrow="Transaction entry"
      title="Portfolio activity console"
      description="A proper transaction workflow with portfolio-aware entry, richer accounting fields, and the ability to create a new security when it is not yet in the master list."
      rightSlot={<div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,40,0.08)]"><Sparkles size={15} /> Portfolio-aware entry flow</div>}
    >
      {payload ? (
        <div className="space-y-6">
          <SourceMetaRow meta={meta} />
          <StateBanner title="Transactions console is SQLite-backed" detail="Portfolio, account, security, and transaction data are persisted through the backend when database mode is active. Historical price sync runs when security-linked transactions are posted." tone="info" />
          <div className="grid gap-6 2xl:grid-cols-[1.16fr_0.84fr]">
            <div className={surface}>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Entry form</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Post new transaction</div>

              <div className="mt-5 grid gap-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-600">Portfolio</div>
                    <select value={form.portfolioId} onChange={(e) => onField('portfolioId', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none">
                      {portfolios.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-600">Account</div>
                    <select value={form.account} onChange={(e) => onField('account', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none">
                      {payload.options.accounts.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-600">Broker</div>
                    <select value={form.broker} onChange={(e) => onField('broker', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none">
                      {payload.options.brokers.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-600">Transaction type</div>
                    <select value={form.transactionType} onChange={(e) => onField('transactionType', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none">
                      {payload.options.transactionTypes.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-600">Trade date</div>
                    <input type="date" value={form.tradeDate} onChange={(e) => onField('tradeDate', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none" />
                  </label>
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-600">Settlement date</div>
                    <input type="date" value={form.settlementDate} onChange={(e) => onField('settlementDate', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none" />
                  </label>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Security selection</div>
                      <div className="mt-1 text-sm text-slate-600">Choose an existing security or add a new one to the backend security master.</div>
                    </div>
                    <button type="button" onClick={() => setShowSecurityModal(true)} className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                      <Plus size={15} /> Add new security
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <label className="block xl:col-span-2">
                      <div className="mb-2 text-sm font-medium text-slate-600">Security</div>
                      <select value={form.security} onChange={(e) => onField('security', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/90 px-4 text-sm text-slate-700 outline-none">
                        {allSecurities.map((option) => <option key={option.symbol} value={option.symbol}>{option.symbol} · {option.name}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <div className="mb-2 text-sm font-medium text-slate-600">Currency</div>
                      <select value={form.currency} onChange={(e) => onField('currency', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/90 px-4 text-sm text-slate-700 outline-none">
                        {payload.options.currencies.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <div className="mb-2 text-sm font-medium text-slate-600">Region</div>
                      <select value={form.region} onChange={(e) => onField('region', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/90 px-4 text-sm text-slate-700 outline-none">
                        {payload.options.regions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </label>
                  </div>
                  {selectedSecurity ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-600">Name <span className="block font-semibold text-slate-950">{selectedSecurity.name}</span></div>
                      <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-600">Exchange <span className="block font-semibold text-slate-950">{selectedSecurity.exchange}</span></div>
                      <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-600">Asset class <span className="block font-semibold text-slate-950">{selectedSecurity.assetClass}</span></div>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    ['quantity', 'Quantity'],
                    ['price', 'Price per unit'],
                    ['grossAmount', 'Gross amount'],
                    ['fxRate', 'FX rate'],
                    ['fees', 'Brokerage fees'],
                    ['taxes', 'Taxes'],
                    ['otherCharges', 'Other charges'],
                    ['brokerReference', 'Broker reference']
                  ].map(([key, label]) => (
                    <label key={key} className="block">
                      <div className="mb-2 text-sm font-medium text-slate-600">{label}</div>
                      <input value={(form as Record<string, string>)[key]} onChange={(e) => onField(key, e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none" />
                    </label>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-600">Strategy tag</div>
                    <select value={form.strategy} onChange={(e) => onField('strategy', e.target.value)} className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none">
                      {payload.options.strategies.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-600">Tags</div>
                    <input value={form.tags} onChange={(e) => onField('tags', e.target.value)} placeholder="Core, long-term, staggered entry" className="h-12 w-full rounded-2xl border border-white/60 bg-white/85 px-4 text-sm text-slate-700 outline-none" />
                  </label>
                  <label className="block md:col-span-2">
                    <div className="mb-2 text-sm font-medium text-slate-600">Notes</div>
                    <textarea value={form.notes} onChange={(e) => onField('notes', e.target.value)} rows={4} className="w-full rounded-[24px] border border-white/60 bg-white/85 px-4 py-3 text-sm text-slate-700 outline-none" placeholder="Execution notes, thesis, broker references, settlement comments, tax remarks" />
                  </label>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button onClick={submit} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white">Save transaction</button>
                <button className="rounded-full border border-white/60 bg-white/80 px-5 py-3 text-sm font-medium text-slate-700">Save template</button>
                {message ? <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600"><CheckCircle2 size={15} /> {message}</div> : null}
              </div>
            </div>

            <div className="space-y-6">
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Estimated impact</div>
                <div className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-slate-950">{estimatedAmount}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">Posting into <span className="font-semibold text-slate-900">{selectedPortfolioName}</span>. The form now collects the core accounting, broker, settlement, and security information needed before backend logic is wired.</p>
              </div>
              <div className={surface}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><FileStack size={14} /> Quick templates</div>
                <div className="mt-4 space-y-3">
                  {payload.templates.map((template) => (
                    <div key={template.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                      <div className="text-base font-semibold text-slate-950">{template.title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{template.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={surface}>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Security master tips</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">What to capture for a new security</div>
                <div className="mt-4 grid gap-3">
                  {['Symbol and name', 'ISIN / unique identifier', 'Exchange and region', 'Asset class and benchmark', 'Base currency', 'Strategy / notes'].map((item) => (
                    <div key={item} className="rounded-[22px] border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Recent posted entries</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Activity ledger</div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    {['Date', 'Type', 'Security', 'Portfolio', 'Account', 'Amount', 'Status'].map((heading) => <th key={heading} className="pb-3 font-medium">{heading}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {payload.recent.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100/90 text-slate-700">
                      <td className="py-4">{row.date}</td>
                      <td className="py-4 font-medium text-slate-950">{row.type}</td>
                      <td className="py-4">{row.security}</td>
                      <td className="py-4">{row.portfolio}</td>
                      <td className="py-4">{row.account}</td>
                      <td className="py-4 font-semibold text-slate-950">{row.amount}</td>
                      <td className="py-4"><span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showSecurityModal ? (
            <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-sm">
              <div className="w-full max-w-[760px] rounded-[32px] border border-white/60 bg-white/92 p-6 shadow-[0_36px_100px_rgba(15,23,40,0.20)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">New security</div>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Add security to the master list</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Create a new security in the backend master list, then select it directly from the transaction form.</p>
                  </div>
                  <button type="button" onClick={() => setShowSecurityModal(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900"><X size={16} /></button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    ['symbol', 'Symbol'],
                    ['name', 'Security name'],
                    ['isin', 'ISIN / ID'],
                    ['exchange', 'Exchange'],
                    ['sector', 'Sector'],
                    ['benchmark', 'Benchmark']
                  ].map(([key, label]) => (
                    <label key={key} className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <input value={(securityForm as Record<string, string>)[key]} onChange={(e) => onSecurityField(key as keyof NewSecurityInput, e.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70" />
                    </label>
                  ))}
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">Asset class</span>
                    <select value={securityForm.assetClass} onChange={(e) => onSecurityField('assetClass', e.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70">
                      {payload.options.assetClasses.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">Region</span>
                    <select value={securityForm.region} onChange={(e) => onSecurityField('region', e.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70">
                      {payload.options.regions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">Currency</span>
                    <select value={securityForm.currency} onChange={(e) => onSecurityField('currency', e.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70">
                      {payload.options.currencies.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Notes</span>
                    <textarea value={securityForm.notes} onChange={(e) => onSecurityField('notes', e.target.value)} rows={4} className="rounded-[24px] border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70" placeholder="Mandate, sector notes, data source, or any reminders for backend mapping." />
                  </label>
                  {securityMessage ? <div className="md:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{securityMessage}</div> : null}
                </div>
                <div className="mt-5 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setShowSecurityModal(false)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</button>
                  <button type="button" onClick={saveNewSecurity} className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white">Add security</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : <div className={surface}>Loading transaction console…</div>}
    </TerminalShell>
  );
}
