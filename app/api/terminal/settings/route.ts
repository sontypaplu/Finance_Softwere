import { NextResponse } from 'next/server';
import { settingsSeed } from '@/lib/data/terminal-ops-seed';

export async function GET() {
  return NextResponse.json(settingsSeed);
}
