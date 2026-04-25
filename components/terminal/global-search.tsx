'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { SearchPayload, SearchResultItem } from '@/lib/types/terminal-ops';

const badge: Record<SearchResultItem['type'], string> = {
  security: 'Security',
  page: 'Page',
  account: 'Account',
  portfolio: 'Portfolio'
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [payload, setPayload] = useState<SearchPayload | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === '/') {
        const target = event.target as HTMLElement | null;
        if (!target || !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
          event.preventDefault();
          setOpen(true);
        }
      }
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      const res = await fetch(`/api/terminal/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
      const data = await res.json();
      if (!cancelled) setPayload(data);
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [open, query]);

  const items = useMemo(() => (query.trim() ? payload?.results || [] : payload?.recent || []), [payload, query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden h-11 items-center rounded-full border border-white/60 bg-white/80 px-4 md:flex"
        aria-label="Open search"
      >
        <Search size={16} className="text-slate-400" />
        <span className="w-[240px] px-3 text-left text-sm text-slate-700">Search securities, accounts, portfolios</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">⌘K</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120] bg-slate-950/18 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto mt-[9vh] w-[min(760px,calc(100vw-2rem))] rounded-[34px] border border-white/55 bg-white/86 p-4 shadow-[0_30px_90px_rgba(15,23,40,0.18)] backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3 rounded-[24px] border border-white/70 bg-white/88 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <Search size={18} className="text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search securities, pages, portfolios, accounts"
                  className="w-full bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button onClick={() => setOpen(false)} className="text-sm text-slate-500">Esc</button>
              </div>

              <div className="mt-4 rounded-[28px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,250,252,0.78))] p-3">
                <div className="mb-3 flex items-center justify-between px-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{query.trim() ? 'Matching results' : 'Recent jumps'}</div>
                  <div className="inline-flex items-center gap-2 text-xs text-slate-500"><Sparkles size={13} /> Command-ready search</div>
                </div>
                <div className="space-y-1">
                  {items.map((item) => (
                    <Link
                      href={item.href}
                      key={item.id}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-[22px] px-4 py-3 transition hover:bg-white/88"
                    >
                      <div>
                        <div className="text-base font-medium text-slate-950">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.subtitle}</div>
                      </div>
                      <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {badge[item.type]}
                      </div>
                    </Link>
                  ))}
                  {!items.length ? <div className="rounded-[22px] px-4 py-10 text-center text-sm text-slate-500">No matching results yet.</div> : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
