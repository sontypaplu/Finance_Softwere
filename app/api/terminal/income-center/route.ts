import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { getRealIncomeCenter } from '@/lib/services/terminal-data-service';
import { incomeCenterSeed } from '@/lib/data/master-scope-seed';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const portfolioId = new URL(request.url).searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(incomeCenterSeed);
  const payload = await getRealIncomeCenter(session.workspaceId, portfolioId).catch(() => incomeCenterSeed);
  return NextResponse.json(payload);
}
