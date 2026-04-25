import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { getRealRatioCenter } from '@/lib/services/terminal-data-service';
import { ratioCenterSeed } from '@/lib/data/master-scope-seed';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const portfolioId = new URL(request.url).searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(ratioCenterSeed);
  const payload = await getRealRatioCenter(session.workspaceId, portfolioId).catch(() => ratioCenterSeed);
  return NextResponse.json(payload);
}
