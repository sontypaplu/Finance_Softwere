import { subDays } from 'date-fns';
import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import type { HistoricalPriceSeries, MarketQuote } from '@/lib/contracts/market-data';
import { getYahooHistory, getYahooQuotes } from '@/lib/providers/market/yahoo-finance';

export async function getMarketQuotes(symbols: string[]): Promise<MarketQuote[]> {
  if (!symbols.length) return [];
  const provider = process.env.MARKET_DATA_PROVIDER || 'yfinance';
  switch (provider) {
    case 'yfinance':
    default:
      return getYahooQuotes(symbols);
  }
}

export async function getHistoricalSeries(symbol: string, range = '1y', interval = '1d'): Promise<HistoricalPriceSeries> {
  const provider = process.env.MARKET_DATA_PROVIDER || 'yfinance';
  switch (provider) {
    case 'yfinance':
    default:
      return getYahooHistory(symbol, range, interval);
  }
}

export async function getStoredHistoricalSeries(securityId: string): Promise<HistoricalPriceSeries | null> {
  if (!isDatabaseConfigured()) return null;
  const rows = await prisma.priceHistory.findMany({ where: { securityId }, orderBy: { date: 'asc' } });
  if (!rows.length) return null;
  return {
    symbol: securityId,
    currency: rows[0].currency,
    source: rows[0].source || 'database',
    points: rows.map((row) => ({ date: row.date.toISOString(), close: Number(row.close) }))
  };
}

export async function getLatestStoredClose(securityId: string): Promise<number | null> {
  if (!isDatabaseConfigured()) return null;
  const row = await prisma.priceHistory.findFirst({ where: { securityId }, orderBy: { date: 'desc' } });
  return row ? Number(row.close) : null;
}

export async function syncHistoricalSeries(securityId: string, symbol: string, range = '1y', interval = '1d') {
  const series = await getHistoricalSeries(symbol, range, interval);
  if (!isDatabaseConfigured()) return series;

  for (const point of series.points) {
    await prisma.priceHistory.upsert({
      where: {
        securityId_date: {
          securityId,
          date: new Date(point.date)
        }
      },
      update: {
        close: point.close,
        currency: series.currency,
        source: series.source
      },
      create: {
        securityId,
        date: new Date(point.date),
        close: point.close,
        currency: series.currency,
        source: series.source
      }
    });
  }

  return series;
}

export async function ensureHistoricalSeries(securityId: string, symbol: string, range = '1y', interval = '1d') {
  if (!isDatabaseConfigured()) {
    return getHistoricalSeries(symbol, range, interval);
  }
  const latest = await prisma.priceHistory.findFirst({ where: { securityId }, orderBy: { date: 'desc' } });
  const staleThreshold = subDays(new Date(), 3);
  if (latest && latest.date >= staleThreshold) {
    return getStoredHistoricalSeries(securityId);
  }
  try {
    return await syncHistoricalSeries(securityId, symbol, range, interval);
  } catch (error) {
    const stored = await getStoredHistoricalSeries(securityId);
    if (stored) return stored;
    throw error;
  }
}
