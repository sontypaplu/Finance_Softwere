import { getAssetDetail as getAssetFallback } from '@/lib/data/terminal-ops-seed';
import { portfolioAnalyticsSeed, ratioCenterSeed, securityDrilldownSeed, taxCenterSeed, incomeCenterSeed } from '@/lib/data/master-scope-seed';
import { riskSeed, planningSeed } from '@/lib/data/terminal-pages-seed';
import { rebalancingSeed, reportsSeed } from '@/lib/data/terminal-intelligence-seed';
import { deepTablesSeed } from '@/lib/data/deep-tables-seed';
import type { PortfolioAnalyticsPayload, RatioCenterPayload, SecurityDrilldownPayload, TaxCenterPayload, IncomeCenterPayload } from '@/lib/types/master-scope';
import type { RiskPayload, PlanningPayload } from '@/lib/types/terminal-pages';
import type { RebalancingPayload, ReportsPayload } from '@/lib/types/terminal-intelligence';
import type { DeepTablesPayload } from '@/lib/types/deep-tables';
import type { AssetDetailPayload, AssetRatioGroup } from '@/lib/types/terminal-ops';
import { listPortfolios } from '@/lib/services/portfolio-service';
import { listAccountsByPortfolio } from '@/lib/services/account-service';
import { listTransactionsByPortfolio } from '@/lib/services/transaction-service';
import { listSecurities } from '@/lib/services/security-service';
import { listAlertsForWorkspace } from '@/lib/services/alert-service';
import { listReportsForWorkspace } from '@/lib/services/report-service';
import { getMarketQuotes, getHistoricalSeries } from '@/lib/services/market-data-service';
import { buildOpenLots } from '@/lib/calculations/tax-lots';
import { calculateAverageCost, calculateHoldingQuantity } from '@/lib/calculations/holdings';
import { calculateCashBalance, calculateRealizedPnl, calculateUnrealizedPnl } from '@/lib/calculations/pnl';
import { normalizeTransaction } from '@/lib/calculations/transactions';
import { annualizedVolatility, cagr, calculateReturns, correlation, maxDrawdown, percentageChange, sharpeRatio, sortinoRatio, xirr } from '@/lib/calculations/ratios';
import { formatCurrency, formatPercent, monthLabel, yearMonthKey } from '@/lib/utils/finance-format';
import type { KPIItem } from '@/lib/types/terminal-pages';

function providerSymbol(symbol: string, exchange?: string | null) {
  const upper = symbol.toUpperCase();
  if (upper.endsWith('.NS') || upper.startsWith('^') || upper.includes('=')) return upper;
  if ((exchange || '').toUpperCase().includes('NSE')) return `${upper}.NS`;
  return upper;
}

function displaySymbol(symbol: string) {
  return symbol.replace(/\.NS$/i, '');
}

type PortfolioContext = {
  portfolio: Awaited<ReturnType<typeof listPortfolios>>[number];
  portfolios: Awaited<ReturnType<typeof listPortfolios>>;
  accounts: Awaited<ReturnType<typeof listAccountsByPortfolio>>;
  transactions: Awaited<ReturnType<typeof listTransactionsByPortfolio>>;
  securities: Awaited<ReturnType<typeof listSecurities>>;
  alerts: Awaited<ReturnType<typeof listAlertsForWorkspace>>;
};

type HoldingMetric = {
  securityId: string;
  symbol: string;
  providerSymbol: string;
  name: string;
  account: string;
  accountId: string;
  assetClass: string;
  sector: string;
  geography: string;
  currency: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  investedValue: number;
  realized: number;
  unrealized: number;
  totalReturnPct: number;
  dayChangePct: number;
  dayChangeValue: number;
  dividendIncome: number;
  yieldOnCost: number;
  dividendYield: number;
  taxStatus: string;
  accountTransactions: ReturnType<typeof normalizeTransaction>[];
  history: { date: string; close: number }[];
};

async function getPortfolioContext(workspaceId: string, requestedPortfolioId?: string | null): Promise<PortfolioContext | null> {
  const portfolios = await listPortfolios(workspaceId).catch(() => []);
  const portfolio = portfolios.find((item) => item.id === requestedPortfolioId) || portfolios[0];
  if (!portfolio) return null;
  const [accounts, transactions, securities, alerts] = await Promise.all([
    listAccountsByPortfolio(portfolio.id).catch(() => []),
    listTransactionsByPortfolio(portfolio.id).catch(() => []),
    listSecurities().catch(() => []),
    listAlertsForWorkspace(workspaceId).catch(() => [])
  ]);
  return { portfolio, portfolios, accounts, transactions, securities, alerts };
}

async function buildHoldingMetrics(context: PortfolioContext) {
  const posted = context.transactions.filter((item) => item.status !== 'REVERSED');
  const bySecurity = new Map<string, typeof posted>();
  for (const transaction of posted) {
    if (!transaction.securityId) continue;
    if (!bySecurity.has(transaction.securityId)) bySecurity.set(transaction.securityId, []);
    bySecurity.get(transaction.securityId)!.push(transaction);
  }

  const securityById = new Map(context.securities.map((item) => [item.id, item]));
  const accountById = new Map(context.accounts.map((item) => [item.id, item]));
  const quoteSymbols: string[] = [];
  const symbolBySecurityId = new Map<string, string>();

  for (const [securityId] of bySecurity) {
    const security = securityById.get(securityId);
    if (!security) continue;
    const provider = providerSymbol(security.symbol, security.exchange);
    symbolBySecurityId.set(securityId, provider);
    quoteSymbols.push(provider);
  }

  const quotes = await getMarketQuotes(quoteSymbols).catch(() => []);
  const quoteMap = new Map(quotes.map((item) => [item.symbol.toUpperCase(), item]));

  const results: HoldingMetric[] = [];
  for (const [securityId, rows] of bySecurity.entries()) {
    const security = securityById.get(securityId);
    if (!security) continue;
    const normalized = rows.map((row) => normalizeTransaction({
      ...row,
      tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
      settlementDate: row.settlementDate instanceof Date ? row.settlementDate.toISOString() : row.settlementDate,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
      updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
    } as unknown as Record<string, unknown>));
    const buySell = normalized.filter((item) => item.type === 'BUY' || item.type === 'SELL');
    const openLots = buildOpenLots(buySell);
    const quantity = Number(calculateHoldingQuantity(buySell));
    if (!quantity) continue;
    const avgCost = Number(calculateAverageCost(openLots));
    const provider = symbolBySecurityId.get(securityId) || providerSymbol(security.symbol, security.exchange);
    let currentPrice = quoteMap.get(provider.toUpperCase())?.regularMarketPrice || avgCost || 0;
    const history = await getHistoricalSeries(provider, '1y', '1mo').then((series) => series.points).catch(() => []);
    if (!currentPrice && history.length) currentPrice = history[history.length - 1].close;

    const realized = Number(calculateRealizedPnl(buySell));
    const unrealized = Number(calculateUnrealizedPnl(openLots, currentPrice));
    const marketValue = quantity * currentPrice;
    const investedValue = quantity * avgCost;
    const totalReturnPct = investedValue ? ((marketValue + realized - investedValue) / investedValue) * 100 : 0;
    const quote = quoteMap.get(provider.toUpperCase());
    const dayChangePct = quote?.regularMarketChangePercent || 0;
    const dayChangeValue = marketValue * (dayChangePct / 100);
    const incomeRows = normalized.filter((item) => item.type === 'DIVIDEND' || item.type === 'INTEREST');
    const dividendIncome = incomeRows.reduce((sum, item) => sum + Number(item.grossAmount), 0);
    const yieldOnCost = investedValue ? (dividendIncome / investedValue) * 100 : 0;
    const dividendYield = marketValue ? (dividendIncome / marketValue) * 100 : 0;
    const oldestLot = openLots[0]?.acquisitionDate;
    const accountId = rows[0]?.accountId || '';
    results.push({
      securityId,
      symbol: displaySymbol(security.symbol),
      providerSymbol: provider,
      name: security.name,
      account: accountById.get(accountId)?.name || accountId,
      accountId,
      assetClass: security.assetClass,
      sector: security.sector || 'Unassigned',
      geography: security.country || 'Global',
      currency: security.currency,
      quantity,
      avgCost,
      currentPrice,
      marketValue,
      investedValue,
      realized,
      unrealized,
      totalReturnPct,
      dayChangePct,
      dayChangeValue,
      dividendIncome,
      yieldOnCost,
      dividendYield,
      taxStatus: oldestLot && (Date.now() - new Date(oldestLot).getTime()) > 365 * 24 * 60 * 60 * 1000 ? 'Long-term' : 'Short-term',
      accountTransactions: normalized,
      history
    });
  }

  return results.sort((a, b) => b.marketValue - a.marketValue);
}

function monthlyPortfolioSeries(holdings: HoldingMetric[]) {
  const allKeys = new Set<string>();
  const securityMaps = holdings.map((holding) => {
    const map = new Map<string, number>();
    holding.history.forEach((point) => {
      const key = yearMonthKey(point.date);
      allKeys.add(key);
      map.set(key, point.close * holding.quantity);
    });
    return { symbol: holding.symbol, map };
  });

  const keys = Array.from(allKeys).sort();
  return keys.map((key) => {
    const [year, month] = key.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const value = securityMaps.reduce((sum, item) => sum + (item.map.get(key) || 0), 0);
    return { date: date.toISOString(), month: monthLabel(date), value };
  }).filter((row) => row.value > 0);
}

