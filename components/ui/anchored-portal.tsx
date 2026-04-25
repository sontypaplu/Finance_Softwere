'use client';

import { useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

type AnchoredPortalProps = {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  align?: 'left' | 'right';
  offset?: number;
  className?: string;
  children: ReactNode;
};

export function AnchoredPortal({
  anchorRef,
  open,
  align = 'left',
  offset = 12,
  className,
  children
}: AnchoredPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;

      setStyle({
        position: 'fixed',
        top: rect.bottom + offset,
        left: align === 'left' ? rect.left : undefined,
        right: align === 'right' ? Math.max(window.innerWidth - rect.right, 16) : undefined,
        zIndex: 1000,
        minWidth: rect.width,
        maxWidth: 'min(calc(100vw - 32px), 340px)'
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [align, anchorRef, offset, open]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div style={style} className={className}>
      {children}
    </div>,
    document.body
  );
}
