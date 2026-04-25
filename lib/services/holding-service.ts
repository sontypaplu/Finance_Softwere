import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { listTransactionsByPortfolio } from '@/lib/services/transaction-service';
import { normalizeTransaction } from '@/lib/calculations/transactions';
import { buildOpenLots } from '@/lib/calculations/tax-lots';
import { calculateAverageCost, calculateHoldingQuantity } from '@/lib/calculations/holdings';
import { calculateRealizedPnl } from '@/lib/calculations/pnl';

export async function rebuildHoldingLotsForPortfolio(portfolioId: string) {
  const transactions = await listTransactionsByPortfolio(portfolioId);
  const grouped = new Map<string, typeof transactions>();

  for (const transaction of transactions) {
    if (!transaction.securityId || transaction.status === 'REVERSED') continue;
    const key = `${transaction.accountId}:${transaction.securityId}`;
    grouped.set(key, [...(grouped.get(key) || []), transaction]);
  }

  const lots = Array.from(grouped.entries()).flatMap(([key, rows]) => {
    const [accountId, securityId] = key.split(':');
    const normalized = rows
      .map((row) => normalizeTransaction(row as unknown as Record<string, unknown>))
      .filter((row) => row.type === 'BUY' || row.type === 'SELL');
    const openLots = buildOpenLots(normalized);
    return openLots.map((lot) => ({
      portfolioId,
      accountId,
      securityId,
      acquisitionDate: new Date(lot.acquisitionDate),
      quantityOpen: Number(lot.quantityOpen),
      quantityOriginal: Number(lot.quantityOriginal),
      costBasis: Number(lot.costBasis),
      currency: rows[0]?.currency || 'USD'
    }));
  });

  if (isDatabaseConfigured()) {
    await prisma.$transaction(async (tx) => {
      await tx.holdingLot.deleteMany({ where: { portfolioId } });
      if (lots.length) {
        await tx.holdingLot.createMany({ data: lots });
      }
    });
  }

  return lots;
}

export async function getPortfolioHoldingsSummary(portfolioId: string) {
  const transactions = await listTransactionsByPortfolio(portfolioId);
  const grouped = new Map<string, typeof transactions>();

  for (const transaction of transactions) {
    if (!transaction.securityId) continue;
    const key = transaction.securityId;
    grouped.set(key, [...(grouped.get(key) || []), transaction]);
  }

  return Array.from(grouped.entries()).map(([securityId, rows]) => {
    const normalized = rows.map((row) => normalizeTransaction(row as unknown as Record<string, unknown>));
    const openLots = buildOpenLots(normalized.filter((row) => row.type === 'BUY' || row.type === 'SELL'));
    return {
      securityId,
      quantity: calculateHoldingQuantity(normalized).toNumber(),
      averageCost: calculateAverageCost(openLots).toNumber(),
      realizedPnl: calculateRealizedPnl(normalized).toNumber(),
      lotCount: openLots.length
    };
  });
}
