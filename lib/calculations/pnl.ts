import Decimal from 'decimal.js';
import type { NormalizedTransaction } from '@/lib/calculations/transactions';
import { buildOpenLots, matchSellFIFO } from '@/lib/calculations/tax-lots';

export function calculateCashBalance(transactions: NormalizedTransaction[]) {
  return transactions.reduce((cash, transaction) => {
    switch (transaction.type) {
      case 'DEPOSIT':
      case 'DIVIDEND':
      case 'INTEREST':
      case 'SELL':
        return cash.plus(transaction.grossAmount.minus(transaction.fees).minus(transaction.taxes));
      case 'BUY':
      case 'WITHDRAWAL':
      case 'FEE':
      case 'TAX':
        return cash.minus(transaction.grossAmount.plus(transaction.fees).plus(transaction.taxes));
      default:
        return cash;
    }
  }, new Decimal(0));
}

export function calculateRealizedPnl(transactions: NormalizedTransaction[]) {
  const buySell = transactions.filter((item) => item.securityId && (item.type === 'BUY' || item.type === 'SELL'));
  const lots = buildOpenLots(buySell.filter((item) => item.type === 'BUY'));
  let realized = new Decimal(0);

  for (const transaction of buySell.filter((item) => item.type === 'SELL')) {
    const { matches } = matchSellFIFO(lots, transaction.quantity);
    const proceeds = transaction.grossAmount.minus(transaction.fees).minus(transaction.taxes);
    const realizedCost = matches.reduce((sum, item) => sum.plus(item.realizedCost), new Decimal(0));
    realized = realized.plus(proceeds.minus(realizedCost));
  }

  return realized;
}

export function calculateUnrealizedPnl(openLots: ReturnType<typeof buildOpenLots>, currentPrice: number) {
  const price = new Decimal(currentPrice);
  return openLots.reduce((sum, lot) => {
    const marketValue = price.mul(lot.quantityOpen);
    const remainingCost = lot.costBasis.div(lot.quantityOriginal).mul(lot.quantityOpen);
    return sum.plus(marketValue.minus(remainingCost));
  }, new Decimal(0));
}
