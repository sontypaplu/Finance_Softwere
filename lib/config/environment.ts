import type { DataSourceKind, EnvironmentBadge } from '@/lib/contracts/api';

export const appEnvironment: EnvironmentBadge = process.env.NODE_ENV === 'production' ? 'production' : 'demo';
export const appRequestSource: DataSourceKind = process.env.DATABASE_URL ? 'service' : 'mock';
export const demoLastUpdatedLabel = process.env.DATABASE_URL ? 'Database-backed service layer' : 'Mock service layer · database not configured';

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function isDatabaseMode() {
  return isDatabaseConfigured();
}
