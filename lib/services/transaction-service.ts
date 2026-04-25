import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/api/errors';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';
import { detectDuplicateTransaction, normalizeTransaction } from '@/lib/calculations/transactions';
import { buildOpenLots, matchSellFIFO } from '@/lib/calculations/tax-lots';
import { listAccountsByPortfolio } from '@/lib/services/account-service';
import { findSecurityById, findSecurityBySymbol, listSecurities } from '@/lib/services/security-service';
import { assertPortfolioInWorkspace } from '@/lib/services/portfolio-service';
import { assertAccountBelongsToPortfolio } from '@/lib/services/account-service';
import { ensureHistoricalSeries } from '@/lib/services/market-data-service';
import { rebuildHoldingLotsForPortfolio } from '@/lib/services/holding-service';
import { getRequestContext } from '@/lib/security/session';
import { writeAuditLog } from '@/lib/audit/audit-log';

function toIso(input: Date | string) {
  return input instanceof Date ? input.toISOString() : String(input);
}

function normalizeAmounts(input: {
  type: string;
  quantity?: number | null;
  price?: number | null;
  grossAmount?: number | null;
  fees?: number | null;
  taxes?: number | null;
  netAmount?: number | null;
}) {
  const quantity = Number(input.quantity ?? 0);
  const price = Number(input.price ?? 0);
  const fees = Number(input.fees ?? 0);
  const taxes = Number(input.taxes ?? 0);
  const explicitGross = input.grossAmount == null ? null : Number(input.grossAmount);
  const explicitNet = input.netAmount == null ? null : Number(input.netAmount);
  const impliedGross = quantity > 0 && price > 0 ? quantity * price : 0;
  const grossAmount = explicitGross && explicitGross > 0 ? explicitGross : impliedGross;

  let netAmount = explicitNet && explicitNet > 0 ? explicitNet : grossAmount;
  if (['BUY', 'FEE', 'TAX', 'WITHDRAWAL'].includes(input.type)) {
    netAmount = grossAmount + fees + taxes;
  } else if (['SELL', 'DIVIDEND', 'INTEREST', 'DEPOSIT'].includes(input.type)) {
    netAmount = grossAmount - fees - taxes;
  }

  return { grossAmount, fees, taxes, netAmount };
}

export async function listTransactionsByPortfolio(portfolioId: string) {
  if (isDatabaseConfigured()) {
    return prisma.transaction.findMany({ where: { portfolioId }, orderBy: [{ tradeDate: 'desc' }, { createdAt: 'desc' }] });
  }
  const store = await ensureRuntimeSeeded();
  return store.transactions.filter((row) => row.portfolioId === portfolioId).sort((a, b) => b.tradeDate.localeCompare(a.tradeDate));
}

export async function listAllTransactionsForWorkspacePortfolioIds(portfolioIds: string[]) {
  const all = await Promise.all(portfolioIds.map((id) => listTransactionsByPortfolio(id)));
  return all.flat();
}

