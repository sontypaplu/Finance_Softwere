import { overviewSeed } from '@/lib/data/market-seed';
import type { OverviewPayload } from '@/features/overview/contracts';

export function getOverviewPayload(): OverviewPayload {
  return overviewSeed as OverviewPayload;
}
