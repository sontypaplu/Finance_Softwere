'use client';

import { useEffect, useState } from 'react';
import { BriefcaseBusiness, ShieldCheck, UserCircle2 } from 'lucide-react';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import type { SettingsPayload } from '@/lib/types/terminal-ops';

const surface = 'rounded-[32px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl';

export function ProfilePageClient() {
  const [payload, setPayload] = useState<SettingsPayload | null>(null);

  useEffect(() => {
    fetch('/api/terminal/settings').then((res) => res.json()).then(setPayload).catch(() => null);
  }, []);

  if (!payload) return <TerminalShell eyebrow="Profile" title="Loading profile" description="Preparing account profile surface."><div className={surface}>Loading…</div></TerminalShell>;

  return (
    <TerminalShell eyebrow="Profile" title="Account profile" description="Identity, workspace role, and security posture rendered as a dedicated premium page for future account management flows.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className={surface}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><UserCircle2 size={14} /> Profile card</div>
          <div className="mt-5 flex items-center gap-4 rounded-[28px] border border-white/60 bg-white/84 p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e_0%,#4f46e5_100%)] text-xl font-semibold text-white">AR</div>
            <div>
              <div className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{payload.profile.name}</div>
              <div className="mt-1 text-sm text-slate-500">{payload.profile.email}</div>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
              <div className="text-sm text-slate-500">Primary workspace</div>
              <div className="mt-1 text-base font-semibold text-slate-950">{payload.profile.workspace}</div>
            </div>
            <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
              <div className="text-sm text-slate-500">Role</div>
              <div className="mt-1 text-base font-semibold text-slate-950">{payload.profile.role}</div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><BriefcaseBusiness size={14} /> Workspace status</div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {payload.preferences.slice(0, 2).map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-base font-semibold text-slate-950">{item.label}</div>
                  <div className="mt-2 text-sm text-slate-600">{item.value}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={surface}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"><ShieldCheck size={14} /> Security posture</div>
            <div className="mt-4 space-y-3">
              {payload.security.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-base font-semibold text-slate-950">{item.label}</div>
                  <div className="mt-2 text-sm text-slate-600">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TerminalShell>
  );
}
