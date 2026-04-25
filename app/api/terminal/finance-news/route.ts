import { NextResponse } from 'next/server';
import { getIndianFinanceNews } from '@/lib/services/news-service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const news = await getIndianFinanceNews();
    return NextResponse.json({
      items: news.items,
      fetchedAt: news.fetchedAt,
      sourceStatus: news.fallback ? 'fallback' : 'live',
      source: news.source,
      fallback: news.fallback
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900'
      }
    });
  } catch {
    return NextResponse.json(
      {
        items: [],
        fetchedAt: new Date().toISOString(),
        sourceStatus: 'fallback',
        source: 'unavailable',
        fallback: true
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
