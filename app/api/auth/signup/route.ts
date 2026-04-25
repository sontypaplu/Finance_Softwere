import { NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validation/auth';
import { signupUser } from '@/lib/services/auth-service';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getRequestContext } from '@/lib/security/session';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { okResponse } from '@/lib/api/response';

export async function POST(request: Request) {
  const ipKey = request.headers.get('x-forwarded-for') || 'local';
  const limiter = checkRateLimit(`signup:${ipKey}`, 5, 60_000);
  if (!limiter.allowed) {
    return NextResponse.json({ message: 'Too many signup attempts. Please try again later.' }, { status: 429 });
  }

  const body = await request.json();
  const parsed = signupSchema.safeParse(body);
  const context = await getRequestContext();

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid signup input.', errors: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const { user, workspace } = await signupUser(parsed.data);
    await writeAuditLog({ workspaceId: workspace.id, userId: user.id, action: 'auth.signup', entityType: 'User', entityId: user.id, afterJson: { email: user.email, workspaceId: workspace.id }, ipAddress: context.ipAddress, userAgent: context.userAgent });
    return NextResponse.json(okResponse({ success: true, stagedVerification: true, workspaceId: workspace.id }, { notices: ['Verification delivery remains demo-only until email provider integration.'] }));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to create account.' }, { status: 409 });
  }
}
