import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';

type AuditInput = {
  workspaceId?: string | null;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeJson?: unknown;
  afterJson?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function writeAuditLog(input: AuditInput) {
  if (isDatabaseConfigured()) {
    await prisma.auditLog.create({
      data: {
        workspaceId: input.workspaceId ?? null,
        userId: input.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        beforeJson: input.beforeJson as never,
        afterJson: input.afterJson as never,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null
      }
    });
    return;
  }

  const store = await ensureRuntimeSeeded();
  store.audits.push({
    id: `audit_${Date.now()}`,
    workspaceId: input.workspaceId ?? null,
    userId: input.userId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    beforeJson: input.beforeJson,
    afterJson: input.afterJson,
    createdAt: new Date().toISOString(),
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null
  });
}
