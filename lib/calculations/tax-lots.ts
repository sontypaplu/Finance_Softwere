import Decimal from 'decimal.js';
import type { NormalizedTransaction } from '@/lib/calculations/transactions';

export type HoldingLotState = {
  acquisitionDate: string;
  quantityOriginal: Decimal;
  quantityOpen: Decimal;
  costBasis: Decimal;
};

export type SellMatch = {
  acquisitionDate: string;
  quantityClosed: Decimal;
  unitCost: Decimal;
  realizedCost: Decimal;
};

export function buildOpenLots(transactions: NormalizedTransaction[]) {
  const lots: HoldingLotState[] = [];

  for (const transaction of transactions.sort((a, b) => a.tradeDate.localeCompare(b.tradeDate))) {
    if (!transaction.securityId) continue;
    if (transaction.type === 'BUY') {
      const totalCost = transaction.grossAmount.plus(transaction.fees).plus(transaction.taxes);
      lots.push({
        acquisitionDate: transaction.tradeDate,
        quantityOriginal: transaction.quantity,
        quantityOpen: transaction.quantity,
        costBasis: totalCost
      });
    }

    if (transaction.type === 'SELL') {
      let remaining = transaction.quantity;
      for (const lot of lots) {
        if (remaining.lte(0)) break;
        if (lot.quantityOpen.lte(0)) continue;
        const matched = Decimal.min(lot.quantityOpen, remaining);
        lot.quantityOpen = lot.quantityOpen.minus(matched);
        remaining = remaining.minus(matched);
      }
    }
  }

  return lots.filter((lot) => lot.quantityOpen.gt(0));
}

export function matchSellFIFO(lots: HoldingLotState[], sellQuantity: Decimal): { matches: SellMatch[]; remaining: Decimal } {
  let remaining = sellQuantity;
  const matches: SellMatch[] = [];

  for (const lot of lots) {
    if (remaining.lte(0)) break;
    if (lot.quantityOpen.lte(0)) continue;
    const matched = Decimal.min(lot.quantityOpen, remaining);
    const unitCost = lot.costBasis.div(lot.quantityOriginal);
    matches.push({
      acquisitionDate: lot.acquisitionDate,
      quantityClosed: matched,
      unitCost,
      realizedCost: unitCost.mul(matched)
    });
    lot.quantityOpen = lot.quantityOpen.minus(matched);
    remaining = remaining.minus(matched);
  }

  return { matches, remaining };
}
