import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';

export async function listAlertsForWorkspace(workspaceId: string) {
  if (isDatabaseConfigured()) {
    return prisma.alert.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } });
  }
  const store = await ensureRuntimeSeeded();
  return store.alerts.filter((alert) => alert.workspaceId === workspaceId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
