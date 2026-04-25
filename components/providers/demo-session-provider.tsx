'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { defaultDemoSession } from '@/lib/permissions/definitions';
import type { AppRole, DemoSession } from '@/lib/permissions/contracts';
import { roleDefinitions } from '@/lib/permissions/definitions';

const DemoSessionContext = createContext<{
  session: DemoSession;
  setRole: (role: AppRole) => void;
} | null>(null);

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<AppRole>(defaultDemoSession.role);

  const value = useMemo(() => {
    const roleDef = roleDefinitions[role];
    return {
      session: { ...defaultDemoSession, role, permissions: roleDef.permissions },
      setRole: (nextRole: AppRole) => setRoleState(nextRole)
    };
  }, [role]);

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) {
    throw new Error('useDemoSession must be used inside DemoSessionProvider');
  }
  return context;
}
