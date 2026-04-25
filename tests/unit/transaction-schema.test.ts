import { describe, expect, it } from 'vitest';
import { transactionCreateSchema } from '@/lib/validation/transaction';

describe('transactionCreateSchema', () => {
  it('accepts a valid BUY transaction', () => {
    const parsed = transactionCreateSchema.safeParse({
      portfolioId: 'pf_1',
      accountId: 'acct_1',
      securityId: 'sec_1',
      type: 'BUY',
      tradeDate: '2026-04-24',
      quantity: 10,
      price: 100,
      currency: 'USD',
      status: 'POSTED'
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects SELL without quantity', () => {
    const parsed = transactionCreateSchema.safeParse({
      portfolioId: 'pf_1',
      accountId: 'acct_1',
      securityId: 'sec_1',
      type: 'SELL',
      tradeDate: '2026-04-24',
      price: 100,
      currency: 'USD',
      status: 'POSTED'
    });
    expect(parsed.success).toBe(false);
  });
});
