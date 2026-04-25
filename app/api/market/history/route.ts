import { NextResponse } from 'next/server';
import { getHistoricalSeries } from '@/lib/services/market-data-service';
import { okResponse } from '@/lib/api/response';
import { randomUUID } from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '';
  const range = searchParams.get('range') || '1y';
  if (!symbol) return NextResponse.json({ ok: false, error: { message: 'symbol is required' } }, { status: 400 });
  const data = await getHistoricalSeries(symbol, range);
  return NextResponse.json(okResponse(data, { requestId: randomUUID(), notices: ['Historical series fetched through market data adapter.'] }));
}
