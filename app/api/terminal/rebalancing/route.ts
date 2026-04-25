import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { rebalancingSeed } from '@/lib/data/terminal-intelligence-seed';
import { getRealRebalancing } from '@/lib/services/terminal-data-service';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const { searchParams } = new URL(request.url);
  const portfolioId = searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(rebalancingSeed);
  const payload = await getRealRebalancing(session.workspaceId, portfolioId).catch(() => rebalancingSeed);
  return NextResponse.json(payload);
}
