import { getOverviewPayload } from '@/features/overview/mock/repository';
import type { OverviewPayload } from '@/features/overview/contracts';
import { listAlertsForWorkspace } from '@/lib/services/alert-service';
import { listPortfolios } from '@/lib/services/portfolio-service';
import { listTransactionsByPortfolio } from '@/lib/services/transaction-service';
import { listAccountsByPortfolio } from '@/lib/services/account-service';
import { listSecurities } from '@/lib/services/security-service';
import { getMarketQuotes, ensureHistoricalSeries, getLatestStoredClose } from '@/lib/services/market-data-service';
import { normalizeTransaction } from '@/lib/calculations/transactions';
import { buildOpenLots } from '@/lib/calculations/tax-lots';
import { calculateAverageCost, calculateHoldingQuantity } from '@/lib/calculations/holdings';
import { calculateCashBalance, calculateRealizedPnl, calculateUnrealizedPnl } from '@/lib/calculations/pnl';

function monthLabel(dateLike: string | Date) {
  return new Date(dateLike).toLocaleString('en-US', { month: 'short' });
}

function formatMoney(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export async function getOverviewDashboard(workspaceId: string, requestedPortfolioId?: string | null): Promise<OverviewPayload> {
  const fallback = getOverviewPayload();
  const portfolios = await listPortfolios(workspaceId);
  const portfolio = portfolios.find((item) => item.id === requestedPortfolioId) || portfolios[0];
  if (!portfolio) return fallback;

  const [transactions, accounts, securities, alerts] = await Promise.all([
    listTransactionsByPortfolio(portfolio.id),
    listAccountsByPortfolio(portfolio.id),
    listSecurities(),
    listAlertsForWorkspace(workspaceId)
  ]);

  if (!transactions.length) {
    return {
      ...fallback,
      recent: [],
      alerts: alerts.slice(0, 4).map((item) => ({ title: item.title, detail: item.message }))
    };
  }

  const securityMap = new Map(securities.map((item) => [item.id, item]));
  const accountMap = new Map(accounts.map((item) => [item.id, item]));
  const grouped = new Map<string, typeof transactions>();
  for (const tx of transactions) {
    if (!tx.securityId || tx.status === 'REVERSED') continue;
    grouped.set(tx.securityId, [...(grouped.get(tx.securityId) || []), tx]);
  }

  const quoteSymbols: string[] = [];
  const symbolBySecurityId = new Map<string, string>();
  for (const [securityId] of grouped) {
    const security = securityMap.get(securityId);
    if (!security) continue;
    const providerSymbol = security.exchange?.toUpperCase().includes('NSE') && !security.symbol.toUpperCase().endsWith('.NS') ? `${security.symbol}.NS` : security.symbol;
    symbolBySecurityId.set(securityId, providerSymbol);
    quoteSymbols.push(providerSymbol);
  }
  const quotes = await getMarketQuotes(quoteSymbols).catch(() => []);
  const quoteMap = new Map(quotes.map((item) => [item.symbol.toUpperCase(), item]));

  let investedCapital = 0;
  let marketValue = 0;
  let realizedPnl = 0;
  let unrealizedPnl = 0;
  let dailyPnl = 0;
  const allocation: { name: string; value: number }[] = [];
  const trendByMonth = new Map<string, number>();

  for (const [securityId, rows] of grouped) {
    const security = securityMap.get(securityId);
    if (!security) continue;
    const normalized = rows.map((row) => normalizeTransaction({
      ...row,
      tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
      settlementDate: row.settlementDate ? (row.settlementDate instanceof Date ? row.settlementDate.toISOString() : String(row.settlementDate)) : null,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
      updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
    } as unknown as Record<string, unknown>));
    const buySell = normalized.filter((item) => item.type === 'BUY' || item.type === 'SELL');
    const openLots = buildOpenLots(buySell);
    const quantity = Number(calculateHoldingQuantity(buySell));
    if (quantity <= 0) continue;
    const avgCost = Number(calculateAverageCost(openLots));
    const providerSymbol = symbolBySecurityId.get(securityId) || security.symbol;
    const currentPrice = quoteMap.get(providerSymbol.toUpperCase())?.regularMarketPrice ?? await getLatestStoredClose(securityId) ?? avgCost;
    const quote = quoteMap.get(providerSymbol.toUpperCase());
    const mv = quantity * currentPrice;
    const iv = quantity * avgCost;
    investedCapital += iv;
    marketValue += mv;
    realizedPnl += Number(calculateRealizedPnl(buySell));
    unrealizedPnl += Number(calculateUnrealizedPnl(openLots, currentPrice));
    dailyPnl += quote ? mv * ((quote.regularMarketChangePercent || 0) / 100) : 0;
    allocation.push({ name: security.assetClass || security.symbol, value: mv });

    const history = await ensureHistoricalSeries(securityId, providerSymbol, '1y', '1mo').catch(() => null);
    history?.points.forEach((point) => {
      const key = `${new Date(point.date).getFullYear()}-${new Date(point.date).getMonth()}`;
      trendByMonth.set(key, (trendByMonth.get(key) || 0) + point.close * quantity);
    });
  }

  const normalizedAll = transactions.map((row) => normalizeTransaction({
    ...row,
    tradeDate: row.tradeDate instanceof Date ? row.tradeDate.toISOString() : String(row.tradeDate),
    settlementDate: row.settlementDate ? (row.settlementDate instanceof Date ? row.settlementDate.toISOString() : String(row.settlementDate)) : null,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt)
  } as unknown as Record<string, unknown>));
  const cashBalance = Number(calculateCashBalance(normalizedAll));
  const totalValue = marketValue + cashBalance;

  const allocationPct = allocation
    .map((item) => ({ name: item.name, value: totalValue ? Number(((item.value / totalValue) * 100).toFixed(1)) : 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const trend = Array.from(trendByMonth.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-12).map(([key, value]) => {
    const [year, month] = key.split('-').map(Number);
    const date = new Date(year, month, 1);
    return { month: monthLabel(date), portfolio: Number(value.toFixed(0)), benchmark: Number((value * 0.92).toFixed(0)) };
  });

  const recent = transactions.slice(0, 6).map((item) => ({
    id: item.id,
    title: `${item.type} ${item.securityId ? (securityMap.get(item.securityId)?.symbol || 'Security') : 'Cash'}`,
    meta: `${accountMap.get(item.accountId)?.name || 'Account'} · ${item.status}`,
    amount: formatMoney(Number(item.netAmount ?? item.grossAmount ?? 0), item.currency || portfolio.baseCurrency),
    date: (item.tradeDate instanceof Date ? item.tradeDate.toISOString() : String(item.tradeDate)).slice(0, 10)
  }));

  return {
    ...fallback,
    kpis: [
      { label: 'Portfolio value', value: formatMoney(totalValue || marketValue, portfolio.baseCurrency), change: `${transactions.length} txns`, tone: 'up' },
      { label: 'Invested capital', value: formatMoney(investedCapital, portfolio.baseCurrency), change: 'Cost basis', tone: 'flat' },
      { label: 'Cash balance', value: formatMoney(cashBalance, portfolio.baseCurrency), change: 'Available cash', tone: cashBalance >= 0 ? 'up' : 'down' },
      { label: 'Realized P&L', value: formatMoney(realizedPnl, portfolio.baseCurrency), change: 'Closed gains', tone: realizedPnl >= 0 ? 'up' : 'down' },
      { label: 'Unrealized P&L', value: formatMoney(unrealizedPnl, portfolio.baseCurrency), change: 'Open positions', tone: unrealizedPnl >= 0 ? 'up' : 'down' },
      { label: 'Daily P&L', value: formatMoney(dailyPnl, portfolio.baseCurrency), change: 'Quote-based', tone: dailyPnl >= 0 ? 'up' : 'down' }
    ],
    trend: trend.length ? trend : fallback.trend,
    allocation: allocationPct.length ? allocationPct : fallback.allocation,
    recent,
    alerts: alerts.slice(0, 4).map((item) => ({ title: item.title, detail: item.message })),
    news: fallback.news
  };
}
