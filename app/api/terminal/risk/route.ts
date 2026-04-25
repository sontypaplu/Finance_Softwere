import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { riskSeed } from '@/lib/data/terminal-pages-seed';
import { getRealRisk } from '@/lib/services/terminal-data-service';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const { searchParams } = new URL(request.url);
  const portfolioId = searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(riskSeed);
  const payload = await getRealRisk(session.workspaceId, portfolioId).catch(() => riskSeed);
  return NextResponse.json(payload);
}
