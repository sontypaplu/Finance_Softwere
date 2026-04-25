import Decimal from 'decimal.js';

export type NormalizedTransaction = {
  id: string;
  portfolioId: string;
  accountId: string;
  securityId?: string | null;
  type: string;
  tradeDate: string;
  settlementDate?: string | null;
  quantity: Decimal;
  price: Decimal;
  grossAmount: Decimal;
  fees: Decimal;
  taxes: Decimal;
  netAmount: Decimal;
  currency: string;
  fxRateToBase: Decimal;
  notes?: string | null;
  status: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

export function normalizeTransaction(input: Record<string, unknown>): NormalizedTransaction {
  const quantity = new Decimal(Number(input.quantity || 0));
  const price = new Decimal(Number(input.price || 0));
  const fees = new Decimal(Number(input.fees || 0));
  const taxes = new Decimal(Number(input.taxes || 0));
  const grossAmount = input.grossAmount !== undefined && input.grossAmount !== null && input.grossAmount !== ''
    ? new Decimal(Number(input.grossAmount || 0))
    : quantity.mul(price);
  const netAmount = input.netAmount !== undefined && input.netAmount !== null && input.netAmount !== ''
    ? new Decimal(Number(input.netAmount || 0))
    : grossAmount.plus(fees).plus(taxes);

  return {
    id: String(input.id || ''),
    portfolioId: String(input.portfolioId || ''),
    accountId: String(input.accountId || ''),
    securityId: input.securityId ? String(input.securityId) : null,
    type: String(input.type || ''),
    tradeDate: String(input.tradeDate || ''),
    settlementDate: input.settlementDate ? String(input.settlementDate) : null,
    quantity,
    price,
    grossAmount,
    fees,
    taxes,
    netAmount,
    currency: String(input.currency || 'USD'),
    fxRateToBase: new Decimal(Number(input.fxRateToBase || 1)),
    notes: input.notes ? String(input.notes) : null,
    status: String(input.status || 'DRAFT'),
    createdById: String(input.createdById || ''),
    createdAt: String(input.createdAt || new Date().toISOString()),
    updatedAt: String(input.updatedAt || new Date().toISOString())
  };
}

export function detectDuplicateTransaction<T extends { portfolioId: string; accountId: string; securityId?: string | null; type: string; tradeDate: string; grossAmount?: number | null }>(existing: T[], candidate: T) {
  return existing.find((item) =>
    item.portfolioId === candidate.portfolioId &&
    item.accountId === candidate.accountId &&
    (item.securityId || null) === (candidate.securityId || null) &&
    item.type === candidate.type &&
    item.tradeDate === candidate.tradeDate &&
    Number(item.grossAmount || 0) === Number(candidate.grossAmount || 0)
  ) || null;
}
