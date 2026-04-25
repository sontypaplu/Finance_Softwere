'use client';

const DATA_REFRESH_EVENT = 'finance-terminal:data-refresh';

export type RefreshDetail = {
  scope: 'transactions' | 'overview' | 'portfolio' | 'all';
  portfolioId?: string;
  reason?: string;
};

export function emitDataRefresh(detail: RefreshDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<RefreshDetail>(DATA_REFRESH_EVENT, { detail }));
}

export function subscribeDataRefresh(callback: (detail: RefreshDetail) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    const custom = event as CustomEvent<RefreshDetail>;
    callback(custom.detail);
  };
  window.addEventListener(DATA_REFRESH_EVENT, handler as EventListener);
  return () => window.removeEventListener(DATA_REFRESH_EVENT, handler as EventListener);
}
