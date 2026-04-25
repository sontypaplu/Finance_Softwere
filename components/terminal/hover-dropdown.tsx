'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { AnchoredPortal } from '@/components/ui/anchored-portal';

export type DropdownItem = string | { label: string; href?: string };

export function HoverDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    if (locked) return;
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, 120);
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

  return (
    <div ref={ref} className="relative" onMouseEnter={() => {
      clearCloseTimer();
      setOpen(true);
    }} onMouseLeave={scheduleClose}>
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
        {label}
        <ChevronDown size={15} className={`transition ${open ? 'rotate-180' : ''}`} />
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
              className="min-w-[240px] rounded-[22px] border border-white/50 bg-white/82 p-2 shadow-[0_22px_70px_rgba(15,23,40,0.16)] backdrop-blur-2xl"
            >
              {items.map((item) => {
                const normalized = typeof item === 'string' ? { label: item } : item;

                if (normalized.href) {
                  return (
                    <Link
                      key={`${label}-${normalized.label}`}
                      href={normalized.href}
                      role="menuitem"
                      className="flex w-full items-center rounded-2xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                      onClick={() => {
                        setOpen(false);
                        setLocked(false);
                      }}
                    >
                      {normalized.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={`${label}-${normalized.label}`}
                    role="menuitem"
                    className="flex w-full items-center rounded-2xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                  >
                    {normalized.label}
                  </button>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </AnchoredPortal>
    </div>
  );
}
