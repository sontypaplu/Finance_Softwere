import { NextResponse } from 'next/server';
import { goalsSeed } from '@/lib/data/terminal-intelligence-seed';

export async function GET() {
  return NextResponse.json(goalsSeed);
}
