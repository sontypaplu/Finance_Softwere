import { NextResponse } from 'next/server';
import { watchlistSeed } from '@/lib/data/terminal-intelligence-seed';
import { getIndianFinanceNews } from '@/lib/services/news-service';
import { getMarketQuotes } from '@/lib/services/market-data-service';

const watchSymbols = ['MSFT', 'TSM', 'ICICIBANK.NS', 'AMZN', 'SCHD'];
const boardSymbols = ['^GSPC', '^NDX', '^NSEI', 'DX-Y.NYB', 'GC=F', 'BTC-USD'];

export async function GET() {
  try {
    const [boardQuotes, watchQuotes, news] = await Promise.all([
      getMarketQuotes(boardSymbols),
      getMarketQuotes(watchSymbols),
      getIndianFinanceNews()
    ]);

    const quoteBySymbol = new Map([...boardQuotes, ...watchQuotes].map((item) => [item.symbol, item]));

    return NextResponse.json({
      ...watchlistSeed,
      board: watchlistSeed.board.map((item) => {
        const match = quoteBySymbol.get(item.symbol) || quoteBySymbol.get(boardSymbols[watchlistSeed.board.indexOf(item)]);
        return match ? {
          ...item,
          symbol: match.symbol,
          name: match.name,
          price: match.regularMarketPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          change: `${match.regularMarketChangePercent >= 0 ? '+' : ''}${match.regularMarketChangePercent.toFixed(2)}%`,
          direction: match.regularMarketChangePercent >= 0 ? 'up' : 'down'
        } : item;
      }),
      watchlist: watchlistSeed.watchlist.map((item, index) => {
        const match = quoteBySymbol.get(item.symbol) || quoteBySymbol.get(watchSymbols[index]);
        return match ? {
          ...item,
          last: `${match.currency === 'INR' ? '₹' : '$'}${match.regularMarketPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          change: `${match.regularMarketChangePercent >= 0 ? '+' : ''}${match.regularMarketChangePercent.toFixed(2)}%`
        } : item;
      }),
      themes: news.items.slice(0, 3).map((item) => ({ title: item.title, detail: item.summary }))
    });
  } catch {
    return NextResponse.json(watchlistSeed);
  }
}
