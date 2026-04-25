import { NextResponse } from 'next/server';
import { performanceSeed } from '@/lib/data/terminal-pages-seed';

export async function GET() {
  return NextResponse.json(performanceSeed);
}
