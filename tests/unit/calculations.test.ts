import { describe, expect, it } from 'vitest';
import { normalizeTransaction } from '@/lib/calculations/transactions';
import { buildOpenLots } from '@/lib/calculations/tax-lots';
import { calculateAverageCost, calculateHoldingQuantity } from '@/lib/calculations/holdings';
import { calculateRealizedPnl } from '@/lib/calculations/pnl';

describe('holdings calculations', () => {
  const buy1 = normalizeTransaction({ id: '1', portfolioId: 'pf', accountId: 'a', securityId: 's', type: 'BUY', tradeDate: '2026-01-01', quantity: 10, price: 100, currency: 'USD', createdById: 'u' });
  const buy2 = normalizeTransaction({ id: '2', portfolioId: 'pf', accountId: 'a', securityId: 's', type: 'BUY', tradeDate: '2026-02-01', quantity: 10, price: 120, currency: 'USD', createdById: 'u' });
  const sell = normalizeTransaction({ id: '3', portfolioId: 'pf', accountId: 'a', securityId: 's', type: 'SELL', tradeDate: '2026-03-01', quantity: 5, price: 150, grossAmount: 750, currency: 'USD', createdById: 'u' });

  it('calculates holding quantity', () => {
    expect(calculateHoldingQuantity([buy1, buy2, sell]).toNumber()).toBe(15);
  });

  it('builds open lots and average cost', () => {
    const openLots = buildOpenLots([buy1, buy2, sell]);
    expect(openLots.length).toBeGreaterThan(0);
    expect(calculateAverageCost(openLots).toNumber()).toBeGreaterThan(0);
  });

  it('calculates realized pnl', () => {
    const realized = calculateRealizedPnl([buy1, buy2, sell]);
    expect(realized.toNumber()).toBeGreaterThan(0);
  });
});
