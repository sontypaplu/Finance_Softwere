import { z } from 'zod';

const decimalField = z.union([z.string(), z.number(), z.null(), z.undefined()]).transform((value) => {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
});

export const transactionCreateSchema = z.object({
  portfolioId: z.string().min(1),
  accountId: z.string().min(1),
  securityId: z.string().optional().nullable(),
  type: z.enum(['BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'FEE', 'TAX', 'DEPOSIT', 'WITHDRAWAL', 'SPLIT', 'BONUS', 'Buy', 'Sell', 'Dividend', 'Interest', 'Fee', 'Tax', 'Deposit', 'Withdrawal', 'Split', 'Bonus']).transform((value) => value.toUpperCase() as 'BUY' | 'SELL' | 'DIVIDEND' | 'INTEREST' | 'FEE' | 'TAX' | 'DEPOSIT' | 'WITHDRAWAL' | 'SPLIT' | 'BONUS'),
  tradeDate: z.string().min(1),
  settlementDate: z.string().optional().nullable(),
  quantity: decimalField,
  price: decimalField,
  grossAmount: decimalField,
  fees: decimalField.default(0),
  taxes: decimalField.default(0),
  netAmount: decimalField,
  currency: z.string().trim().min(3).max(3),
  fxRateToBase: decimalField.default(1),
  notes: z.string().max(2000).optional().nullable(),
  status: z.enum(['DRAFT', 'POSTED']).default('DRAFT')
}).superRefine((value, ctx) => {
  const incomeTypes = new Set(['DIVIDEND', 'INTEREST']);
  const tradeTypes = new Set(['BUY', 'SELL']);

  if (tradeTypes.has(value.type)) {
    if (!value.securityId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['securityId'], message: `${value.type} requires a security.` });
    if (!value.quantity || value.quantity <= 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['quantity'], message: `${value.type} requires a positive quantity.` });
    if (!value.price || value.price <= 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['price'], message: `${value.type} requires a positive price.` });
  }

  if (incomeTypes.has(value.type)) {
    if (!value.grossAmount || value.grossAmount <= 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['grossAmount'], message: `${value.type} requires a positive amount.` });
  }
});