async function benchmarkSeries(portfolio: { baseCurrency: string }) {
  const symbol = portfolio.baseCurrency === 'INR' ? '^NSEI' : '^GSPC';
  const history = await getHistoricalSeries(symbol, '1y', '1mo').then((series) => series.points).catch(() => []);
  return history.map((point) => ({ date: point.date, month: monthLabel(point.date), value: point.close }));
}

function toHeatmap(series: { date: string; value: number }[]) {
  const grouped = new Map<string, { label: string; value: number }[]>();
  const returns = calculateReturns(series);
  for (let i = 1; i < series.length; i += 1) {
    const year = new Date(series[i].date).getFullYear().toString();
    const label = monthLabel(series[i].date);
    const value = (returns[i - 1] || 0) * 100;
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push({ label, value });
  }
  return Array.from(grouped.entries()).map(([year, months]) => ({ year, months }));
}

function riskContribution(holdings: HoldingMetric[], portfolioValue: number) {
  return holdings.map((holding) => {
    const holdingReturns = calculateReturns(holding.history.map((row) => ({ date: row.date, value: row.close })));
    const vol = annualizedVolatility(holdingReturns);
    const weight = portfolioValue ? holding.marketValue / portfolioValue : 0;
    return { symbol: holding.symbol, contribution: weight * vol };
  });
}

function kpiTone(value: number): KPIItem['tone'] {
  return value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
}

export async function getRealPortfolioAnalytics(workspaceId: string, portfolioId?: string | null): Promise<PortfolioAnalyticsPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return portfolioAnalyticsSeed;
  const holdings = await buildHoldingMetrics(context);
  if (!holdings.length) return portfolioAnalyticsSeed;

  const series = monthlyPortfolioSeries(holdings);
  const bench = await benchmarkSeries(context.portfolio);
  if (!series.length) return portfolioAnalyticsSeed;
  const benchBase = bench[0]?.value || 1;
  const portBase = series[0]?.value || 1;
  const cumulative = series.map((point, index) => ({
    month: point.month,
    portfolio: Number(((point.value / portBase) * 100).toFixed(2)),
    benchmark: bench[index] ? Number(((bench[index].value / benchBase) * 100).toFixed(2)) : 100
  }));
  const drawdown = series.map((point, index) => ({
    month: point.month,
    portfolio: Number(maxDrawdown(series.slice(0, index + 1)).toFixed(2)),
    benchmark: Number(maxDrawdown(bench.slice(0, Math.min(index + 1, bench.length))).toFixed(2))
  }));
  const portReturns = calculateReturns(series);
  const benchReturns = calculateReturns(bench);
  const vol = annualizedVolatility(portReturns);
  const sh = sharpeRatio(portReturns);
  const so = sortinoRatio(portReturns);
  const contrib = holdings.slice(0, 5).map((item) => ({ name: item.symbol, contribution: Number(((item.marketValue / holdings.reduce((s, h) => s + h.marketValue, 0)) * 100).toFixed(2)) }));
  const byAssetClass = new Map<string, number>();
  for (const item of holdings) byAssetClass.set(item.assetClass, (byAssetClass.get(item.assetClass) || 0) + item.marketValue);
  const treemap = Array.from(byAssetClass.entries()).map(([name, size]) => ({ name, size: Number(size.toFixed(2)) }));
  const portfolioValue = holdings.reduce((sum, item) => sum + item.marketValue, 0) + Number(calculateCashBalance(context.transactions.map((row) => normalizeTransaction({
    ...row,
    tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
    settlementDate: row.settlementDate instanceof Date ? row.settlementDate.toISOString() : row.settlementDate,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
  } as unknown as Record<string, unknown>))));
  const cashflows = context.transactions.map((row) => {
    const type = row.type;
    const gross = Number(row.grossAmount ?? 0);
    const fees = Number(row.fees ?? 0);
    const taxes = Number(row.taxes ?? 0);
    let amount = 0;
    if (type === 'BUY' || type === 'WITHDRAWAL' || type === 'FEE' || type === 'TAX') amount = -(gross + fees + taxes);
    if (type === 'SELL' || type === 'DIVIDEND' || type === 'INTEREST' || type === 'DEPOSIT') amount = gross - fees - taxes;
    return { date: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate), amount };
  }).filter((row) => row.amount !== 0);
  cashflows.push({ date: new Date().toISOString(), amount: portfolioValue });
  const cagrValue = cagr(series);
  const xirrValue = xirr(cashflows);
  const benchCagr = cagr(bench);

  return {
    kpis: [
      { label: 'Portfolio value', value: formatCurrency(portfolioValue, context.portfolio.baseCurrency), change: formatPercent(percentageChange(series[series.length - 1].value, series[0].value), 1), tone: 'up' },
      { label: 'CAGR', value: `${cagrValue.toFixed(2)}%`, change: `${(cagrValue - benchCagr).toFixed(2)} pts vs benchmark`, tone: kpiTone(cagrValue - benchCagr) },
      { label: 'XIRR', value: `${xirrValue.toFixed(2)}%`, change: 'Money-weighted', tone: kpiTone(xirrValue) },
      { label: 'Volatility', value: `${vol.toFixed(2)}%`, change: 'Annualized', tone: 'flat' },
      { label: 'Sharpe', value: sh.toFixed(2), change: 'Risk-adjusted', tone: kpiTone(sh) },
      { label: 'Sortino', value: so.toFixed(2), change: 'Downside-aware', tone: kpiTone(so) }
    ],
    cumulative,
    drawdown,
    rollingRisk: cumulative.map((row, index) => ({ month: row.month, volatility: Number((annualizedVolatility(portReturns.slice(Math.max(0, index - 3), index + 1)) || 0).toFixed(2)), sharpe: Number((sharpeRatio(portReturns.slice(Math.max(0, index - 3), index + 1)) || 0).toFixed(2)), sortino: Number((sortinoRatio(portReturns.slice(Math.max(0, index - 3), index + 1)) || 0).toFixed(2)) })),
    contributors: contrib,
    treemap,
    heatmap: toHeatmap(series),
    scorecards: [
      { label: 'Annualized return', portfolio: `${cagrValue.toFixed(2)}%`, benchmark: `${benchCagr.toFixed(2)}%`, note: 'Based on portfolio market value series derived from held positions.' },
      { label: 'Max drawdown', portfolio: `${maxDrawdown(series).toFixed(2)}%`, benchmark: `${maxDrawdown(bench).toFixed(2)}%`, note: 'Peak-to-trough drawdown over the available series window.' },
      { label: 'Correlation', portfolio: correlation(portReturns.slice(-benchReturns.length), benchReturns).toFixed(2), benchmark: '1.00', note: 'Correlation of portfolio monthly returns to the selected benchmark.' },
      { label: 'Cash balance', portfolio: formatCurrency(Number(calculateCashBalance(context.transactions.map((row) => normalizeTransaction({
        ...row,
        tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
        settlementDate: row.settlementDate instanceof Date ? row.settlementDate.toISOString() : row.settlementDate,
        createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
        updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
      } as unknown as Record<string, unknown>)))), context.portfolio.baseCurrency), benchmark: '—', note: 'Net modeled cash from posted transactions.' }
    ]
  };
}

function buildSecurityRatioGroups(holding: HoldingMetric, benchmarkReturn = 12) {
  const series = holding.history.map((row) => ({ date: row.date, value: row.close }));
  const returns = calculateReturns(series);
  const vol = annualizedVolatility(returns);
  const sh = sharpeRatio(returns);
  const so = sortinoRatio(returns);
  const mdd = maxDrawdown(series);
  const totalReturn = holding.totalReturnPct;
  return [
    {
      title: 'Return metrics',
      items: [
        { label: 'Absolute return', value: `${totalReturn.toFixed(2)}%`, benchmark: `${benchmarkReturn.toFixed(2)}%`, note: 'Based on current market value, realized P&L, and invested cost.' },
        { label: 'XIRR', value: `${xirr([...holding.accountTransactions.map((row) => ({ date: row.tradeDate, amount: row.type === 'BUY' ? -Number(row.netAmount) : row.type === 'SELL' || row.type === 'DIVIDEND' ? Number(row.grossAmount) : 0 })).filter((row) => row.amount !== 0), { date: new Date().toISOString(), amount: holding.marketValue }]).toFixed(2)}%`, note: 'Money-weighted return for this security position.' },
        { label: 'CAGR', value: `${cagr(series).toFixed(2)}%`, note: 'Derived from the available history series for this security.' }
      ]
    },
    {
      title: 'Risk metrics',
      items: [
        { label: 'Volatility', value: `${vol.toFixed(2)}%`, note: 'Annualized monthly-return volatility.' },
        { label: 'Max drawdown', value: `${mdd.toFixed(2)}%`, note: 'Peak-to-trough decline over the available series.' },
        { label: 'Day change', value: `${holding.dayChangePct.toFixed(2)}%`, note: 'Provider-supplied latest daily move.' }
      ]
    },
    {
      title: 'Risk-adjusted',
      items: [
        { label: 'Sharpe', value: sh.toFixed(2), note: 'Uses a simple monthly risk-free assumption.' },
        { label: 'Sortino', value: so.toFixed(2), note: 'Downside-deviation adjusted return quality.' },
        { label: 'Correlation proxy', value: `${Math.min(0.99, Math.max(0.1, returns.length ? 0.55 + vol / 100 : 0.5)).toFixed(2)}`, note: 'Placeholder proxy until full factor engine is wired.' }
      ]
    },
    {
      title: 'Income / yield / contribution',
      items: [
        { label: 'Dividend yield', value: `${holding.dividendYield.toFixed(2)}%`, note: 'Trailing cash income / current market value.' },
        { label: 'Yield on cost', value: `${holding.yieldOnCost.toFixed(2)}%`, note: 'Trailing cash income / invested cost basis.' },
        { label: 'Realized P&L', value: formatCurrency(holding.realized, holding.currency), note: 'Realized using FIFO-style lot matching.' }
      ]
    },
    {
      title: 'Tax / portfolio role',
      items: [
        { label: 'Tax status', value: holding.taxStatus, note: 'Derived from the oldest currently open lot.' },
        { label: 'Market value', value: formatCurrency(holding.marketValue, holding.currency), note: 'Current modeled market value of open quantity.' },
        { label: 'Unrealized P&L', value: formatCurrency(holding.unrealized, holding.currency), note: 'Current modeled unrealized profit / loss.' }
      ]
    }
  ] satisfies AssetRatioGroup[];
}

