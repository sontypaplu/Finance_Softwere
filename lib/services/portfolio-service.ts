import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ConflictError, NotFoundError } from '@/lib/api/errors';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';
import { ensureDefaultAccountForPortfolio } from '@/lib/services/account-service';

const PORTFOLIO_LIMIT = 2;

export async function listPortfolios(workspaceId: string) {
  if (isDatabaseConfigured()) {
    return prisma.portfolio.findMany({ where: { workspaceId }, orderBy: { createdAt: 'asc' } });
  }
  const store = await ensureRuntimeSeeded();
  return store.portfolios.filter((portfolio) => portfolio.workspaceId === workspaceId);
}

export async function getPortfolioById(portfolioId: string) {
  if (isDatabaseConfigured()) {
    return prisma.portfolio.findUnique({ where: { id: portfolioId } });
  }
  const store = await ensureRuntimeSeeded();
  return store.portfolios.find((portfolio) => portfolio.id === portfolioId) || null;
}

export async function assertPortfolioInWorkspace(portfolioId: string, workspaceId: string) {
  const portfolio = await getPortfolioById(portfolioId);
  if (!portfolio || portfolio.workspaceId !== workspaceId) {
    throw new NotFoundError('Selected portfolio does not belong to the current workspace.');
  }
  return portfolio;
}

export async function createPortfolio(workspaceId: string, input: { name: string; notes?: string; baseCurrency?: string }) {
  const existing = await listPortfolios(workspaceId);
  if (existing.length >= PORTFOLIO_LIMIT) throw new ConflictError(`Maximum ${PORTFOLIO_LIMIT} portfolios allowed right now.`);

  if (isDatabaseConfigured()) {
    const portfolio = await prisma.portfolio.create({
      data: {
        workspaceId,
        name: input.name,
        notes: input.notes,
        baseCurrency: input.baseCurrency || 'USD'
      }
    });
    await ensureDefaultAccountForPortfolio({ portfolioId: portfolio.id, portfolioName: portfolio.name, currency: portfolio.baseCurrency });
    return portfolio;
  }

  const store = await ensureRuntimeSeeded();
  const portfolio = {
    id: `pf_${nanoid(10)}`,
    workspaceId,
    name: input.name,
    baseCurrency: input.baseCurrency || 'USD',
    notes: input.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.portfolios.push(portfolio);
  store.accounts.push({ id: `acct_${nanoid(10)}`, portfolioId: portfolio.id, name: `${input.name} Main Account`, broker: 'Unassigned', accountType: 'Brokerage', currency: portfolio.baseCurrency, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return portfolio;
}

export async function updatePortfolio(portfolioId: string, input: { name?: string; notes?: string; baseCurrency?: string }) {
  if (isDatabaseConfigured()) {
    return prisma.portfolio.update({ where: { id: portfolioId }, data: input });
  }
  const store = await ensureRuntimeSeeded();
  const index = store.portfolios.findIndex((item) => item.id === portfolioId);
  if (index < 0) throw new NotFoundError('Portfolio not found.');
  store.portfolios[index] = { ...store.portfolios[index], ...input, updatedAt: new Date().toISOString() };
  return store.portfolios[index];
}

export async function deletePortfolio(portfolioId: string) {
  if (isDatabaseConfigured()) {
    await prisma.portfolio.delete({ where: { id: portfolioId } });
    return { deleted: true };
  }
  const store = await ensureRuntimeSeeded();
  const next = store.portfolios.filter((item) => item.id !== portfolioId);
  if (next.length === store.portfolios.length) throw new NotFoundError('Portfolio not found.');
  store.portfolios = next;
  return { deleted: true };
}
