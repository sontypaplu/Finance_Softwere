'use client';

import type { ReactNode } from 'react';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { hasPermission } from '@/lib/permissions/check';
import type { AppPermission } from '@/lib/permissions/contracts';
import { EmptyState } from '@/components/enterprise/empty-state';

export function PermissionGate({ permission, children, fallbackTitle = 'Access unavailable' }: { permission: AppPermission; children: ReactNode; fallbackTitle?: string }) {
  const { session } = useDemoSession();
  if (!hasPermission(session, permission)) {
    return <EmptyState title={fallbackTitle} detail="This module is hidden by the current mock role. Switch the demo role in the session provider later to validate permission-aware visibility and UI gating." />;
  }
  return <>{children}</>;
}
