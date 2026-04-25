import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { reportsSeed } from '@/lib/data/terminal-intelligence-seed';
import { getRealReports } from '@/lib/services/terminal-data-service';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const { searchParams } = new URL(request.url);
  const portfolioId = searchParams.get('portfolioId');
  if (!session?.workspaceId) return NextResponse.json(reportsSeed);
  const payload = await getRealReports(session.workspaceId, portfolioId).catch(() => reportsSeed);
  return NextResponse.json(payload);
}
