import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { getCurrentUserProfile } from '@/lib/services/auth-service';
import { okResponse } from '@/lib/api/response';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const user = await getCurrentUserProfile(session.sub);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(okResponse({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, session: { workspaceId: session.workspaceId, sessionId: session.sessionId } }));
}
