import { NextResponse } from 'next/server';
import { analyticsSeed } from '@/lib/data/terminal-pages-seed';

export async function GET() {
  return NextResponse.json(analyticsSeed);
}
