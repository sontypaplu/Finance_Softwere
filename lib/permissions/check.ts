import type { AppPermission, DemoSession } from '@/lib/permissions/contracts';

export function hasPermission(session: Pick<DemoSession, 'permissions'> | null | undefined, permission?: AppPermission) {
  if (!permission) return true;
  if (!session) return false;
  return session.permissions.includes(permission);
}

export function hasAnyPermission(session: Pick<DemoSession, 'permissions'> | null | undefined, permissions: AppPermission[]) {
  if (!session) return false;
  return permissions.some((permission) => session.permissions.includes(permission));
}
