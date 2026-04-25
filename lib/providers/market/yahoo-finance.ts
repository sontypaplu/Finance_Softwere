import type { HistoricalPriceSeries, MarketQuote } from '@/lib/contracts/market-data';

const QUOTE_URL = 'https://query1.finance.yahoo.com/v7/finance/quote';
const CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

function parseQuoteResult(result: Record<string, unknown>): MarketQuote | null {
  const symbol = String(result.symbol || '');
  const price = Number(result.regularMarketPrice ?? NaN);
  const change = Number(result.regularMarketChange ?? NaN);
  const changePercent = Number(result.regularMarketChangePercent ?? NaN);
  if (!symbol || !Number.isFinite(price)) return null;

  return {
    symbol,
    name: String(result.shortName || result.longName || symbol),
    currency: String(result.currency || 'USD'),
    exchange: String(result.fullExchangeName || result.exchange || ''),
    marketState: String(result.marketState || ''),
    regularMarketPrice: price,
    regularMarketChange: Number.isFinite(change) ? change : 0,
    regularMarketChangePercent: Number.isFinite(changePercent) ? changePercent : 0,
    regularMarketTime: result.regularMarketTime ? new Date(Number(result.regularMarketTime) * 1000).toISOString() : undefined,
    source: 'yahoo-finance'
  };
}

export async function getYahooQuotes(symbols: string[]): Promise<MarketQuote[]> {
  if (!symbols.length) return [];
  const url = `${QUOTE_URL}?symbols=${encodeURIComponent(symbols.join(','))}`;
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'Mozilla/5.0 (compatible; FinanceTerminal/1.0)'
    },
    next: { revalidate: 120 }
  });

  if (!response.ok) {
    throw new Error(`Yahoo quote request failed with ${response.status}`);
  }

  const payload = await response.json() as { quoteResponse?: { result?: Record<string, unknown>[] } };
  return (payload.quoteResponse?.result || []).map(parseQuoteResult).filter(Boolean) as MarketQuote[];
}

export async function getYahooHistory(symbol: string, range = '1y', interval = '1d'): Promise<HistoricalPriceSeries> {
  const url = `${CHART_URL}/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&includePrePost=false&events=div%2Csplits`;
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'Mozilla/5.0 (compatible; FinanceTerminal/1.0)'
    },
    next: { revalidate: 900 }
  });

  if (!response.ok) {
    throw new Error(`Yahoo history request failed with ${response.status}`);
  }

  const payload = await response.json() as {
    chart?: {
      result?: Array<{
        meta?: { currency?: string };
        timestamp?: number[];
        indicators?: { quote?: Array<{ close?: Array<number | null>; volume?: Array<number | null> }> };
      }>;
    };
  };

  const result = payload.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const quote = result?.indicators?.quote?.[0];
  const closes = quote?.close || [];
  const volumes = quote?.volume || [];

  const points = timestamps
    .map((ts, idx) => ({
      date: new Date(ts * 1000).toISOString(),
      close: closes[idx],
      volume: volumes[idx] ?? undefined
    }))
    .filter((point): point is { date: string; close: number; volume?: number } => typeof point.close === 'number' && Number.isFinite(point.close));

  return {
    symbol,
    currency: result?.meta?.currency || 'USD',
    points,
    source: 'yahoo-finance'
  };
}