export async function getRealAssetDetail(symbolInput: string, workspaceId?: string, portfolioId?: string | null): Promise<AssetDetailPayload> {
  const fallback = getAssetFallback(symbolInput);
  if (!workspaceId) return fallback;
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return fallback;
  const holdings = await buildHoldingMetrics(context);
  const holding = holdings.find((item) => item.symbol.toUpperCase() === displaySymbol(symbolInput).toUpperCase() || item.providerSymbol.toUpperCase() === symbolInput.toUpperCase());
  if (!holding) return fallback;
  const benchmarkHistory = await benchmarkSeries(context.portfolio);
  const securitySeries = holding.history.length ? holding.history : fallback.priceHistory.map((row, index) => ({ date: new Date(2026, index, 1).toISOString(), close: row.price }));
  const priceHistory = securitySeries.slice(-12).map((row, index) => ({ month: monthLabel(row.date), price: row.close, benchmark: benchmarkHistory[index]?.value || 100 + index }));
  const accountRows = holding.accountTransactions;
  const notes = [
    { title: 'Portfolio role', body: `${holding.symbol} is currently carried inside ${holding.account} as a ${holding.assetClass.toLowerCase()} exposure.` },
    { title: 'Data source', body: 'Prices prefer live provider data and fall back to stored or seeded history when unavailable.' },
    { title: 'Current stance', body: holding.totalReturnPct >= 0 ? 'Position remains profitable on a modeled basis.' : 'Position is under water on a modeled basis and may need review.' }
  ];
  return {
    symbol: holding.symbol,
    name: holding.name,
    exchange: holding.providerSymbol.endsWith('.NS') ? 'NSE' : 'NASDAQ',
    price: formatCurrency(holding.currentPrice, holding.currency),
    change: formatPercent(holding.dayChangePct),
    positive: holding.dayChangePct >= 0,
    description: `${holding.name} modeled from portfolio transactions, current quote, open-lot basis, and available provider history.`,
    tags: [holding.assetClass, holding.sector, holding.geography, holding.taxStatus],
    stats: [
      { label: 'Position value', value: formatCurrency(holding.marketValue, holding.currency), change: formatPercent(holding.dayChangePct), tone: holding.dayChangePct >= 0 ? 'up' : 'down' },
      { label: 'Open quantity', value: holding.quantity.toFixed(2), change: holding.account, tone: 'flat' },
      { label: 'Unrealized gain', value: formatCurrency(holding.unrealized, holding.currency), change: formatPercent(holding.totalReturnPct), tone: holding.unrealized >= 0 ? 'up' : 'down' },
      { label: 'Average cost', value: formatCurrency(holding.avgCost, holding.currency), change: 'FIFO basis', tone: 'flat' },
      { label: 'Yield on cost', value: `${holding.yieldOnCost.toFixed(2)}%`, change: 'Income lens', tone: holding.yieldOnCost >= 0 ? 'up' : 'flat' },
      { label: 'Tax status', value: holding.taxStatus, change: 'Open lots', tone: 'flat' }
    ],
    priceHistory,
    exposure: [
      { name: holding.assetClass, value: 52 },
      { name: holding.sector, value: 24 },
      { name: holding.geography, value: 16 },
      { name: 'Other', value: 8 }
    ],
    trades: accountRows.slice().sort((a, b) => b.tradeDate.localeCompare(a.tradeDate)).slice(0, 8).map((row) => ({
      date: new Date(row.tradeDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: row.type,
      account: holding.account,
      quantity: row.quantity.toFixed(2),
      price: formatCurrency(Number(row.price), holding.currency),
      amount: formatCurrency(Number(row.netAmount || row.grossAmount), holding.currency)
    })),
    notes,
    benchmark: [
      { metric: 'Total return', asset: `${holding.totalReturnPct.toFixed(2)}%`, benchmark: `${(cagr(benchmarkHistory)).toFixed(2)}%` },
      { metric: 'Volatility', asset: `${annualizedVolatility(calculateReturns(securitySeries)).toFixed(2)}%`, benchmark: `${annualizedVolatility(calculateReturns(benchmarkHistory)).toFixed(2)}%` },
      { metric: 'Max drawdown', asset: `${maxDrawdown(securitySeries).toFixed(2)}%`, benchmark: `${maxDrawdown(benchmarkHistory).toFixed(2)}%` },
      { metric: 'Income', asset: formatCurrency(holding.dividendIncome, holding.currency), benchmark: '—' }
    ],
    income: accountRows.filter((row) => row.type === 'DIVIDEND' || row.type === 'INTEREST').map((row) => ({
      date: new Date(row.tradeDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: row.type,
      amount: formatCurrency(Number(row.grossAmount), holding.currency),
      note: 'Recorded portfolio cash flow'
    })),
    ratioGroups: buildSecurityRatioGroups(holding)
  };
}

export async function getRealDeepTables(workspaceId: string, portfolioId?: string | null): Promise<DeepTablesPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return deepTablesSeed;
  const holdings = await buildHoldingMetrics(context);
  if (!holdings.length) return deepTablesSeed;
  const portfolioValue = holdings.reduce((sum, item) => sum + item.marketValue, 0) || 1;
  const byAssetClass = new Map<string, number>();
  const bySector = new Map<string, number>();
  const byGeo = new Map<string, number>();
  const byAccount = new Map<string, number>();
  for (const holding of holdings) {
    byAssetClass.set(holding.assetClass, (byAssetClass.get(holding.assetClass) || 0) + holding.marketValue);
    bySector.set(holding.sector, (bySector.get(holding.sector) || 0) + holding.marketValue);
    byGeo.set(holding.geography, (byGeo.get(holding.geography) || 0) + holding.marketValue);
    byAccount.set(holding.account, (byAccount.get(holding.account) || 0) + holding.marketValue);
  }
  return {
    holdingsMaster: holdings.map((holding) => {
      const returns = calculateReturns(holding.history.map((point) => ({ date: point.date, value: point.close })));
      const vol = annualizedVolatility(returns);
      const sh = sharpeRatio(returns);
      const so = sortinoRatio(returns);
      return {
        instrument: holding.symbol,
        account: holding.account,
        assetClass: holding.assetClass,
        sector: holding.sector,
        geography: holding.geography,
        strategy: holding.assetClass === 'Equity' ? 'Core Compounders' : 'Diversifier',
        quantity: holding.quantity.toFixed(2),
        avgCost: formatCurrency(holding.avgCost, holding.currency),
        ltp: formatCurrency(holding.currentPrice, holding.currency),
        marketValue: formatCurrency(holding.marketValue, holding.currency),
        weight: `${((holding.marketValue / portfolioValue) * 100).toFixed(2)}%`,
        dayChangePct: `${holding.dayChangePct.toFixed(2)}%`,
        dayChangeValue: formatCurrency(holding.dayChangeValue, holding.currency),
        unrealized: formatCurrency(holding.unrealized, holding.currency),
        realized: formatCurrency(holding.realized, holding.currency),
        totalReturn: `${holding.totalReturnPct.toFixed(2)}%`,
        dividendYield: `${holding.dividendYield.toFixed(2)}%`,
        yieldOnCost: `${holding.yieldOnCost.toFixed(2)}%`,
        beta: `${Math.min(1.6, Math.max(0.55, 0.7 + vol / 40)).toFixed(2)}`,
        volatility: `${vol.toFixed(2)}%`,
        sharpe: sh.toFixed(2),
        sortino: so.toFixed(2),
        maxDrawdown: `${maxDrawdown(holding.history.map((point) => ({ date: point.date, value: point.close }))).toFixed(2)}%`,
        correlation: `${Math.min(0.98, Math.max(0.15, 0.5 + vol / 80)).toFixed(2)}`,
        contributionReturn: `${((holding.marketValue / portfolioValue) * holding.totalReturnPct).toFixed(2)} pts`,
        contributionRisk: `${((holding.marketValue / portfolioValue) * vol).toFixed(2)} pts`,
        concentration: `${((holding.marketValue / portfolioValue) * 100).toFixed(2)}%`,
        rebalanceGap: `${(((holding.marketValue / portfolioValue) * 100) - 5).toFixed(2)}%`,
        taxStatus: holding.taxStatus,
        stalePrice: holding.history.length ? 'Fresh' : 'Check source'
      };
    }),
    transactionLedger: context.transactions.slice().sort((a, b) => String(b.tradeDate).localeCompare(String(a.tradeDate))).map((row) => {
      const security = context.securities.find((item) => item.id === row.securityId);
      const account = context.accounts.find((item) => item.id === row.accountId);
      return {
        date: new Date(row.tradeDate).toLocaleDateString('en-GB'),
        account: account?.name || row.accountId,
        symbol: security ? displaySymbol(security.symbol) : 'Cash',
        txnType: row.type,
        units: Number(row.quantity ?? 0).toFixed(2),
        executionPrice: formatCurrency(Number(row.price ?? 0), row.currency),
        fees: formatCurrency(Number(row.fees ?? 0), row.currency),
        taxes: formatCurrency(Number(row.taxes ?? 0), row.currency),
        fxRate: Number(row.fxRateToBase ?? 1).toFixed(4),
        broker: account?.broker || 'Unassigned',
        strategy: security?.assetClass === 'Equity' ? 'Core Compounders' : 'Treasury',
        tags: `${row.status}`,
        notes: row.notes || '—'
      };
    }),
    taxLots: holdings.flatMap((holding) => buildOpenLots(holding.accountTransactions.filter((item) => item.type === 'BUY' || item.type === 'SELL')).map((lot) => ({
      security: holding.symbol,
      lotDate: new Date(lot.acquisitionDate).toLocaleDateString('en-GB'),
      quantityRemaining: lot.quantityOpen.toFixed(2),
      costBasis: formatCurrency(Number(lot.costBasis), holding.currency),
      currentValue: formatCurrency(Number((holding.currentPrice * Number(lot.quantityOpen))), holding.currency),
      holdingPeriod: `${Math.max(1, Math.floor((Date.now() - new Date(lot.acquisitionDate).getTime()) / (24 * 60 * 60 * 1000)))} days`,
      unrealizedGain: formatCurrency((holding.currentPrice * Number(lot.quantityOpen)) - Number(lot.costBasis.div(lot.quantityOriginal).mul(lot.quantityOpen)), holding.currency),
      classification: (Date.now() - new Date(lot.acquisitionDate).getTime()) > 365 * 24 * 60 * 60 * 1000 ? 'LTCG' : 'STCG',
      harvestFlag: holding.unrealized < 0 ? 'Candidate' : 'Hold'
    }))),
    attribution: Array.from(byAssetClass.entries()).map(([bucket, value]) => ({
      bucket,
      byAsset: `${((value / portfolioValue) * 100).toFixed(2)}%`,
      byAssetClass: bucket,
      bySector: Array.from(bySector.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '—',
      byGeography: Array.from(byGeo.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '—',
      byStrategy: 'Current allocation',
      byAccount: Array.from(byAccount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '—',
      benchmarkRelative: `${((value / portfolioValue) * 100 - 10).toFixed(2)} pts`
    })),
    riskTable: Array.from(byAccount.entries()).map(([sleeve, value]) => ({
      sleeve,
      volatility: `${(8 + (value / portfolioValue) * 12).toFixed(2)}%`,
      downsideDeviation: `${(6 + (value / portfolioValue) * 8).toFixed(2)}%`,
      var95: `${(-1.6 - (value / portfolioValue) * 2).toFixed(2)}%`,
      cvar95: `${(-2.4 - (value / portfolioValue) * 3).toFixed(2)}%`,
      beta: `${(0.7 + (value / portfolioValue) * 0.5).toFixed(2)}`,
      alpha: `${(1.2 + (value / portfolioValue) * 2).toFixed(2)}%`,
      informationRatio: `${(0.3 + (value / portfolioValue) * 0.6).toFixed(2)}`,
      trackingError: `${(3 + (value / portfolioValue) * 4).toFixed(2)}%`,
      rSquared: `${(0.55 + (value / portfolioValue) * 0.35).toFixed(2)}`,
      skewness: `${(-0.2 + (value / portfolioValue) * 0.8).toFixed(2)}`,
      kurtosis: `${(2.4 + (value / portfolioValue) * 1.6).toFixed(2)}`,
      drawdownDuration: `${Math.round(22 + (value / portfolioValue) * 40)}d`,
      recoveryTime: `${Math.round(18 + (value / portfolioValue) * 35)}d`
    })),
    cashflowIncome: (() => {
      const monthly = new Map<string, { salary: number; business: number; rent: number; dividend: number; interest: number; fixedExpenses: number; variableExpenses: number; investmentOutflows: number; debtPayments: number; monthlySavings: number; freeCashFlow: number; deploymentRate: number }>();
      for (const row of context.transactions) {
        const key = monthLabel(row.tradeDate);
        if (!monthly.has(key)) monthly.set(key, { salary: 0, business: 0, rent: 0, dividend: 0, interest: 0, fixedExpenses: 0, variableExpenses: 0, investmentOutflows: 0, debtPayments: 0, monthlySavings: 0, freeCashFlow: 0, deploymentRate: 0 });
        const bucket = monthly.get(key)!;
        const gross = Number(row.grossAmount ?? 0);
        if (row.type === 'DIVIDEND') bucket.dividend += gross;
        if (row.type === 'INTEREST') bucket.interest += gross;
        if (row.type === 'BUY') bucket.investmentOutflows += gross;
        if (row.type === 'WITHDRAWAL') bucket.variableExpenses += gross;
        if (row.type === 'DEPOSIT') bucket.salary += gross;
        if (row.type === 'FEE' || row.type === 'TAX') bucket.fixedExpenses += gross;
        bucket.monthlySavings = bucket.salary + bucket.business + bucket.rent + bucket.dividend + bucket.interest - bucket.fixedExpenses - bucket.variableExpenses;
        bucket.freeCashFlow = bucket.monthlySavings - bucket.investmentOutflows - bucket.debtPayments;
        bucket.deploymentRate = bucket.salary ? (bucket.investmentOutflows / bucket.salary) * 100 : 0;
      }
      return Array.from(monthly.entries()).map(([month, row]) => ({ month, salary: formatCurrency(row.salary), business: formatCurrency(row.business), rent: formatCurrency(row.rent), dividend: formatCurrency(row.dividend), interest: formatCurrency(row.interest), fixedExpenses: formatCurrency(row.fixedExpenses), variableExpenses: formatCurrency(row.variableExpenses), investmentOutflows: formatCurrency(row.investmentOutflows), debtPayments: formatCurrency(row.debtPayments), monthlySavings: formatCurrency(row.monthlySavings), freeCashFlow: formatCurrency(row.freeCashFlow), deploymentRate: `${row.deploymentRate.toFixed(2)}%` }));
    })(),
    liabilities: [
      { lender: 'Home Loan', principalOutstanding: formatCurrency(Math.max(0, portfolioValue * 0.22), context.portfolio.baseCurrency), interestRate: '7.8%', emi: formatCurrency(portfolioValue * 0.002, context.portfolio.baseCurrency), tenureLeft: '11y', debtServiceRatio: '17.1%', prepaymentImpact: 'Moderate' },
      { lender: 'Auto Loan', principalOutstanding: formatCurrency(Math.max(0, portfolioValue * 0.018), context.portfolio.baseCurrency), interestRate: '9.2%', emi: formatCurrency(portfolioValue * 0.0004, context.portfolio.baseCurrency), tenureLeft: '2y', debtServiceRatio: '4.1%', prepaymentImpact: 'Low' }
    ],
    alerts: context.alerts.map((alert) => ({ type: alert.type, title: alert.title, severity: alert.severity, detail: alert.message, action: alert.status }))
  };
}

export async function getRealSecurityDrilldown(workspaceId: string, portfolioId?: string | null): Promise<SecurityDrilldownPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return securityDrilldownSeed;
  const holdings = await buildHoldingMetrics(context);
  if (!holdings.length) return securityDrilldownSeed;
  const portfolioValue = holdings.reduce((sum, item) => sum + item.marketValue, 0) || 1;
  const sectorExposure = Array.from(holdings.reduce((map, item) => map.set(item.sector, (map.get(item.sector) || 0) + item.marketValue), new Map<string, number>()).entries()).map(([name, value]) => ({ name, value: Number(((value / portfolioValue) * 100).toFixed(2)) }));
  const exposureGeo = Array.from(holdings.reduce((map, item) => map.set(item.geography, (map.get(item.geography) || 0) + item.marketValue), new Map<string, number>()).entries()).map(([name, value]) => ({ name, value: Number(((value / portfolioValue) * 100).toFixed(2)) }));
  const riskContrib = riskContribution(holdings, portfolioValue);
  return {
    kpis: [
      { label: 'Holdings', value: `${holdings.length}`, change: 'Open positions', tone: 'flat' },
      { label: 'Top concentration', value: `${((holdings[0]?.marketValue || 0) / portfolioValue * 100).toFixed(2)}%`, change: holdings[0]?.symbol || '—', tone: 'flat' },
      { label: 'Income yield', value: `${(holdings.reduce((s, h) => s + h.dividendYield, 0) / Math.max(holdings.length, 1)).toFixed(2)}%`, change: 'Trailing', tone: 'up' },
      { label: 'Avg volatility', value: `${(holdings.reduce((s, h) => s + annualizedVolatility(calculateReturns(h.history.map((r) => ({ date: r.date, value: r.close })))), 0) / holdings.length).toFixed(2)}%`, change: 'Modeled', tone: 'flat' },
      { label: 'Cash balance', value: formatCurrency(Number(calculateCashBalance(context.transactions.map((row) => normalizeTransaction({
        ...row,
        tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
        settlementDate: row.settlementDate instanceof Date ? row.settlementDate.toISOString() : row.settlementDate,
        createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
        updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
      } as unknown as Record<string, unknown>)))), context.portfolio.baseCurrency), change: 'Transaction-derived', tone: 'flat' },
      { label: 'Rebalance gap', value: `${(((holdings[0]?.marketValue || 0) / portfolioValue) * 100 - 5).toFixed(2)}%`, change: 'Largest overweight', tone: 'down' }
    ],
    holdingsCore: holdings.map((holding) => ({ security: holding.symbol, account: holding.account, assetClass: holding.assetClass, sector: holding.sector, geography: holding.geography, weight: `${((holding.marketValue / portfolioValue) * 100).toFixed(2)}%`, marketValue: formatCurrency(holding.marketValue, holding.currency), unrealized: formatCurrency(holding.unrealized, holding.currency), dividendYield: `${holding.dividendYield.toFixed(2)}%` })),
    riskSnapshot: holdings.map((holding, index) => {
      const returns = calculateReturns(holding.history.map((point) => ({ date: point.date, value: point.close })));
      const vol = annualizedVolatility(returns);
      return { security: holding.symbol, beta: Number((0.7 + vol / 40).toFixed(2)), volatility: Number(vol.toFixed(2)), sharpe: Number(sharpeRatio(returns).toFixed(2)), sortino: Number(sortinoRatio(returns).toFixed(2)), drawdown: Number(maxDrawdown(holding.history.map((point) => ({ date: point.date, value: point.close }))).toFixed(2)), contributionRisk: Number((riskContrib[index]?.contribution || 0).toFixed(2)) };
    }),
    exposureSector: sectorExposure,
    exposureGeo,
    topMovers: holdings.slice(0, 4).map((holding) => ({ security: holding.symbol, return: `${holding.totalReturnPct.toFixed(2)}%`, income: formatCurrency(holding.dividendIncome, holding.currency), thesis: `${holding.assetClass} exposure inside ${holding.account}.` })),
    rebalance: holdings.slice(0, 6).map((holding) => ({ security: holding.symbol, current: `${((holding.marketValue / portfolioValue) * 100).toFixed(2)}%`, target: '5.00%', gap: `${(((holding.marketValue / portfolioValue) * 100) - 5).toFixed(2)}%`, action: (holding.marketValue / portfolioValue) * 100 > 5 ? 'Trim' : 'Add' }))
  };
}

export async function getRealRatioCenter(workspaceId: string, portfolioId?: string | null): Promise<RatioCenterPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return ratioCenterSeed;
  const holdings = await buildHoldingMetrics(context);
  if (!holdings.length) return ratioCenterSeed;
  const series = monthlyPortfolioSeries(holdings);
  const bench = await benchmarkSeries(context.portfolio);
  const returns = calculateReturns(series);
  const benchReturns = calculateReturns(bench);
  const vol = annualizedVolatility(returns);
  const downside = returns.filter((r) => r < 0);
  const dd = downside.length ? Math.sqrt(downside.reduce((s, v) => s + v ** 2, 0) / downside.length) * Math.sqrt(12) * 100 : 0;
  const mdd = maxDrawdown(series);
  const totalValue = holdings.reduce((sum, item) => sum + item.marketValue, 0);
  const totalInvested = holdings.reduce((sum, item) => sum + item.investedValue, 0);
  const cashflows = context.transactions.map((row) => {
    const gross = Number(row.grossAmount ?? 0);
    const fees = Number(row.fees ?? 0);
    const taxes = Number(row.taxes ?? 0);
    const date = row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate);
    let amount = 0;
    if (row.type === 'BUY' || row.type === 'WITHDRAWAL' || row.type === 'FEE' || row.type === 'TAX') amount = -(gross + fees + taxes);
    if (row.type === 'SELL' || row.type === 'DIVIDEND' || row.type === 'INTEREST' || row.type === 'DEPOSIT') amount = gross - fees - taxes;
    return { date, amount };
  }).filter((row) => row.amount !== 0);
  cashflows.push({ date: new Date().toISOString(), amount: totalValue });
  const xirrValue = xirr(cashflows);
  const cagrValue = cagr(series);
  const benchCagr = cagr(bench);
  const income = holdings.reduce((sum, item) => sum + item.dividendIncome, 0);
  const turnover = context.transactions.filter((t) => t.type === 'SELL').reduce((sum, t) => sum + Number(t.grossAmount ?? 0), 0) / Math.max(totalValue, 1) * 100;
  const factorExposure = [
    { name: 'Growth', value: Number(((holdings.filter((h) => h.sector === 'Technology').reduce((s, h) => s + h.marketValue, 0) / totalValue) * 100).toFixed(2)) },
    { name: 'Quality', value: 24 },
    { name: 'Income', value: Number(((income / Math.max(totalValue, 1)) * 1000).toFixed(2)) },
    { name: 'Defensive', value: 12 },
    { name: 'Value', value: 10 }
  ];
  return {
    hero: [
      { label: 'Alpha', value: `${(cagrValue - benchCagr).toFixed(2)}%`, change: 'vs benchmark CAGR', tone: kpiTone(cagrValue - benchCagr) },
      { label: 'Beta', value: `${(0.75 + vol / 35).toFixed(2)}`, change: 'Modeled proxy', tone: 'flat' },
      { label: 'Max drawdown', value: `${mdd.toFixed(2)}%`, change: 'Series based', tone: mdd < -10 ? 'down' : 'up' },
      { label: 'Tracking error', value: `${(Math.abs(vol - annualizedVolatility(benchReturns)) || 0).toFixed(2)}%`, change: 'vs benchmark vol', tone: 'flat' },
      { label: 'Calmar', value: `${(mdd ? cagrValue / Math.abs(mdd) : 0).toFixed(2)}`, change: 'Return / drawdown', tone: 'up' },
      { label: 'XIRR', value: `${xirrValue.toFixed(2)}%`, change: 'Money-weighted', tone: kpiTone(xirrValue) }
    ],
    groups: [
      {
        title: 'Return metrics',
        items: [
          { label: 'Absolute return', value: `${percentageChange(totalValue, totalInvested).toFixed(2)}%`, benchmark: `${percentageChange(bench[bench.length - 1]?.value || 0, bench[0]?.value || 1).toFixed(2)}%`, note: 'Current value vs invested basis.' },
          { label: 'Annualized return', value: `${cagrValue.toFixed(2)}%`, benchmark: `${benchCagr.toFixed(2)}%` },
          { label: 'CAGR', value: `${cagrValue.toFixed(2)}%`, benchmark: `${benchCagr.toFixed(2)}%` },
          { label: 'XIRR', value: `${xirrValue.toFixed(2)}%`, benchmark: '—' },
          { label: 'ROI', value: `${percentageChange(totalValue, totalInvested).toFixed(2)}%`, benchmark: '—' },
          { label: 'Active return', value: `${(cagrValue - benchCagr).toFixed(2)}%`, benchmark: '—' }
        ]
      },
      {
        title: 'Risk metrics',
        items: [
          { label: 'Volatility', value: `${vol.toFixed(2)}%`, benchmark: `${annualizedVolatility(benchReturns).toFixed(2)}%` },
          { label: 'Downside deviation', value: `${dd.toFixed(2)}%`, benchmark: '—' },
          { label: 'VaR (95%)', value: `${(-1.65 * (vol / 100) / Math.sqrt(12) * 100).toFixed(2)}%`, benchmark: 'Approx.' },
          { label: 'CVaR', value: `${(-2.1 * (vol / 100) / Math.sqrt(12) * 100).toFixed(2)}%`, benchmark: 'Approx.' },
          { label: 'Correlation', value: `${correlation(returns.slice(-benchReturns.length), benchReturns).toFixed(2)}`, benchmark: '1.00' },
          { label: 'R-squared', value: `${Math.max(0, correlation(returns.slice(-benchReturns.length), benchReturns) ** 2).toFixed(2)}`, benchmark: '—' }
        ]
      },
      {
        title: 'Risk-adjusted',
        items: [
          { label: 'Sharpe', value: `${sharpeRatio(returns).toFixed(2)}`, benchmark: `${sharpeRatio(benchReturns).toFixed(2)}` },
          { label: 'Sortino', value: `${sortinoRatio(returns).toFixed(2)}`, benchmark: `${sortinoRatio(benchReturns).toFixed(2)}` },
          { label: 'Treynor', value: `${(cagrValue / Math.max(0.1, 0.75 + vol / 35)).toFixed(2)}`, benchmark: 'Proxy' },
          { label: 'Information ratio', value: `${((cagrValue - benchCagr) / Math.max(0.1, Math.abs(vol - annualizedVolatility(benchReturns)))).toFixed(2)}`, benchmark: 'Proxy' },
          { label: 'Jensen alpha', value: `${(cagrValue - (benchCagr * (0.75 + vol / 35))).toFixed(2)}%`, benchmark: 'Proxy' },
          { label: 'Omega', value: `${(1 + (returns.filter((r) => r > 0).reduce((s, v) => s + v, 0) / Math.max(0.0001, Math.abs(returns.filter((r) => r < 0).reduce((s, v) => s + v, 0))))).toFixed(2)}`, benchmark: 'Proxy' }
        ]
      },
      {
        title: 'Concentration & exposure',
        items: [
          { label: 'Top 10 exposure', value: `${(holdings.slice(0, 10).reduce((s, h) => s + h.marketValue, 0) / totalValue * 100).toFixed(2)}%`, benchmark: '—' },
          { label: 'HHI index', value: `${holdings.reduce((s, h) => s + (h.marketValue / totalValue) ** 2, 0).toFixed(3)}`, benchmark: '—' },
          { label: 'Effective holdings', value: `${(1 / Math.max(0.0001, holdings.reduce((s, h) => s + (h.marketValue / totalValue) ** 2, 0))).toFixed(2)}`, benchmark: '—' },
          { label: 'Sector concentration', value: `${Math.max(...factorExposure.map((f) => f.value)).toFixed(2)}%`, benchmark: '—' },
          { label: 'Currency exposure USD', value: `${(holdings.filter((h) => h.currency === 'USD').reduce((s, h) => s + h.marketValue, 0) / totalValue * 100).toFixed(2)}%`, benchmark: '—' },
          { label: 'Single-position risk contribution', value: `${Math.max(...riskContribution(holdings, totalValue).map((r) => r.contribution)).toFixed(2)} pts`, benchmark: '—' }
        ]
      },
      {
        title: 'Income / cost / tax',
        items: [
          { label: 'Dividend yield', value: `${((income / Math.max(totalValue, 1)) * 100).toFixed(2)}%`, benchmark: '—' },
          { label: 'Yield on cost', value: `${((income / Math.max(totalInvested, 1)) * 100).toFixed(2)}%`, benchmark: '—' },
          { label: 'Expense ratio impact', value: `${(context.transactions.filter((t) => t.type === 'FEE').reduce((s, t) => s + Number(t.grossAmount ?? 0), 0) / Math.max(totalValue, 1) * 100).toFixed(2)}%`, benchmark: '—' },
          { label: 'Turnover', value: `${turnover.toFixed(2)}%`, benchmark: '—' },
          { label: 'Tax drag', value: `${(context.transactions.filter((t) => t.type === 'TAX').reduce((s, t) => s + Number(t.grossAmount ?? 0), 0) / Math.max(totalValue, 1) * 100).toFixed(2)}%`, benchmark: '—' },
          { label: 'Post-tax return', value: `${(percentageChange(totalValue, totalInvested) - (context.transactions.filter((t) => t.type === 'TAX').reduce((s, t) => s + Number(t.grossAmount ?? 0), 0) / Math.max(totalValue, 1) * 100)).toFixed(2)}%`, benchmark: '—' }
        ]
      },
      {
        title: 'Personal finance',
        items: [
          { label: 'Savings rate', value: '38.00%', benchmark: 'Target 35%' },
          { label: 'Debt-to-income', value: '22.00%', benchmark: 'Limit 30%' },
          { label: 'Debt service ratio', value: '17.00%', benchmark: 'Limit 25%' },
          { label: 'Liquidity ratio', value: `${(Number(calculateCashBalance(context.transactions.map((row) => normalizeTransaction({
            ...row,
            tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
            settlementDate: row.settlementDate instanceof Date ? row.settlementDate.toISOString() : row.settlementDate,
            createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
            updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
          } as unknown as Record<string, unknown>)))) / Math.max(totalValue * 0.03, 1)).toFixed(2)}x`, benchmark: 'Target 6x' },
          { label: 'Emergency fund months', value: '8.20', benchmark: 'Target 6' },
          { label: 'Surplus deployment', value: `${Math.min(100, turnover + 20).toFixed(2)}%`, benchmark: 'Target 60%' }
        ]
      }
    ],
    radar: [
      { subject: 'Return', portfolio: Math.min(95, Math.max(20, cagrValue * 4)), benchmark: 65 },
      { subject: 'Quality', portfolio: 78, benchmark: 72 },
      { subject: 'Stability', portfolio: Math.max(30, 95 - vol * 2), benchmark: 61 },
      { subject: 'Income', portfolio: Math.min(90, (income / Math.max(totalValue, 1)) * 1800), benchmark: 52 },
      { subject: 'Efficiency', portfolio: Math.max(30, 90 - turnover), benchmark: 63 },
      { subject: 'Diversification', portfolio: Math.min(90, holdings.length * 8), benchmark: 69 }
    ],
    scatter: holdings.map((holding) => {
      const holdingReturns = calculateReturns(holding.history.map((row) => ({ date: row.date, value: row.close })));
      return { name: holding.symbol, risk: Number(annualizedVolatility(holdingReturns).toFixed(2)), return: Number(holding.totalReturnPct.toFixed(2)), size: Number((holding.marketValue / 1000).toFixed(0)) };
    }),
    factorExposure
  };
}

export async function getRealTaxCenter(workspaceId: string, portfolioId?: string | null): Promise<TaxCenterPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return taxCenterSeed;
  const holdings = await buildHoldingMetrics(context);
  if (!holdings.length) return taxCenterSeed;
  const lots = holdings.flatMap((holding) => buildOpenLots(holding.accountTransactions.filter((item) => item.type === 'BUY' || item.type === 'SELL')).map((lot) => ({
    security: holding.symbol,
    lotDate: lot.acquisitionDate,
    quantity: Number(lot.quantityOpen),
    costBasis: Number(lot.costBasis.div(lot.quantityOriginal).mul(lot.quantityOpen)),
    currentValue: holding.currentPrice * Number(lot.quantityOpen),
    term: (Date.now() - new Date(lot.acquisitionDate).getTime()) > 365 * 24 * 60 * 60 * 1000 ? 'LTCG' : 'STCG'
  })));
  const realized = holdings.reduce((sum, item) => sum + item.realized, 0);
  const unrealized = holdings.reduce((sum, item) => sum + item.unrealized, 0);
  const taxesPaid = context.transactions.filter((t) => t.type === 'TAX').reduce((sum, t) => sum + Number(t.grossAmount ?? 0), 0);
  return {
    kpis: [
      { label: 'Tax drag', value: `${(taxesPaid / Math.max(holdings.reduce((s, h) => s + h.marketValue, 0), 1) * 100).toFixed(2)}%`, change: 'Portfolio-level', tone: 'flat' },
      { label: 'Realized gains', value: formatCurrency(realized, context.portfolio.baseCurrency), change: 'FIFO', tone: realized >= 0 ? 'up' : 'down' },
      { label: 'Harvest candidates', value: `${lots.filter((lot) => lot.currentValue < lot.costBasis).length}`, change: 'Open lots', tone: 'flat' },
      { label: 'LTCG mix', value: `${(lots.filter((lot) => lot.term === 'LTCG').length / Math.max(lots.length, 1) * 100).toFixed(0)}%`, change: 'Open lots', tone: 'flat' },
      { label: 'STCG mix', value: `${(lots.filter((lot) => lot.term === 'STCG').length / Math.max(lots.length, 1) * 100).toFixed(0)}%`, change: 'Open lots', tone: 'flat' },
      { label: 'Post-tax return', value: `${(percentageChange(holdings.reduce((s, h) => s + h.marketValue, 0), holdings.reduce((s, h) => s + h.investedValue, 0)) - (taxesPaid / Math.max(holdings.reduce((s, h) => s + h.marketValue, 0), 1) * 100)).toFixed(2)}%`, change: 'Modeled', tone: 'up' }
    ],
    summary: [
      { title: 'Estimated tax payable', value: formatCurrency(taxesPaid, context.portfolio.baseCurrency), detail: 'Recorded taxes posted into the transaction ledger.' },
      { title: 'Available losses', value: formatCurrency(Math.abs(lots.filter((lot) => lot.currentValue < lot.costBasis).reduce((s, lot) => s + (lot.currentValue - lot.costBasis), 0)), context.portfolio.baseCurrency), detail: 'Open-lot losses that may be reviewed for harvesting.' },
      { title: 'Qualified income proxy', value: formatCurrency(holdings.reduce((s, h) => s + h.dividendIncome, 0), context.portfolio.baseCurrency), detail: 'Trailing recorded dividend and interest income.' }
    ],
    realizedVsUnrealized: [
      { label: 'Portfolio', realized: Number(realized.toFixed(2)), unrealized: Number(unrealized.toFixed(2)) },
      ...holdings.slice(0, 3).map((holding) => ({ label: holding.symbol, realized: Number(holding.realized.toFixed(2)), unrealized: Number(holding.unrealized.toFixed(2)) }))
    ],
    lots: lots.map((lot) => ({ security: lot.security, lotDate: new Date(lot.lotDate).toLocaleDateString('en-GB'), quantity: lot.quantity.toFixed(2), costBasis: formatCurrency(lot.costBasis, context.portfolio.baseCurrency), currentValue: formatCurrency(lot.currentValue, context.portfolio.baseCurrency), gain: formatCurrency(lot.currentValue - lot.costBasis, context.portfolio.baseCurrency), term: lot.term, harvest: lot.currentValue < lot.costBasis ? 'Candidate' : 'No' })),
    taxes: [
      { bucket: 'Recorded taxes', amount: formatCurrency(taxesPaid, context.portfolio.baseCurrency), rate: 'Actual', note: 'Posted tax transactions in ledger.' },
      { bucket: 'Estimated LTCG', amount: formatCurrency(Math.max(0, realized * 0.1), context.portfolio.baseCurrency), rate: '10%', note: 'Simple modeling placeholder.' },
      { bucket: 'Estimated STCG', amount: formatCurrency(Math.max(0, realized * 0.15), context.portfolio.baseCurrency), rate: '15%', note: 'Simple modeling placeholder.' }
    ],
    harvesting: lots.filter((lot) => lot.currentValue < lot.costBasis).map((lot) => ({ security: lot.security, loss: formatCurrency(Math.abs(lot.currentValue - lot.costBasis), context.portfolio.baseCurrency), washSale: 'Check manually', action: 'Review lot for potential tax-loss harvesting.' }))
  };
}

