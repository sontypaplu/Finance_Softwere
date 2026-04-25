'use client';

import { useEffect, useState } from 'react';
import { Shield, SlidersHorizontal, UserRound } from 'lucide-react';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { SettingsPayload } from '@/lib/types/terminal-ops';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { roleDefinitions } from '@/lib/permissions/definitions';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function SettingsPageClient() {
  const [payload, setPayload] = useState<SettingsPayload | null>(null);
  const { session, setRole } = useDemoSession();

  useEffect(() => {
    fetch('/api/terminal/settings').then((res) => res.json()).then(setPayload).catch(() => null);
  }, []);

  if (!payload) {
    return <TerminalShell eyebrow="Settings" title="Loading workspace controls" description="Preparing preferences, security controls, and session overview."><div className={surface}>Loading…</div></TerminalShell>;
  }

  return (
    <TerminalShell eyebrow="Settings" title="Workspace controls" description="Terminal preferences, session security, and profile controls packaged in the same design system for future real account integration.">
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><UserRound size={14} /> Profile identity</div>
            <div className="mt-4 rounded-[26px] border border-white/60 bg-white/84 p-5">
              <div className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{payload.profile.name}</div>
              <div className="mt-2 text-sm text-slate-500">{payload.profile.email}</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div className="text-sm text-slate-500">Demo role</div>
                  <select value={session.role} onChange={(event) => setRole(event.target.value as keyof typeof roleDefinitions)} className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white px-3 text-sm text-slate-700 outline-none">
                    {Object.values(roleDefinitions).map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
                  </select>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div className="text-sm text-slate-500">Workspace</div>
                  <div className="mt-1 text-base font-semibold text-slate-950">{payload.profile.workspace}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><SlidersHorizontal size={14} /> Preferences</div>
            <div className="mt-4 space-y-3">
              {payload.preferences.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-slate-950">{item.label}</div>
                    <div className="text-sm font-medium text-slate-600">{item.value}</div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><Shield size={14} /> Security</div>
            <div className="mt-4 space-y-3">
              {payload.security.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-base font-semibold text-slate-950">{item.label}</div>
                  <div className="mt-2 text-sm text-slate-600">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={surface}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Active sessions</div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-slate-400">
                  <tr>{['Device', 'Location', 'Last seen', 'Status'].map((heading) => <th key={heading} className="pb-3 font-medium">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {payload.sessions.map((row) => (
                    <tr key={`${row.device}-${row.seen}`} className="border-t border-slate-100/90 text-slate-700">
                      <td className="py-4 font-medium text-slate-950">{row.device}</td>
                      <td className="py-4">{row.location}</td>
                      <td className="py-4">{row.seen}</td>
                      <td className="py-4"><span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </TerminalShell>
  );
}