export async function getTransactionConsoleData(portfolioId?: string) {
  const store = isDatabaseConfigured() ? null : await ensureRuntimeSeeded();
  const effectivePortfolioId = portfolioId || store?.portfolios[0]?.id;
  const portfolioAccounts = effectivePortfolioId ? await listAccountsByPortfolio(effectivePortfolioId) : (store?.accounts || []);
  const securities = await listSecurities();
  const recent = effectivePortfolioId ? await listTransactionsByPortfolio(effectivePortfolioId) : (store?.transactions || []);

  return {
    options: {
      accounts: portfolioAccounts.map((item) => item.name),
      brokers: Array.from(new Set(portfolioAccounts.map((item) => item.broker).filter(Boolean))) as string[],
      transactionTypes: ['BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'FEE', 'TAX', 'DEPOSIT', 'WITHDRAWAL', 'SPLIT', 'BONUS'],
      securities: securities.map((item) => ({ symbol: item.symbol, name: item.name, exchange: item.exchange || 'Exchange', assetClass: item.assetClass, currency: item.currency })),
      currencies: ['USD', 'INR', 'EUR'],
      strategies: ['Core Compounders', 'Tactical Growth', 'Income Sleeve', 'Defensive'],
      benchmarks: ['S&P 500', 'NASDAQ 100', 'NIFTY 50', 'Custom'],
      assetClasses: ['Equity', 'ETF', 'Bond', 'Commodity', 'Cash'],
      regions: ['US', 'India', 'Global', 'Europe']
    },
    suggestedDefaults: {
      account: portfolioAccounts[0]?.name || 'Growth Ledger',
      broker: portfolioAccounts[0]?.broker || 'Unassigned',
      currency: portfolioAccounts[0]?.currency || 'USD',
      transactionType: 'BUY',
      strategy: 'Core Compounders',
      region: 'US'
    },
    recent: recent.slice(0, 12).map((item) => ({
      id: item.id,
      date: item.tradeDate instanceof Date ? item.tradeDate.toISOString().slice(0, 10) : String(item.tradeDate).slice(0, 10),
      type: item.type,
      security: securities.find((sec) => sec.id === item.securityId)?.symbol || 'Cash',
      portfolio: effectivePortfolioId || item.portfolioId,
      account: portfolioAccounts.find((acct) => acct.id === item.accountId)?.name || item.accountId,
      amount: String(item.netAmount ?? item.grossAmount ?? 0),
      status: item.status
    })),
    templates: [
      { title: 'Equity purchase', subtitle: 'Capture broker, settlement, fees, taxes, and thesis notes.' },
      { title: 'Income booking', subtitle: 'Post dividends and interest with proper cashflow classification.' },
      { title: 'Cash movement', subtitle: 'Track deposits, withdrawals, and internal funding flows.' }
    ]
  };
}

export async function createTransaction(input: {
  workspaceId: string;
  portfolioId: string;
  accountId: string;
  securityId?: string | null;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'INTEREST' | 'FEE' | 'TAX' | 'DEPOSIT' | 'WITHDRAWAL' | 'SPLIT' | 'BONUS';
  tradeDate: string;
  settlementDate?: string | null;
  quantity?: number;
  price?: number;
  grossAmount?: number;
  fees?: number;
  taxes?: number;
  netAmount?: number;
  currency: string;
  fxRateToBase?: number;
  notes?: string | null;
  status: 'DRAFT' | 'POSTED';
  createdById: string;
}) {
  await assertPortfolioInWorkspace(input.portfolioId, input.workspaceId);
  await assertAccountBelongsToPortfolio(input.accountId, input.portfolioId);

  const normalizedMoney = normalizeAmounts(input);
  const existing = await listTransactionsByPortfolio(input.portfolioId);
  const duplicate = detectDuplicateTransaction(
    existing.filter((item) => item.status !== 'REVERSED').map((item) => ({
      portfolioId: item.portfolioId,
      accountId: item.accountId,
      securityId: item.securityId ?? null,
      type: item.type,
      tradeDate: item.tradeDate instanceof Date ? item.tradeDate.toISOString().slice(0, 10) : String(item.tradeDate).slice(0, 10),
      grossAmount: Number(item.grossAmount ?? 0)
    })),
    {
      portfolioId: input.portfolioId,
      accountId: input.accountId,
      securityId: input.securityId ?? null,
      type: input.type,
      tradeDate: input.tradeDate,
      grossAmount: normalizedMoney.grossAmount
    }
  );
  if (duplicate) {
    throw new ConflictError('Potential duplicate transaction detected.');
  }

  if (input.type === 'SELL' && input.securityId) {
    const portfolioTransactions = await listTransactionsByPortfolio(input.portfolioId);
    const securityRows = portfolioTransactions.filter((item) => item.securityId === input.securityId && item.status !== 'REVERSED' && (item.type === 'BUY' || item.type === 'SELL'));
    const normalized = securityRows.map((row) => normalizeTransaction({
      ...row,
      tradeDate: toIso(row.tradeDate),
      settlementDate: row.settlementDate ? toIso(row.settlementDate) : null,
      createdAt: toIso(row.createdAt),
      updatedAt: toIso(row.updatedAt)
    } as unknown as Record<string, unknown>));
    const openLots = buildOpenLots(normalized);
    const preview = normalizeTransaction({ ...input, ...normalizedMoney, id: 'preview', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() } as unknown as Record<string, unknown>);
    const { remaining } = matchSellFIFO(openLots, preview.quantity);
    if (remaining.gt(0)) {
      throw new ValidationError('SELL exceeds available quantity unless shorting is enabled.');
    }
  }

  if (isDatabaseConfigured()) {
    const transaction = await prisma.transaction.create({
      data: {
        portfolioId: input.portfolioId,
        accountId: input.accountId,
        securityId: input.securityId ?? null,
        type: input.type,
        tradeDate: new Date(input.tradeDate),
        settlementDate: input.settlementDate ? new Date(input.settlementDate) : null,
        quantity: input.quantity ?? null,
        price: input.price ?? null,
        grossAmount: normalizedMoney.grossAmount || null,
        fees: normalizedMoney.fees,
        taxes: normalizedMoney.taxes,
        netAmount: normalizedMoney.netAmount || null,
        currency: input.currency,
        fxRateToBase: input.fxRateToBase ?? 1,
        notes: input.notes ?? null,
        status: input.status,
        createdById: input.createdById
      }
    });

    if (input.securityId) {
      const security = await findSecurityById(input.securityId);
      if (security) {
        const providerSymbol = security.exchange?.toUpperCase().includes('NSE') && !security.symbol.toUpperCase().endsWith('.NS') ? `${security.symbol}.NS` : security.symbol;
        let providerNotice: string | null = null;
        try {
          await ensureHistoricalSeries(security.id, providerSymbol, '1y', '1d');
        } catch (error) {
          providerNotice = error instanceof Error ? error.message : 'Historical price sync failed.';
        }
        await rebuildHoldingLotsForPortfolio(input.portfolioId);
        if (providerNotice) {
          const context = await getRequestContext();
          await writeAuditLog({ workspaceId: input.workspaceId, userId: input.createdById, action: 'price-history.sync.notice', entityType: 'Security', entityId: security.id, afterJson: { providerNotice }, ipAddress: context.ipAddress, userAgent: context.userAgent });
        }
      }
    } else {
      await rebuildHoldingLotsForPortfolio(input.portfolioId);
    }

    return transaction;
  }

  const store = await ensureRuntimeSeeded();
  const transaction = {
    id: `txn_${nanoid(10)}`,
    ...input,
    ...normalizedMoney,
    securityId: input.securityId ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.transactions.unshift(transaction);
  return transaction;
}

export async function reverseTransaction(transactionId: string, userId: string) {
  if (isDatabaseConfigured()) {
    const row = await prisma.transaction.update({ where: { id: transactionId }, data: { status: 'REVERSED', updatedAt: new Date(), createdById: userId } });
    await rebuildHoldingLotsForPortfolio(row.portfolioId);
    return row;
  }
  const store = await ensureRuntimeSeeded();
  const row = store.transactions.find((item) => item.id === transactionId);
  if (!row) throw new NotFoundError('Transaction not found.');
  row.status = 'REVERSED';
  row.updatedAt = new Date().toISOString();
  return row;
}

export async function resolveSecurityIdFromClient(input: { securityId?: string | null; security?: string | null; symbol?: string | null }) {
  if (input.securityId) return input.securityId;
  const candidate = input.security || input.symbol;
  if (!candidate) return null;
  const matched = await findSecurityBySymbol(candidate);
  return matched?.id || null;
}
