import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestContext, getSessionFromCookies } from '@/lib/security/session';
import { createSecurity, listSecurities } from '@/lib/services/security-service';
import { okResponse } from '@/lib/api/response';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { AppError } from '@/lib/api/errors';

const securitySchema = z.object({
  symbol: z.string().trim().min(1),
  name: z.string().trim().min(1),
  isin: z.string().trim().optional().nullable(),
  exchange: z.string().trim().optional().nullable(),
  assetClass: z.string().trim().min(1),
  sector: z.string().trim().optional().nullable(),
  industry: z.string().trim().optional().nullable(),
  currency: z.string().trim().min(3).max(3),
  country: z.string().trim().optional().nullable(),
});

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const items = await listSecurities();
  return NextResponse.json(okResponse({ items }));
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session?.workspaceId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const parsed = securitySchema.safeParse(body);
  const context = await getRequestContext();
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid security input.', errors: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const security = await createSecurity({
      symbol: parsed.data.symbol,
      name: parsed.data.name,
      isin: parsed.data.isin || undefined,
      exchange: parsed.data.exchange || undefined,
      assetClass: parsed.data.assetClass,
      sector: parsed.data.sector || undefined,
      industry: parsed.data.industry || undefined,
      currency: parsed.data.currency.toUpperCase(),
      country: parsed.data.country || undefined,
    });
    await writeAuditLog({ workspaceId: session.workspaceId, userId: session.sub, action: 'security.create', entityType: 'Security', entityId: security.id, afterJson: security, ipAddress: context.ipAddress, userAgent: context.userAgent });
    return NextResponse.json(okResponse({ item: security }));
  } catch (error) {
    const status = error instanceof AppError ? error.status : 400;
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to create security.' }, { status });
  }
}
