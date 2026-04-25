import Decimal from 'decimal.js';
import type { NormalizedTransaction } from '@/lib/calculations/transactions';
import { buildOpenLots } from '@/lib/calculations/tax-lots';

export function calculateHoldingQuantity(transactions: NormalizedTransaction[]) {
  return transactions.reduce((qty, transaction) => {
    if (transaction.type === 'BUY') return qty.plus(transaction.quantity);
    if (transaction.type === 'SELL') return qty.minus(transaction.quantity);
    return qty;
  }, new Decimal(0));
}

export function calculateAverageCost(openLots: ReturnType<typeof buildOpenLots>) {
  const totalQuantity = openLots.reduce((sum, lot) => sum.plus(lot.quantityOpen), new Decimal(0));
  if (totalQuantity.eq(0)) return new Decimal(0);
  const remainingCost = openLots.reduce((sum, lot) => sum.plus(lot.costBasis.div(lot.quantityOriginal).mul(lot.quantityOpen)), new Decimal(0));
  return remainingCost.div(totalQuantity);
}
