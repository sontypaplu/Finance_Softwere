import { NextResponse } from 'next/server';
import { getIndianFinanceNews } from '@/lib/services/news-service';
import { overviewSeed } from '@/lib/data/market-seed';

export async function GET() {
  try {
    const feed = await getIndianFinanceNews();
    const items = feed.items.slice(0, 6).map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.source,
      image: item.image || overviewSeed.news[index % overviewSeed.news.length]?.image || '/news/macro-wave.svg',
      summary: item.summary,
      badge: feed.fallback ? 'Fallback' : 'Live'
    }));
    return NextResponse.json({ items, source: feed.source, fallback: feed.fallback });
  } catch {
    return NextResponse.json({ items: overviewSeed.news, source: 'seed', fallback: true });
  }
}
