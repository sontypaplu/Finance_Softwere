import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';
import { NotFoundError } from '@/lib/api/errors';

export async function listAccountsByPortfolio(portfolioId: string) {
  if (isDatabaseConfigured()) {
    return prisma.account.findMany({ where: { portfolioId }, orderBy: { createdAt: 'asc' } });
  }
  const store = await ensureRuntimeSeeded();
  return store.accounts.filter((account) => account.portfolioId === portfolioId);
}

export async function getAccountById(accountId: string) {
  if (isDatabaseConfigured()) {
    return prisma.account.findUnique({ where: { id: accountId } });
  }
  const store = await ensureRuntimeSeeded();
  return store.accounts.find((account) => account.id === accountId) || null;
}

export async function ensureDefaultAccountForPortfolio(input: { portfolioId: string; portfolioName: string; currency: string }) {
  const existing = await listAccountsByPortfolio(input.portfolioId);
  if (existing.length > 0) return existing[0];
  if (isDatabaseConfigured()) {
    return prisma.account.create({
      data: {
        portfolioId: input.portfolioId,
        name: `${input.portfolioName} Main Account`,
        broker: 'Unassigned',
        accountType: 'Brokerage',
        currency: input.currency
      }
    });
  }
  const store = await ensureRuntimeSeeded();
  const account = { id: `acct_${nanoid(10)}`, portfolioId: input.portfolioId, name: `${input.portfolioName} Main Account`, broker: 'Unassigned', accountType: 'Brokerage', currency: input.currency, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.accounts.push(account);
  return account;
}

export async function assertAccountBelongsToPortfolio(accountId: string, portfolioId: string) {
  const account = await getAccountById(accountId);
  if (!account || account.portfolioId !== portfolioId) {
    throw new NotFoundError('Selected account does not belong to the selected portfolio.');
  }
  return account;
}
