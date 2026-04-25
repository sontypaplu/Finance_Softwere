import { NextResponse } from 'next/server';
import { okResponse } from '@/lib/api/response';
import { getRequestContext, getSessionFromCookies } from '@/lib/security/session';
import { transactionCreateSchema } from '@/lib/validation/transaction';
import { createTransaction, getTransactionConsoleData, resolveSecurityIdFromClient } from '@/lib/services/transaction-service';
import { assertPortfolioInWorkspace } from '@/lib/services/portfolio-service';
import { listAccountsByPortfolio } from '@/lib/services/account-service';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { AppError } from '@/lib/api/errors';

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const portfolioId = searchParams.get('portfolioId') || undefined;

  try {
    if (portfolioId && session.workspaceId) {
      await assertPortfolioInWorkspace(portfolioId, session.workspaceId);
    }
    const data = await getTransactionConsoleData(portfolioId);
    return NextResponse.json(okResponse(data, { notices: ['Transactions read through service layer.'] }));
  } catch (error) {
    if (isDatabaseConfigured()) {
      return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to load transactions.' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unable to load transactions.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session?.workspaceId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const context = await getRequestContext();

  const portfolioId = String(body.portfolioId || '');
  const accounts = await listAccountsByPortfolio(portfolioId);
  const accountId = body.accountId || accounts.find((item) => item.id === body.account || item.name === body.account)?.id;
  const securityId = await resolveSecurityIdFromClient({ securityId: body.securityId, security: body.security, symbol: body.symbol });

  const candidate = {
    portfolioId,
    accountId,
    securityId,
    type: String(body.type || body.transactionType || '').toUpperCase(),
    tradeDate: String(body.tradeDate || ''),
    settlementDate: body.settlementDate ? String(body.settlementDate) : null,
    quantity: body.quantity,
    price: body.price,
    grossAmount: body.grossAmount,
    fees: body.fees ?? body.otherCharges,
    taxes: body.taxes,
    netAmount: body.netAmount,
    currency: String(body.currency || 'USD').toUpperCase(),
    fxRateToBase: body.fxRateToBase || body.fxRate || 1,
    notes: body.notes || null,
    status: String(body.status || 'POSTED').toUpperCase()
  };

  const parsed = transactionCreateSchema.safeParse(candidate);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Transaction validation failed.', errors: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const transaction = await createTransaction({ ...parsed.data, workspaceId: session.workspaceId, createdById: session.sub });
    await writeAuditLog({ workspaceId: session.workspaceId, userId: session.sub, action: 'transaction.create', entityType: 'Transaction', entityId: transaction.id, afterJson: transaction, ipAddress: context.ipAddress, userAgent: context.userAgent });
    return NextResponse.json(okResponse({ message: parsed.data.status === 'DRAFT' ? 'Transaction saved as draft.' : 'Transaction posted successfully.', transactionId: transaction.id }));
  } catch (error) {
    const status = error instanceof AppError ? error.status : 400;
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to save transaction.' }, { status });
  }
}