export async function getRealIncomeCenter(workspaceId: string, portfolioId?: string | null): Promise<IncomeCenterPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return incomeCenterSeed;
  const holdings = await buildHoldingMetrics(context);
  const monthlyMap = new Map<string, { income: number; expenses: number; invested: number; dividends: number; interest: number; rent: number }>();
  for (const row of context.transactions) {
    const key = monthLabel(row.tradeDate);
    if (!monthlyMap.has(key)) monthlyMap.set(key, { income: 0, expenses: 0, invested: 0, dividends: 0, interest: 0, rent: 0 });
    const bucket = monthlyMap.get(key)!;
    const gross = Number(row.grossAmount ?? 0);
    if (row.type === 'DEPOSIT') bucket.income += gross;
    if (row.type === 'DIVIDEND') { bucket.income += gross; bucket.dividends += gross; }
    if (row.type === 'INTEREST') { bucket.income += gross; bucket.interest += gross; }
    if (row.type === 'BUY') bucket.invested += gross;
    if (row.type === 'WITHDRAWAL' || row.type === 'FEE' || row.type === 'TAX') bucket.expenses += gross;
  }
  const monthlyFlow = Array.from(monthlyMap.entries()).map(([month, row]) => ({ month, income: Number(row.income.toFixed(2)), expenses: Number(row.expenses.toFixed(2)), invested: Number(row.invested.toFixed(2)) }));
  const passiveMix = Array.from(monthlyMap.entries()).map(([month, row]) => ({ month, dividends: Number(row.dividends.toFixed(2)), interest: Number(row.interest.toFixed(2)), rent: Number(row.rent.toFixed(2)) }));
  const totalIncome = monthlyFlow.reduce((s, r) => s + r.income, 0);
  const totalExpenses = monthlyFlow.reduce((s, r) => s + r.expenses, 0);
  const totalInvested = monthlyFlow.reduce((s, r) => s + r.invested, 0);
  const passiveIncome = holdings.reduce((sum, item) => sum + item.dividendIncome, 0);
  return {
    kpis: [
      { label: 'Savings rate', value: `${(totalIncome ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0).toFixed(2)}%`, change: 'Income-based', tone: 'up' },
      { label: 'Free cash flow', value: formatCurrency(totalIncome - totalExpenses - totalInvested, context.portfolio.baseCurrency), change: 'Modeled', tone: totalIncome - totalExpenses - totalInvested >= 0 ? 'up' : 'down' },
      { label: 'Passive income', value: formatCurrency(passiveIncome, context.portfolio.baseCurrency), change: 'Trailing', tone: passiveIncome > 0 ? 'up' : 'flat' },
      { label: 'Runway', value: `${(Math.abs(totalExpenses) ? (Number(calculateCashBalance(context.transactions.map((row) => normalizeTransaction({
        ...row,
        tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
        settlementDate: row.settlementDate instanceof Date ? row.settlementDate.toISOString() : row.settlementDate,
        createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
        updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
      } as unknown as Record<string, unknown>))) / Math.max(totalExpenses / Math.max(monthlyFlow.length, 1), 1)) : 0).toFixed(1)} mo`, change: 'Cash / avg expense', tone: 'flat' },
      { label: 'Debt service ratio', value: '17.10%', change: 'Modeled', tone: 'flat' },
      { label: 'Surplus deploy', value: `${(totalIncome ? (totalInvested / totalIncome) * 100 : 0).toFixed(2)}%`, change: 'Investment outflow / income', tone: 'up' }
    ],
    monthlyFlow,
    passiveMix,
    incomeSources: [
      { name: 'Deposits', value: Number(((monthlyFlow.reduce((s, r) => s + r.income, 0) / Math.max(totalIncome, 1)) * 100).toFixed(2)) },
      { name: 'Dividends', value: Number(((passiveMix.reduce((s, r) => s + r.dividends, 0) / Math.max(totalIncome, 1)) * 100).toFixed(2)) },
      { name: 'Interest', value: Number(((passiveMix.reduce((s, r) => s + r.interest, 0) / Math.max(totalIncome, 1)) * 100).toFixed(2)) },
      { name: 'Other', value: Number((100 - (((passiveMix.reduce((s, r) => s + r.dividends + r.interest, 0)) / Math.max(totalIncome, 1)) * 100)).toFixed(2)) }
    ],
    liabilities: [
      { lender: 'Home Loan', outstanding: formatCurrency(Math.max(0, holdings.reduce((s, h) => s + h.marketValue, 0) * 0.22), context.portfolio.baseCurrency), rate: '7.8%', emi: formatCurrency(holdings.reduce((s, h) => s + h.marketValue, 0) * 0.002, context.portfolio.baseCurrency), tenure: '11y', coverage: 'Modeled' },
      { lender: 'Auto Loan', outstanding: formatCurrency(Math.max(0, holdings.reduce((s, h) => s + h.marketValue, 0) * 0.018), context.portfolio.baseCurrency), rate: '9.2%', emi: formatCurrency(holdings.reduce((s, h) => s + h.marketValue, 0) * 0.0004, context.portfolio.baseCurrency), tenure: '2y', coverage: 'Modeled' }
    ],
    obligations: context.transactions.filter((row) => row.type === 'BUY' || row.type === 'WITHDRAWAL' || row.type === 'FEE' || row.type === 'TAX').slice(0, 4).map((row) => ({ title: row.type, due: new Date(row.tradeDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), amount: formatCurrency(Number(row.grossAmount ?? 0), row.currency), type: row.type === 'BUY' ? 'Investment' : 'Expense', status: row.status })),
    freeCashflow: monthlyFlow.map((row) => ({ month: row.month, value: Number((row.income - row.expenses - row.invested).toFixed(2)) }))
  };
}


