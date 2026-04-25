import { alertsSeed } from '@/lib/data/terminal-ops-seed';
import type { AlertsPayload } from '@/features/alerts/contracts';

export function getAlertsPayload(): AlertsPayload {
  return alertsSeed as AlertsPayload;
}
