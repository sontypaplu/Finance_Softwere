import { NextResponse } from 'next/server';
import { getMarketQuotes } from '@/lib/services/market-data-service';
import { okResponse } from '@/lib/api/response';
import { randomUUID } from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = (searchParams.get('symbols') || '').split(',').map((s) => s.trim()).filter(Boolean);
  const data = await getMarketQuotes(symbols);
  return NextResponse.json(okResponse(data, { requestId: randomUUID(), notices: ['Live market quotes powered by provider adapter.'] }));
}
