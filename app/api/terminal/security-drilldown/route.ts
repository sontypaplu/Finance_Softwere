import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { getRealSecurityDrilldown } from '@/lib/services/terminal-data-service';
import { securityDrilldownSeed } from '@/lib/data/master-scope-seed';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const portfolioId = new URL(request.url).searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(securityDrilldownSeed);
  const payload = await getRealSecurityDrilldown(session.workspaceId, portfolioId).catch(() => securityDrilldownSeed);
  return NextResponse.json(payload);
}
