import { NextResponse } from 'next/server';
import { getIndianFinanceNews } from '@/lib/services/news-service';

export async function GET() {
  const data = await getIndianFinanceNews();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900'
    }
  });
}
