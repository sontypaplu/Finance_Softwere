import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { getRealDeepTables } from '@/lib/services/terminal-data-service';
import { deepTablesSeed } from '@/lib/data/deep-tables-seed';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const portfolioId = new URL(request.url).searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(deepTablesSeed);
  const payload = await getRealDeepTables(session.workspaceId, portfolioId).catch(() => deepTablesSeed);
  return NextResponse.json(payload);
}
