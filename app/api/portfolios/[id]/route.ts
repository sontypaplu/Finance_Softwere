import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/security/session';
import { okResponse } from '@/lib/api/response';
import { updatePortfolioSchema } from '@/lib/validation/portfolio';
import { deletePortfolio, updatePortfolio } from '@/lib/services/portfolio-service';
import { writeAuditLog } from '@/lib/audit/audit-log';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json();
  const parsed = updatePortfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid portfolio update.', errors: parsed.error.flatten() }, { status: 422 });
  }
  try {
    const portfolio = await updatePortfolio(id, parsed.data);
    await writeAuditLog({ workspaceId: session.workspaceId, userId: session.sub, action: 'portfolio.update', entityType: 'Portfolio', entityId: id, afterJson: portfolio });
    return NextResponse.json(okResponse({ item: portfolio }));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to update portfolio.' }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const result = await deletePortfolio(id);
    await writeAuditLog({ workspaceId: session.workspaceId, userId: session.sub, action: 'portfolio.delete', entityType: 'Portfolio', entityId: id });
    return NextResponse.json(okResponse(result));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to delete portfolio.' }, { status: 404 });
  }
}
