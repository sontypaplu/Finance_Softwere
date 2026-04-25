'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { controlCenterModuleNavigation } from '@/lib/navigation/registry';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { hasPermission } from '@/lib/permissions/check';
import { PageHeader } from '@/components/enterprise/page-header';
import { StateBanner } from '@/components/enterprise/state-banner';
import { StatusBadge } from '@/components/enterprise/status-badge';

export function ControlCenterShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const pathname = usePathname();
  const { session } = useDemoSession();
  const visibleItems = controlCenterModuleNavigation.filter((item) => hasPermission(session, item.permission));
  const groupedItems = visibleItems.reduce<Record<string, typeof visibleItems>>((acc, item) => {
    acc[item.domain] = acc[item.domain] || [];
    acc[item.domain].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen px-5 py-5 md:px-7 lg:px-8">
      <div className="mx-auto grid max-w-[1880px] gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[30px] border border-white/55 bg-white/72 p-5 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Control Center</div>
          <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Enterprise modules</div>
          <div className="mt-2 text-sm leading-6 text-slate-600">Permission-aware admin foundation. All behaviors here are clearly mock/demo until backend services exist.</div>
          <div className="mt-4"><StatusBadge label={session.role.replace('_', ' ')} tone="info" /></div>
          <nav className="mt-6 space-y-4">
            {Object.entries(groupedItems).map(([domain, items]) => (
              <div key={domain}>
                <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">{domain}</div>
                <div className="space-y-2">
                  {items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.id} href={item.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-slate-950 text-white' : 'bg-slate-50/80 text-slate-700 hover:bg-white'}`}>
                        <item.icon size={16} />
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <main className="space-y-6">
          <PageHeader eyebrow="Enterprise control center" title={title} description={description} badgeLabel="demo only" />
          <StateBanner title="Mock enterprise foundation" detail="Navigation, permissions, tables, audit views, and workflow surfaces are backend-ready in structure, but still powered by mock adapters." tone="warning" />
          {children}
        </main>
      </div>
    </div>
  );
}
