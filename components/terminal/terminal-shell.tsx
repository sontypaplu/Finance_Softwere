'use client';

import { ReactNode, useEffect, useState } from 'react';
import { CalendarRange } from 'lucide-react';
import { HoverDropdown, type DropdownItem } from '@/components/terminal/hover-dropdown';
import { SettingsMenu } from '@/components/terminal/settings-menu';
import { Sidebar } from '@/components/terminal/sidebar';
import { TopTicker, type TickerItem } from '@/components/terminal/top-ticker';
import { LogoBadge } from '@/components/ui/logo-badge';
import { GlobalSearch } from '@/components/terminal/global-search';
import { AlertsDrawer } from '@/components/terminal/alerts-drawer';
import { PortfolioSwitcher } from '@/components/terminal/portfolio-switcher';
import Link from 'next/link';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { hasPermission } from '@/lib/permissions/check';
import { terminalNavigation } from '@/lib/navigation/registry';

type TerminalShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

function toDropdownItems(id: string, permissions: Array<string>) {
  const parent = terminalNavigation.find((item) => item.id === id);
  return (parent?.children || [])
    .filter((item) => !item.permission || permissions.includes(item.permission))
    .map((item) => ({ label: item.title, href: item.href }));
}

export function TerminalShell({ eyebrow, title, description, children, rightSlot }: TerminalShellProps) {
  const [marketItems, setMarketItems] = useState<TickerItem[]>([]);
  const { session } = useDemoSession();
  const marketMenu = toDropdownItems('dashboard-domain', session.permissions).filter((item) => ['Performance','Watchlist Board','Events Calendar','Security Drill-Down'].includes(item.label));
  const researchMenu = toDropdownItems('research-domain', session.permissions);
  const operationsMenu = toDropdownItems('operations-domain', session.permissions);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await fetch('/api/terminal/markets');
      const data = await response.json();
      if (!cancelled) setMarketItems(data.items || []);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen px-5 py-5 md:px-7 lg:px-8">
      <Sidebar />
      <div className="mx-auto max-w-[1880px] pl-0 xl:pl-14">
        <div className="mb-4 flex items-center justify-between gap-4 rounded-[30px] border border-white/55 bg-white/62 px-4 py-4 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-2xl md:px-5">
          <div className="flex items-center gap-4">
            <div className="ml-14 xl:ml-0"><LogoBadge small /></div>
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <HoverDropdown label="Markets" items={marketMenu} />
            <PortfolioSwitcher />
            <HoverDropdown label="Research" items={researchMenu} />
            <HoverDropdown label="Operate" items={operationsMenu} />
            {hasPermission(session, 'control-center.view') ? (
              <Link href="/control-center" className="hidden h-11 items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 text-sm font-medium text-slate-700 lg:flex">
                Control Center
              </Link>
            ) : null}
            <button className="hidden h-11 items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 text-sm font-medium text-slate-700 md:flex">
              <CalendarRange size={16} />
              Today
            </button>
            <AlertsDrawer />
            <SettingsMenu />
          </div>
        </div>

        <TopTicker items={marketItems} />

        <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/76 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 backdrop-blur-xl">
              {eyebrow}
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-slate-950">{title}</h1>
            <p className="mt-3 max-w-[820px] text-lg leading-8 text-slate-600">{description}</p>
          </div>
          {rightSlot ? <div className="xl:pb-1">{rightSlot}</div> : null}
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