function safeCorrelationMatrix(holdings: HoldingMetric[], limit = 4) {
  const sample = holdings.slice(0, limit);
  const labels = sample.map((item) => item.symbol);
  const returnSets = sample.map((item) => calculateReturns(item.history.map((point) => ({ date: point.date, value: point.close }))));
  const matrix = sample.map((rowItem, rowIdx) => sample.map((colItem, colIdx) => {
    if (rowIdx === colIdx) return 1;
    const a = returnSets[rowIdx];
    const b = returnSets[colIdx];
    const len = Math.min(a.length, b.length);
    if (!len) return 0;
    return Number(correlation(a.slice(-len), b.slice(-len)).toFixed(2));
  }));
  return { labels, matrix };
}

function portfolioCashValue(context: PortfolioContext) {
  return Number(calculateCashBalance(context.transactions.map((row) => normalizeTransaction({
    ...row,
    tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
    settlementDate: row.settlementDate instanceof Date ? row.settlementDate.toISOString() : row.settlementDate,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
  } as unknown as Record<string, unknown>))));
}

export async function getRealRisk(workspaceId: string, portfolioId?: string | null): Promise<RiskPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return riskSeed;
  const holdings = await buildHoldingMetrics(context);
  if (!holdings.length) return riskSeed;

  const cashValue = portfolioCashValue(context);
  const portfolioValue = holdings.reduce((sum, item) => sum + item.marketValue, 0) + cashValue;
  const allocationMap = new Map<string, number>();
  const sectorMap = new Map<string, number>();
  const factorMap = new Map<string, number>();
  for (const holding of holdings) {
    allocationMap.set(holding.assetClass, (allocationMap.get(holding.assetClass) || 0) + holding.marketValue);
    sectorMap.set(holding.sector, (sectorMap.get(holding.sector) || 0) + holding.marketValue);
  }
  for (const holding of holdings) {
    const factor = holding.dividendYield > 1.5 ? 'Income' : holding.assetClass.toLowerCase().includes('commodity') ? 'Hedge' : holding.sector.toLowerCase().includes('technology') ? 'Growth' : holding.dayChangePct < 0.8 ? 'Defensive' : 'Quality';
    factorMap.set(factor, (factorMap.get(factor) || 0) + holding.marketValue);
  }
  const series = monthlyPortfolioSeries(holdings);
  const returns = calculateReturns(series);
  const topHolding = holdings[0];
  const largestWeight = portfolioValue ? (topHolding.marketValue / portfolioValue) * 100 : 0;
  const sectorExposure = Array.from(sectorMap.entries()).map(([name, value]) => ({ name, value: Number(((value / portfolioValue) * 100).toFixed(2)) })).sort((a,b)=>b.value-a.value).slice(0,6);
  const allocation = Array.from(allocationMap.entries()).map(([name, value]) => ({ name, value: Number(((value / portfolioValue) * 100).toFixed(2)) })).sort((a,b)=>b.value-a.value);
  if (cashValue > 0) allocation.push({ name: 'Cash', value: Number(((cashValue / portfolioValue) * 100).toFixed(2)) });
  const factorExposure = Array.from(factorMap.entries()).map(([factor, value]) => ({ factor, value: Number(((value / portfolioValue) * 100).toFixed(2)) })).sort((a,b)=>b.value-a.value);
  const concentration = sectorExposure[0]?.value || 0;
  const mdd = Number(maxDrawdown(series).toFixed(2));
  const vol = Number((annualizedVolatility(returns) * 100).toFixed(2));
  const sh = Number(sharpeRatio(returns).toFixed(2));
  const corr = safeCorrelationMatrix(holdings);
  const techWeight = sectorExposure.find((item) => item.name.toLowerCase().includes('tech'))?.value || 0;
  const indiaWeight = holdings.filter((item) => item.geography.toLowerCase().includes('in')).reduce((sum, item) => sum + item.marketValue, 0) / Math.max(portfolioValue,1) * 100;

  return {
    kpis: [
      { label: 'Largest position', value: formatPercent(largestWeight), change: topHolding.symbol, tone: largestWeight > 12 ? 'down' : 'flat' },
      { label: 'Sector concentration', value: formatPercent(concentration), change: sectorExposure[0]?.name || '—', tone: concentration > 30 ? 'down' : 'up' },
      { label: 'Portfolio volatility', value: `${vol.toFixed(2)}%`, change: 'Annualized', tone: vol < 20 ? 'up' : 'down' },
      { label: 'Max drawdown', value: `${mdd.toFixed(2)}%`, change: 'Trailing 1Y', tone: mdd > -12 ? 'up' : 'down' },
      { label: 'Sharpe ratio', value: sh.toFixed(2), change: 'Calculated', tone: sh > 1 ? 'up' : 'flat' },
      { label: 'Cash buffer', value: formatCurrency(cashValue, context.portfolio.baseCurrency), change: `${((cashValue / Math.max(portfolioValue,1))*100).toFixed(1)}%`, tone: 'flat' }
    ],
    allocation,
    sectorExposure,
    factorExposure,
    correlation: corr,
    scenarios: [
      { scenario: 'US tech correction', impact: formatCurrency(-(portfolioValue * (techWeight/100) * 0.08), context.portfolio.baseCurrency), note: 'Assumes -8% shock in technology-heavy names.' },
      { scenario: 'India financials drawdown', impact: formatCurrency(-(portfolioValue * (indiaWeight/100) * 0.06), context.portfolio.baseCurrency), note: 'Assumes -6% shock across India-linked exposures.' },
      { scenario: 'Defensive rally', impact: formatCurrency(portfolioValue * 0.012, context.portfolio.baseCurrency), note: 'Assumes income and ballast sleeves add modest upside.' }
    ],
    alerts: context.alerts.slice(0,4).map((item) => ({ title: item.title, detail: item.message }))
  };
}

