import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { okResponse } from '@/lib/api/response';
import { createPortfolioSchema } from '@/lib/validation/portfolio';
import { createPortfolio, listPortfolios } from '@/lib/services/portfolio-service';
import { writeAuditLog } from '@/lib/audit/audit-log';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const portfolios = await listPortfolios(session.workspaceId || '');
  return NextResponse.json(okResponse({ items: portfolios }, { notices: ['API-backed portfolio list. Local storage may still act as offline fallback in the UI.'] }));
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const parsed = createPortfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid portfolio input.', errors: parsed.error.flatten() }, { status: 422 });
  }
  try {
    const portfolio = await createPortfolio(session.workspaceId || '', parsed.data);
    await writeAuditLog({ workspaceId: session.workspaceId, userId: session.sub, action: 'portfolio.create', entityType: 'Portfolio', entityId: portfolio.id, afterJson: portfolio });
    return NextResponse.json(okResponse({ item: portfolio }));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to create portfolio.' }, { status: 409 });
  }
}
