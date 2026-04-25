import { NextResponse } from 'next/server';
import { okResponse } from '@/lib/api/response';
import { getOverviewDashboard } from '@/lib/services/overview-service';
import { getSessionFromCookies } from '@/lib/security/session';
import { getOverviewPayload } from '@/features/overview/mock/repository';
import { isDatabaseConfigured } from '@/lib/config/environment';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  const { searchParams } = new URL(request.url);
  const portfolioId = searchParams.get('portfolioId') || undefined;

  if (!session?.workspaceId) {
    return NextResponse.json(okResponse(getOverviewPayload(), { notices: ['Demo overview shown because no active session is available.'], source: 'mock' }));
  }

  try {
    const data = await getOverviewDashboard(session.workspaceId, portfolioId);
    return NextResponse.json(okResponse(data, { notices: ['Overview uses real workspace-backed aggregation when data exists.'] }));
  } catch (error) {
    if (isDatabaseConfigured()) {
      return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to load overview.' }, { status: 500 });
    }
    return NextResponse.json(okResponse(getOverviewPayload(), { notices: ['Falling back to demo overview because database mode is not active.'], source: 'mock' }));
  }
}