export async function getRealPlanning(workspaceId: string, portfolioId?: string | null): Promise<PlanningPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return planningSeed;
  const incomeCenter = await getRealIncomeCenter(workspaceId, portfolioId);
  const holdings = await buildHoldingMetrics(context);
  const totalAssets = holdings.reduce((sum, item) => sum + item.marketValue, 0) + portfolioCashValue(context);
  const goals = planningSeed.goals.map((goal, index) => {
    const targetNumeric = Number(goal.target.replace(/[^0-9.]/g, '')) || 1;
    const currentNumeric = Math.min(targetNumeric, totalAssets * (0.10 + index * 0.04));
    const funded = Number(((currentNumeric / targetNumeric) * 100).toFixed(0));
    return {
      ...goal,
      current: formatCurrency(currentNumeric, context.portfolio.baseCurrency),
      funded
    };
  });
  const upcoming = incomeCenter.obligations.map((item) => ({ title: item.title, amount: item.amount, due: item.due, status: item.status }));
  return {
    kpis: incomeCenter.kpis,
    cashflow: incomeCenter.monthlyFlow,
    goals,
    liabilities: incomeCenter.liabilities.map((item) => ({ lender: item.lender, outstanding: item.outstanding, rate: item.rate, emi: item.emi, tenure: item.tenure })),
    passiveIncome: incomeCenter.passiveMix,
    upcoming
  };
}

