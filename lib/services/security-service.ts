import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ConflictError } from '@/lib/api/errors';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';

export async function listSecurities() {
  if (isDatabaseConfigured()) {
    return prisma.security.findMany({ orderBy: { symbol: 'asc' } });
  }
  const store = await ensureRuntimeSeeded();
  return store.securities;
}

export async function findSecurityBySymbol(symbol: string) {
  const normalized = symbol.toUpperCase();
  const candidates = Array.from(new Set([normalized, normalized.replace(/\.NS$/i, ''), `${normalized}.NS`]));
  if (isDatabaseConfigured()) {
    return prisma.security.findFirst({ where: { symbol: { in: candidates } } });
  }
  const store = await ensureRuntimeSeeded();
  return store.securities.find((item) => candidates.includes(item.symbol.toUpperCase())) || null;
}

export async function findSecurityById(securityId: string) {
  if (isDatabaseConfigured()) {
    return prisma.security.findUnique({ where: { id: securityId } });
  }
  const store = await ensureRuntimeSeeded();
  return store.securities.find((item) => item.id === securityId) || null;
}

export async function createSecurity(input: { symbol: string; name: string; isin?: string; exchange?: string; assetClass: string; sector?: string; industry?: string; currency: string; country?: string }) {
  const existing = await findSecurityBySymbol(input.symbol);
  if (existing) throw new ConflictError('Security already exists.');
  if (isDatabaseConfigured()) {
    return prisma.security.create({ data: { ...input, symbol: input.symbol.toUpperCase() } });
  }
  const store = await ensureRuntimeSeeded();
  const security = { id: `sec_${nanoid(10)}`, ...input, symbol: input.symbol.toUpperCase() };
  store.securities.push(security);
  return security;
}
