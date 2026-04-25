import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { getRealPortfolioAnalytics } from '@/lib/services/terminal-data-service';
import { portfolioAnalyticsSeed } from '@/lib/data/master-scope-seed';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const portfolioId = new URL(request.url).searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(portfolioAnalyticsSeed);
  const payload = await getRealPortfolioAnalytics(session.workspaceId, portfolioId).catch(() => portfolioAnalyticsSeed);
  return NextResponse.json(payload);
}
