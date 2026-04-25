import { NextResponse } from 'next/server';
import { getSearchPayload } from '@/lib/data/terminal-ops-seed';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  return NextResponse.json(getSearchPayload(query));
}
