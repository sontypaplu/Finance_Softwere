'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchApi, fetchApiData } from '@/lib/api/fetch-client';
import type { TransactionsConsolePayload, TransactionCreateResponse } from '@/features/transactions/contracts';
import type { ApiEnvelope } from '@/lib/contracts/api';
import { subscribeDataRefresh } from '@/lib/client/data-refresh';

export function useTransactionsConsole(portfolioId?: string) {
  const [data, setData] = useState<TransactionsConsolePayload | null>(null);
  const [meta, setMeta] = useState<ApiEnvelope<TransactionsConsolePayload>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const search = portfolioId ? `?portfolioId=${encodeURIComponent(portfolioId)}` : '';
      const envelope = await fetchApi<TransactionsConsolePayload>(`/api/terminal/transactions${search}`);
      setData(envelope.data);
      setMeta(envelope.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load transactions');
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => subscribeDataRefresh((detail) => {
    if (detail.scope === 'all' || detail.scope === 'transactions' || detail.scope === 'portfolio') {
      if (!detail.portfolioId || !portfolioId || detail.portfolioId === portfolioId) {
        void load();
      }
    }
  }), [load, portfolioId]);

  async function submitTransaction(payload: Record<string, unknown>) {
    return fetchApiData<TransactionCreateResponse>('/api/terminal/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  return { data, meta, loading, error, submitTransaction, refresh: load };
}
