import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { getRealTaxCenter } from '@/lib/services/terminal-data-service';
import { taxCenterSeed } from '@/lib/data/master-scope-seed';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const portfolioId = new URL(request.url).searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(taxCenterSeed);
  const payload = await getRealTaxCenter(session.workspaceId, portfolioId).catch(() => taxCenterSeed);
  return NextResponse.json(payload);
}
