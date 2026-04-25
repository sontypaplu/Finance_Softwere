import { NextResponse } from 'next/server';
import { okResponse } from '@/lib/api/response';
import { getSessionFromCookies } from '@/lib/security/session';
import { listAlertsForWorkspace } from '@/lib/services/alert-service';
import { getAlertsPayload } from '@/lib/mock/repositories/alerts.repository';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session?.workspaceId) {
    return NextResponse.json(okResponse(getAlertsPayload(), { source: 'mock', notices: ['Workspace session unavailable, showing demo alerts.'] }));
  }
  const alerts = await listAlertsForWorkspace(session.workspaceId);
  const payload = {
    headline: 'Operational alerts for the active workspace.',
    unread: alerts.filter((item) => item.status !== 'CLOSED').length,
    items: alerts.map((item) => ({ id: item.id, title: item.title, detail: item.message, severity: item.severity as 'high' | 'medium' | 'low', area: item.type, action: 'Review alert' }))
  };
  return NextResponse.json(okResponse(payload));
}
