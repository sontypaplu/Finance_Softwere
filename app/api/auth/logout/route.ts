import { NextResponse } from 'next/server';
import { clearSessionCookie, getRequestContext, getSessionFromCookies } from '@/lib/security/session';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { okResponse } from '@/lib/api/response';

export async function POST() {
  const session = await getSessionFromCookies();
  const context = await getRequestContext();
  await clearSessionCookie();
  await writeAuditLog({ workspaceId: session?.workspaceId, userId: session?.sub, action: 'auth.logout', entityType: 'Session', entityId: session?.sessionId, ipAddress: context.ipAddress, userAgent: context.userAgent });
  return NextResponse.json(okResponse({ success: true }));
}
