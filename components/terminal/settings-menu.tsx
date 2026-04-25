'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, MoonStar, Palette, Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { AnchoredPortal } from '@/components/ui/anchored-portal';

export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const items = [
    { label: 'Theme settings', href: '/terminal/settings', icon: Palette },
    { label: 'Appearance', href: '/terminal/settings', icon: MoonStar },
    { label: 'Security controls', href: '/terminal/settings', icon: Shield },
    { label: 'Profile', href: '/terminal/profile', icon: Palette }
  ];

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 items-center gap-3 rounded-full border border-white/50 bg-white/72 px-4 text-sm font-medium text-slate-700 backdrop-blur-2xl transition hover:bg-white"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e_0%,#4f46e5_100%)] text-xs font-semibold text-white">AR</div>
        <span>Account</span>
        <ChevronDown size={15} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnchoredPortal anchorRef={buttonRef} open={open} align="right">
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
              className="w-[290px] rounded-[24px] border border-white/55 bg-white/86 p-3 shadow-[0_26px_70px_rgba(15,23,40,0.16)] backdrop-blur-2xl"
            >
              <div className="rounded-[20px] border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-base font-semibold text-slate-950">Aurelius Demo</div>
                <div className="mt-1 text-sm text-slate-500">demo@aurelius.finance</div>
              </div>
              <div className="mt-3 space-y-1">
                {items.map(({ label, href, icon: Icon }) => (
                  <Link key={label} href={href} role="menuitem" className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none" onClick={() => setOpen(false)}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                      <Icon size={16} />
                    </div>
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
              <Link href="/login" role="menuitem" className="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-rose-600 transition hover:bg-rose-50 focus:bg-rose-50 focus:outline-none">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <LogOut size={16} />
                </div>
                <span>Log out</span>
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </AnchoredPortal>
    </div>
  );
}