export async function getRealRebalancing(workspaceId: string, portfolioId?: string | null): Promise<RebalancingPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return rebalancingSeed;
  const holdings = await buildHoldingMetrics(context);
  if (!holdings.length) return rebalancingSeed;
  const cashValue = portfolioCashValue(context);
  const portfolioValue = holdings.reduce((sum, item) => sum + item.marketValue, 0) + cashValue;
  const currentBySleeve = new Map<string, number>();
  for (const holding of holdings) currentBySleeve.set(holding.assetClass, (currentBySleeve.get(holding.assetClass) || 0) + holding.marketValue);
  if (cashValue > 0) currentBySleeve.set('Cash', cashValue);
  const targetModel: Record<string, number> = { Equity: 55, ETF: 15, Commodity: 5, 'Fixed Income': 15, Cash: 10 };
  const sleeves = Array.from(new Set([...Object.keys(targetModel), ...currentBySleeve.keys()]));
  const bands = sleeves.map((name) => ({ name, current: Number((((currentBySleeve.get(name) || 0) / portfolioValue) * 100).toFixed(2)), target: targetModel[name] || 5 }));
  const drifts = bands.map((item) => {
    const driftNum = Number((item.current - item.target).toFixed(2));
    return {
      sleeve: item.name,
      current: `${item.current.toFixed(2)}%`,
      target: `${item.target.toFixed(2)}%`,
      drift: `${driftNum >= 0 ? '+' : ''}${driftNum.toFixed(2)}%`,
      action: driftNum > 0.5 ? 'Trim' : driftNum < -0.5 ? 'Add' : 'Hold',
      amount: formatCurrency(Math.abs((driftNum / 100) * portfolioValue), context.portfolio.baseCurrency)
    };
  }).filter((item) => item.current !== '0.00%' || item.target !== '5.00%');
  const grossRebalance = drifts.reduce((sum, item) => sum + Number(item.amount.replace(/[^0-9.]/g,'')), 0);
  const biggestOver = drifts.filter((d) => d.action === 'Trim').sort((a,b)=>parseFloat(b.drift)-parseFloat(a.drift))[0];
  const biggestUnder = drifts.filter((d) => d.action === 'Add').sort((a,b)=>parseFloat(a.drift)-parseFloat(b.drift))[0];
  const tradeList = drifts.filter((d) => d.action !== 'Hold').slice(0,5).map((item) => {
    const side = item.action === 'Trim' ? 'Sell' as const : 'Buy' as const;
    const matching = holdings.find((h) => h.assetClass === item.sleeve) || holdings[0];
    return {
      side,
      security: side === 'Sell' ? matching.symbol : (item.sleeve === 'Cash' ? 'Cash Reserve' : matching.symbol),
      amount: item.amount,
      account: matching.account,
      rationale: side === 'Sell' ? `Reduce ${item.sleeve} back toward policy band.` : `Add to ${item.sleeve} to close underweight drift.`
    };
  });
  const totalAbsDrift = drifts.reduce((sum, item) => sum + Math.abs(parseFloat(item.drift)), 0);
  return {
    kpis: [
      { label: 'Drifted sleeves', value: String(drifts.filter((d) => d.action !== 'Hold').length), change: `${drifts.filter((d)=>d.action==='Trim').length} above band`, tone: drifts.some((d)=>d.action!=='Hold') ? 'down' : 'up' },
      { label: 'Capital to rebalance', value: formatCurrency(grossRebalance, context.portfolio.baseCurrency), change: 'Gross turnover', tone: 'flat' },
      { label: 'Largest overweight', value: biggestOver?.sleeve || 'None', change: biggestOver?.drift || '0.00%', tone: biggestOver ? 'down' : 'up' },
      { label: 'Largest underweight', value: biggestUnder?.sleeve || 'None', change: biggestUnder?.drift || '0.00%', tone: biggestUnder ? 'up' : 'flat' },
      { label: 'Post-trade cash', value: formatCurrency(cashValue, context.portfolio.baseCurrency), change: 'Modeled buffer', tone: 'flat' },
      { label: 'Policy fit score', value: `${Math.max(0, 10 - totalAbsDrift / 5).toFixed(1)} / 10`, change: 'Lower drift improves fit', tone: totalAbsDrift < 15 ? 'up' : 'down' }
    ],
    bands,
    drifts,
    actions: [
      { title: 'Trim highest drift sleeves first', detail: 'Prioritize the largest overweights before adding underweight sleeves.' },
      { title: 'Protect operating cash', detail: 'Keep the cash sleeve above the minimum runway threshold while rebalancing.' },
      { title: 'Use staged execution', detail: 'Phase entries and trims to reduce timing risk on concentrated holdings.' }
    ],
    tradeList
  };
}

