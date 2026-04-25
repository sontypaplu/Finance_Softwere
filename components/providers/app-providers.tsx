'use client';

import { ReactNode } from 'react';
import { PortfolioWorkspaceProvider } from '@/components/terminal/portfolio-workspace-provider';
import { DemoSessionProvider } from '@/components/providers/demo-session-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DemoSessionProvider>
      <PortfolioWorkspaceProvider>{children}</PortfolioWorkspaceProvider>
    </DemoSessionProvider>
  );
}
