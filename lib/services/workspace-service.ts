import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';

export async function getWorkspaceForUser(userId: string) {
  if (isDatabaseConfigured()) {
    const membership = await prisma.workspaceMember.findFirst({ where: { userId }, include: { workspace: true } });
    return membership?.workspace || null;
  }
  const store = await ensureRuntimeSeeded();
  const membership = store.workspaceMembers.find((item) => item.userId === userId);
  return membership ? store.workspaces.find((workspace) => workspace.id === membership.workspaceId) || null : null;
}

export async function createWorkspaceForUser(userId: string, name: string) {
  if (isDatabaseConfigured()) {
    return prisma.workspace.create({
      data: {
        name,
        ownerId: userId,
        members: { create: { userId, role: 'OWNER' } }
      }
    });
  }
  const store = await ensureRuntimeSeeded();
  const workspace = { id: `ws_${nanoid(10)}`, name, ownerId: userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.workspaces.push(workspace);
  store.workspaceMembers.push({ userId, workspaceId: workspace.id, role: 'OWNER' });
  return workspace;
}