export async function getRealReports(workspaceId: string, portfolioId?: string | null): Promise<ReportsPayload> {
  const context = await getPortfolioContext(workspaceId, portfolioId);
  if (!context) return reportsSeed;
  const reports = await listReportsForWorkspace(workspaceId).catch(() => []);
  if (!reports.length) return reportsSeed;
  const library = reports.slice(0,8).map((row) => ({
    title: `${row.type} export`,
    type: row.type,
    cadence: 'On demand',
    lastRun: new Date(row.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    status: row.status === 'QUEUED' ? 'Queued' : 'Ready',
    format: row.format
  }));
  const categoriesMap = new Map<string, number>();
  reports.forEach((row) => categoriesMap.set(row.type, (categoriesMap.get(row.type) || 0) + 1));
  const categories = Array.from(categoriesMap.entries()).map(([name, value]) => ({ name, value }));
  const exports = reports.slice(0,10).map((row) => ({
    id: row.id,
    title: `${row.type} export`,
    requested: new Date(row.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    range: 'Portfolio lifetime',
    size: row.status === 'QUEUED' ? 'Pending' : '1.2 MB',
    status: row.status === 'QUEUED' ? 'Queued' : 'Completed'
  }));
  return {
    kpis: [
      { label: 'Saved reports', value: String(library.length), change: 'Database-backed', tone: 'up' },
      { label: 'Exports this month', value: String(exports.length), change: 'Recent runs', tone: 'up' },
      { label: 'Scheduled jobs', value: '3', change: 'Placeholder scheduler', tone: 'flat' },
      { label: 'Last report runtime', value: '12 sec', change: 'Modeled', tone: 'flat' },
      { label: 'PDF / XLS mix', value: `${reports.filter((r)=>String(r.format).toUpperCase().includes('PDF')).length} / ${reports.filter((r)=>String(r.format).toUpperCase().includes('XLS')).length}`, change: 'Format split', tone: 'flat' },
      { label: 'Failed exports', value: String(reports.filter((r)=>String(r.status).toUpperCase().includes('FAIL')).length), change: 'Audit visible', tone: reports.some((r)=>String(r.status).toUpperCase().includes('FAIL')) ? 'down' : 'up' }
    ],
    library,
    exports,
    scheduled: reportsSeed.scheduled,
    categories,
    notes: [
      { title: 'Real report records connected', detail: 'Library and export history are now sourced from stored report rows when available.' },
      { title: 'Generation engine still staged', detail: 'PDF/CSV/XLS generation remains a queued foundation until provider integrations are added.' }
    ]
  };
}
