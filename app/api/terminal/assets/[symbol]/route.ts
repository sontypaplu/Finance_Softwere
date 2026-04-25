import { NextResponse } from 'next/server';
import { getAssetDetail as getAssetFallback } from '@/lib/data/terminal-ops-seed';
import { getRealAssetDetail } from '@/lib/services/terminal-data-service';
import { getSessionFromCookies } from '@/lib/security/session';
import { getHistoricalSeries, getMarketQuotes } from '@/lib/services/market-data-service';

const providerSymbolMap: Record<string, string> = {
  HDFCBANK: 'HDFCBANK.NS',
  RELIANCE: 'RELIANCE.NS',
  NIFTY: '^NSEI'
};

function toMonthly(points: { date: string; close: number }[]) {
  const series = points.length > 12
    ? points.filter((_, index) => index % Math.max(1, Math.floor(points.length / 12)) === 0).slice(-12)
    : points;

  return series.map((point) => ({ month: new Date(point.date).toLocaleString('en-US', { month: 'short' }), price: point.close }));
}

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const fallback = getAssetFallback(symbol);
  const session = await getSessionFromCookies();
  const portfolioId = new URL(request.url).searchParams.get('portfolioId');

  if (session?.workspaceId) {
    const live = await getRealAssetDetail(symbol, session.workspaceId, portfolioId).catch(() => null);
    if (live) return NextResponse.json(live);
  }

  const providerSymbol = providerSymbolMap[symbol.toUpperCase()] || symbol;

  try {
    const [quote, history] = await Promise.all([
      getMarketQuotes([providerSymbol]),
      getHistoricalSeries(providerSymbol, '1y', '1mo')
    ]);

    const current = quote[0];
    const monthly = history.points.length ? toMonthly(history.points) : [];

    return NextResponse.json({
      ...fallback,
      price: current ? `${current.currency === 'INR' ? '₹' : '$'}${current.regularMarketPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : fallback.price,
      change: current ? `${current.regularMarketChangePercent >= 0 ? '+' : ''}${current.regularMarketChangePercent.toFixed(2)}%` : fallback.change,
      positive: current ? current.regularMarketChangePercent >= 0 : fallback.positive,
      exchange: current?.exchange || fallback.exchange,
      priceHistory: monthly.length
        ? monthly.map((point, index) => ({ ...point, benchmark: 100 + index * 1.2 }))
        : fallback.priceHistory,
      dataSource: current ? 'live' : 'seed'
    });
  } catch {
    return NextResponse.json({ ...fallback, dataSource: 'seed' });
  }
}
