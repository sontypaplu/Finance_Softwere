import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/auth';
import { loginUser } from '@/lib/services/auth-service';
import { clearSessionCookie, createSessionToken, getRequestContext, setSessionCookie } from '@/lib/security/session';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { okResponse } from '@/lib/api/response';

export async function POST(request: Request) {
  const ipKey = request.headers.get('x-forwarded-for') || 'local';
  const limiter = checkRateLimit(`login:${ipKey}`, 10, 60_000);
  if (!limiter.allowed) {
    return NextResponse.json({ message: 'Too many login attempts. Please try again later.' }, { status: 429 });
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  const context = await getRequestContext();

  if (!parsed.success) {
    await writeAuditLog({ action: 'auth.login.failed', entityType: 'User', beforeJson: { email: typeof body?.email === 'string' ? body.email : '' }, afterJson: { errors: parsed.error.flatten() }, ipAddress: context.ipAddress, userAgent: context.userAgent });
    return NextResponse.json({ message: 'Invalid login input.', errors: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const { user, workspaceId } = await loginUser(parsed.data);
    const token = await createSessionToken({ userId: user.id, email: user.email, role: user.role, workspaceId });
    await setSessionCookie(token);
    await writeAuditLog({ workspaceId, userId: user.id, action: 'auth.login.success', entityType: 'User', entityId: user.id, afterJson: { email: user.email }, ipAddress: context.ipAddress, userAgent: context.userAgent });
    return NextResponse.json(okResponse({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { notices: ['Authentication uses secure hashed passwords.'] }));
  } catch (error) {
    await clearSessionCookie();
    await writeAuditLog({ action: 'auth.login.failed', entityType: 'User', beforeJson: { email: parsed.data.email }, afterJson: { error: error instanceof Error ? error.message : 'Unknown error' }, ipAddress: context.ipAddress, userAgent: context.userAgent });
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to sign in.' }, { status: 401 });
  }
}
