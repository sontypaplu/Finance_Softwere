'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BriefcaseBusiness, Check, ChevronDown, Pencil, Plus, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { AnchoredPortal } from '@/components/ui/anchored-portal';
import { usePortfolioWorkspace } from '@/components/terminal/portfolio-workspace-provider';

type ModalMode = 'create' | 'edit' | null;

export function PortfolioSwitcher() {
  const { portfolios, selectedPortfolio, selectedPortfolioId, selectPortfolio, addPortfolio, updatePortfolio, canAddPortfolio, limit } = usePortfolioWorkspace();
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [mode, setMode] = useState<ModalMode>(null);
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioNotes, setPortfolioNotes] = useState('');
  const [error, setError] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    if (locked) return;
    closeTimerRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
        setLocked(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        setLocked(false);
        setMode(null);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      clearCloseTimer();
    };
  }, []);

  function openCreateModal() {
    setPortfolioName('');
    setPortfolioNotes('');
    setError('');
    setMode('create');
  }

  function openEditModal() {
    setPortfolioName(selectedPortfolio?.name || '');
    setPortfolioNotes(selectedPortfolio?.notes || '');
    setError('');
    setMode('edit');
  }

  function handleSubmit() {
    const result = mode === 'edit' && selectedPortfolio
      ? updatePortfolio(selectedPortfolio.id, { name: portfolioName, notes: portfolioNotes })
      : addPortfolio({ name: portfolioName, notes: portfolioNotes });

    if (!result.ok) {
      setError(result.reason || 'Unable to save portfolio.');
      return;
    }

    setPortfolioName('');
    setPortfolioNotes('');
    setError('');
    setMode(null);
    setOpen(false);
    setLocked(false);
  }

  return (
    <>
      <div ref={ref} className="relative flex items-center gap-2" onMouseEnter={() => { clearCloseTimer(); setOpen(true); }} onMouseLeave={scheduleClose}>
        <button
          ref={buttonRef}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          onClick={() => {
            setLocked((value) => !value);
            setOpen(true);
          }}
          className="flex h-11 items-center gap-2 rounded-full border border-white/50 bg-white/68 px-4 text-sm font-medium text-slate-700 backdrop-blur-xl transition hover:bg-white"
        >
          <BriefcaseBusiness size={15} />
          <span className="max-w-[160px] truncate">{selectedPortfolio?.name || 'Portfolio 1'}</span>
          <ChevronDown size={15} className={`transition ${open ? 'rotate-180' : ''}`} />
        </button>
        <button
          type="button"
          aria-label="Edit selected portfolio"
          onClick={openEditModal}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/68 text-slate-700 backdrop-blur-xl transition hover:bg-white"
        >
          <Pencil size={15} />
        </button>

        <AnchoredPortal anchorRef={buttonRef} open={open} align="left">
          <AnimatePresence>
            {open ? (
              <motion.div
                ref={menuRef}
                id={menuId}
                role="menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={clearCloseTimer}
                onMouseLeave={scheduleClose}
                className="min-w-[340px] rounded-[24px] border border-white/50 bg-white/82 p-2 shadow-[0_22px_70px_rgba(15,23,40,0.16)] backdrop-blur-2xl"
              >
                <div className="rounded-[20px] border border-slate-100 bg-slate-50/70 px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Portfolio workspace</div>
                  <div className="mt-1 text-sm text-slate-600">One login can manage multiple portfolios. Limit right now: {limit}.</div>
                </div>

                <div className="mt-2 space-y-1">
                  {portfolios.map((item) => {
                    const active = item.id === selectedPortfolioId;
                    return (
                      <button
                        key={item.id}
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          selectPortfolio(item.id);
                          setOpen(false);
                          setLocked(false);
                        }}
                        className={`flex w-full items-start justify-between gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none ${active ? 'bg-slate-50' : ''}`}
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                          <div className="mt-1 text-xs leading-5 text-slate-500">{item.notes || 'No notes added yet.'}</div>
                        </div>
                        {active ? <Check size={16} className="mt-1 text-emerald-600" /> : null}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 border-t border-slate-100 pt-2">
                  <button
                    type="button"
                    disabled={!canAddPortfolio}
                    onClick={() => {
                      openCreateModal();
                      setOpen(false);
                      setLocked(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={16} />
                    Add new portfolio
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </AnchoredPortal>
      </div>

      <AnimatePresence>
        {mode ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-slate-950/26 p-4 backdrop-blur-sm">
            <div className="flex min-h-full items-center justify-center">
              <motion.div initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} className="w-full max-w-[560px] rounded-[34px] border border-white/60 bg-white/92 p-7 shadow-[0_30px_90px_rgba(15,23,40,0.18)] backdrop-blur-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{mode === 'edit' ? 'Edit portfolio' : 'Create portfolio'}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{mode === 'edit' ? 'Update selected portfolio' : 'Add a new portfolio'}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Give the portfolio a clear name and optional notes. The new portfolio becomes a separate workspace under the same login.</p>
                  </div>
                  <button type="button" onClick={() => setMode(null)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">Portfolio name</span>
                    <input value={portfolioName} onChange={(e) => setPortfolioName(e.target.value)} placeholder="Portfolio 2" className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">Notes</span>
                    <textarea value={portfolioNotes} onChange={(e) => setPortfolioNotes(e.target.value)} placeholder="Mandate, objective, risk profile, or anything important for this portfolio." rows={5} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
                  </label>
                </div>

                {error ? <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setMode(null)} className="h-11 rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
                  <button type="button" onClick={handleSubmit} className="h-11 rounded-full bg-slate-950 px-5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(15,23,40,0.18)] transition hover:opacity-95">{mode === 'edit' ? 'Save changes' : 'Create portfolio'}</button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
