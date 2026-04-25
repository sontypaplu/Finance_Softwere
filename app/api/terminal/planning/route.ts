import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { planningSeed } from '@/lib/data/terminal-pages-seed';
import { getRealPlanning } from '@/lib/services/terminal-data-service';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const { searchParams } = new URL(request.url);
  const portfolioId = searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(planningSeed);
  const payload = await getRealPlanning(session.workspaceId, portfolioId).catch(() => planningSeed);
  return NextResponse.json(payload);
}
