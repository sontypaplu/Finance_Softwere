import { NextResponse } from 'next/server';
import { masterDataSeed } from '@/lib/data/terminal-ops-seed';

export async function GET() {
  return NextResponse.json(masterDataSeed);
}
