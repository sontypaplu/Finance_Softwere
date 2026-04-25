import { NextResponse } from 'next/server';
import { getMarketQuotes } from '@/lib/services/market-data-service';
import { marketTicker } from '@/lib/data/market-seed';

const defaultSymbols = ['AAPL', 'NVDA', 'MSFT', 'TSLA', '^NSEI', 'BTC-USD', 'GC=F', 'RELIANCE.NS'];

export async function GET() {
  try {
    const quotes = await getMarketQuotes(defaultSymbols);
    if (quotes.length) {
      const items = quotes.map((quote) => ({
        symbol: quote.symbol,
        price: quote.regularMarketPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        change: `${quote.regularMarketChangePercent >= 0 ? '+' : ''}${quote.regularMarketChangePercent.toFixed(2)}%`,
        positive: quote.regularMarketChangePercent >= 0
      }));
      return NextResponse.json({ items, source: 'live' });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json({ items: marketTicker, source: 'seed' });
}
