'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bell, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAlertsCenter } from '@/features/alerts/hooks/use-alerts-center';

const severityTone = {
  high: 'bg-rose-50 text-rose-600 border-rose-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100'
};

export function AlertsDrawer() {
  const [open, setOpen] = useState(false);
  const { data: payload, loading, error } = useAlertsCenter(open);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/70 text-slate-700"
        aria-label="Open alerts"
      >
        <Bell size={17} />
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-semibold text-white">{payload?.unread ?? '•'}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-[115] bg-slate-950/12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.aside
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(event) => event.stopPropagation()}
              className="absolute right-5 top-5 h-[calc(100vh-2.5rem)] w-[min(420px,calc(100vw-2.5rem))] rounded-[34px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,250,252,0.82))] p-5 shadow-[0_30px_90px_rgba(15,23,40,0.18)] backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Alerts center</div>
                  <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Operational watchlist</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{payload?.headline || (loading ? 'Loading alerts and notifications…' : 'Alerts unavailable')}</p>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-full border border-white/55 bg-white/80 px-3 py-2 text-sm text-slate-600">Close</button>
              </div>

              <div className="mt-5 rounded-[26px] border border-white/60 bg-white/80 p-4">
                <div className="text-sm text-slate-500">Unread priority items</div>
                <div className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">{payload?.unread ?? '—'}</div>
              </div>

              <div className="mt-5 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 18rem)' }}>
                {!payload?.items?.length && !loading && error ? <div className="rounded-[26px] border border-white/60 bg-white/84 p-4 text-sm text-slate-600">{error}</div> : null}
                {(payload?.items || []).map((item) => (
                  <div key={item.id} className="rounded-[26px] border border-white/60 bg-white/84 p-4 shadow-[0_14px_36px_rgba(15,23,40,0.05)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${severityTone[item.severity]}`}>{item.severity}</div>
                      <div className="text-xs font-medium text-slate-400">{item.area}</div>
                    </div>
                    <div className="mt-3 text-lg font-semibold leading-tight tracking-[-0.03em] text-slate-950">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <AlertTriangle size={15} />
                      {item.action}
                      <ChevronRight size={15} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
