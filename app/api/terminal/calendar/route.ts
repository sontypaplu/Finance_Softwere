import { NextResponse } from 'next/server';
import { calendarSeed } from '@/lib/data/terminal-intelligence-seed';

export async function GET() {
  return NextResponse.json(calendarSeed);
}
