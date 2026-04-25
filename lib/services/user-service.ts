import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';

export async function findUserByEmail(email: string) {
  if (isDatabaseConfigured()) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }
  const store = await ensureRuntimeSeeded();
  return store.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(userId: string) {
  if (isDatabaseConfigured()) {
    return prisma.user.findUnique({ where: { id: userId } });
  }
  const store = await ensureRuntimeSeeded();
  return store.users.find((user) => user.id === userId) || null;
}
