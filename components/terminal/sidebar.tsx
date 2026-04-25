'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { terminalNavigation } from '@/lib/navigation/registry';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { hasPermission } from '@/lib/permissions/check';

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { session } = useDemoSession();

  const navGroups = useMemo(
    () => terminalNavigation.flatMap((item) => {
      if (item.children?.length) {
        return item.children.filter((child) => hasPermission(session, child.permission));
      }
      return hasPermission(session, item.permission) ? [item] : [];
    }),
    [session]
  );

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
        setLocked(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div ref={ref} className="fixed left-0 top-0 z-50 h-screen">
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => {
          setLocked((value) => !value);
          setOpen(true);
        }}
        className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/72 text-slate-700 shadow-[0_18px_50px_rgba(15,23,40,0.12)] backdrop-blur-2xl"
      >
        <ChevronRight size={18} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className="h-full w-6" onMouseEnter={() => setOpen(true)} />
      <AnimatePresence>
        {open ? (
          <motion.aside
            initial={{ x: -18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -18, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => {
              if (!locked) setOpen(false);
            }}
            className="absolute left-5 top-20 h-[calc(100vh-2.5rem)] w-[286px] rounded-[30px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,249,255,0.76))] p-4 shadow-[0_30px_80px_rgba(15,23,40,0.16)] backdrop-blur-2xl"
          >
            <div className="mb-5 px-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Workspace</div>
            <div className="space-y-1 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1">
              {navGroups.map(({ id, title, icon: Icon, href }) => {
                const active = pathname === href;
                return (
                  <Link
                    href={href}
                    key={id}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white/70 ${active ? 'bg-white/78 shadow-[0_12px_30px_rgba(15,23,40,0.06)]' : ''}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-slate-700">
                      <Icon size={18} />
                    </div>
                    <span>{title}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-5 rounded-[24px] border border-white/60 bg-white/76 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Session scope</div>
              <div className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">{session.role.replace('_', ' ')}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Navigation is now registry-driven and permission-aware. Control Center visibility depends on role permissions and remains demo-backed until services exist.</p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
