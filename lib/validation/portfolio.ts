import { z } from 'zod';

export const createPortfolioSchema = z.object({
  name: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(1000).optional().default(''),
  baseCurrency: z.string().trim().min(3).max(3).default('USD')
});

export const updatePortfolioSchema = createPortfolioSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided.'
});
