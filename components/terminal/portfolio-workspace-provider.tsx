'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { emitDataRefresh } from '@/lib/client/data-refresh';
import type { PortfolioWorkspaceItem } from '@/lib/types/workspace';

const STORAGE_KEY = 'aurelius.workspace.portfolios';
const SELECTED_KEY = 'aurelius.workspace.selectedPortfolio';
export const PORTFOLIO_LIMIT = 2;

function createDefaultPortfolio(): PortfolioWorkspaceItem {
  return {
    id: 'portfolio-1',
    name: 'Portfolio 1',
    notes: 'Default portfolio created for this account.',
    createdAt: new Date().toISOString(),
    baseCurrency: 'USD'
  };
}

type PortfolioWorkspaceContextValue = {
  portfolios: PortfolioWorkspaceItem[];
  selectedPortfolioId: string;
  selectedPortfolio: PortfolioWorkspaceItem | null;
  limit: number;
  canAddPortfolio: boolean;
  loading: boolean;
  source: 'api' | 'local';
  selectPortfolio: (id: string) => void;
  addPortfolio: (input: { name: string; notes: string }) => Promise<{ ok: boolean; reason?: string; portfolio?: PortfolioWorkspaceItem }>;
  updatePortfolio: (id: string, input: { name: string; notes: string }) => Promise<{ ok: boolean; reason?: string; portfolio?: PortfolioWorkspaceItem }>;
};

const PortfolioWorkspaceContext = createContext<PortfolioWorkspaceContextValue | null>(null);

export function PortfolioWorkspaceProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<PortfolioWorkspaceItem[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'api' | 'local'>('local');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      const selected = typeof window !== 'undefined' ? window.localStorage.getItem(SELECTED_KEY) : null;
      const local = stored ? (JSON.parse(stored) as PortfolioWorkspaceItem[]) : [];

      try {
        const response = await fetch('/api/portfolios', { credentials: 'include' });
        if (!response.ok) throw new Error('Portfolio API unavailable');
        const envelope = await response.json() as { data?: { items?: PortfolioWorkspaceItem[] } };
        const apiItems = envelope.data?.items || [];
        const next = apiItems.length ? apiItems : (local.length ? local : [createDefaultPortfolio()]);
        if (!cancelled) {
          setPortfolios(next);
          setSelectedPortfolioId(selected && next.some((item) => item.id === selected) ? selected : next[0]?.id || '');
          setSource('api');
        }
      } catch {
        const next = local.length ? local : [createDefaultPortfolio()];
        if (!cancelled) {
          setPortfolios(next);
          setSelectedPortfolioId(selected && next.some((item) => item.id === selected) ? selected : next[0]?.id || '');
          setSource('local');
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios));
  }, [hydrated, portfolios]);

  useEffect(() => {
    if (!hydrated || !selectedPortfolioId) return;
    window.localStorage.setItem(SELECTED_KEY, selectedPortfolioId);
  }, [hydrated, selectedPortfolioId]);

  const value = useMemo<PortfolioWorkspaceContextValue>(() => {
    const selectedPortfolio = portfolios.find((item) => item.id === selectedPortfolioId) || portfolios[0] || null;
    return {
      portfolios,
      selectedPortfolioId,
      selectedPortfolio,
      limit: PORTFOLIO_LIMIT,
      canAddPortfolio: portfolios.length < PORTFOLIO_LIMIT,
      loading,
      source,
      selectPortfolio: (id) => { setSelectedPortfolioId(id); emitDataRefresh({ scope: 'portfolio', portfolioId: id, reason: 'portfolio-selected' }); },
      addPortfolio: async ({ name, notes }) => {
        const cleaned = name.trim();
        if (!cleaned) return { ok: false, reason: 'Portfolio name is required.' };

        try {
          const response = await fetch('/api/portfolios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: cleaned, notes, baseCurrency: 'USD' })
          });
          const data = await response.json();
          if (!response.ok) return { ok: false, reason: data.message || 'Unable to create portfolio.' };
          const portfolio = data.data.item as PortfolioWorkspaceItem;
          setPortfolios((current) => [...current, portfolio]);
          setSelectedPortfolioId(portfolio.id);
          emitDataRefresh({ scope: 'portfolio', portfolioId: portfolio.id, reason: 'portfolio-created' });
          return { ok: true, portfolio };
        } catch {
          if (portfolios.length >= PORTFOLIO_LIMIT) return { ok: false, reason: `Maximum ${PORTFOLIO_LIMIT} portfolios allowed right now.` };
          const portfolio: PortfolioWorkspaceItem = { id: `portfolio-${Date.now()}`, name: cleaned, notes: notes.trim(), createdAt: new Date().toISOString(), baseCurrency: 'USD' };
          setPortfolios((current) => [...current, portfolio]);
          setSelectedPortfolioId(portfolio.id);
          emitDataRefresh({ scope: 'portfolio', portfolioId: portfolio.id, reason: 'portfolio-created' });
          return { ok: true, portfolio };
        }
      },
      updatePortfolio: async (id, { name, notes }) => {
        const cleaned = name.trim();
        if (!cleaned) return { ok: false, reason: 'Portfolio name is required.' };
        try {
          const response = await fetch(`/api/portfolios/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: cleaned, notes })
          });
          const data = await response.json();
          if (!response.ok) return { ok: false, reason: data.message || 'Unable to update portfolio.' };
          const portfolio = data.data.item as PortfolioWorkspaceItem;
          setPortfolios((current) => current.map((item) => (item.id === id ? portfolio : item)));
          emitDataRefresh({ scope: 'portfolio', portfolioId: id, reason: 'portfolio-updated' });
          return { ok: true, portfolio };
        } catch {
          const existing = portfolios.find((item) => item.id === id);
          if (!existing) return { ok: false, reason: 'Portfolio not found.' };
          const updated = { ...existing, name: cleaned, notes: notes.trim() };
          setPortfolios((current) => current.map((item) => (item.id === id ? updated : item)));
          return { ok: true, portfolio: updated };
        }
      }
    };
  }, [loading, portfolios, selectedPortfolioId, source]);

  return <PortfolioWorkspaceContext.Provider value={value}>{children}</PortfolioWorkspaceContext.Provider>;
}

export function usePortfolioWorkspace() {
  const context = useContext(PortfolioWorkspaceContext);
  if (!context) throw new Error('usePortfolioWorkspace must be used inside PortfolioWorkspaceProvider');
  return context;
}
