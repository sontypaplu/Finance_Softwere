'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api/fetch-client';
import type { OverviewPayload } from '@/features/overview/contracts';
import type { ApiEnvelope } from '@/lib/contracts/api';
import { subscribeDataRefresh } from '@/lib/client/data-refresh';

export function useOverviewData(portfolioId?: string) {
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [meta, setMeta] = useState<ApiEnvelope<OverviewPayload>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const search = portfolioId ? `?portfolioId=${encodeURIComponent(portfolioId)}` : '';
      const envelope = await fetchApi<OverviewPayload>(`/api/terminal/overview${search}`);
      setData(envelope.data);
      setMeta(envelope.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load overview');
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => subscribeDataRefresh((detail) => {
    if (detail.scope === 'all' || detail.scope === 'overview' || detail.scope === 'transactions' || detail.scope === 'portfolio') {
      if (!detail.portfolioId || !portfolioId || detail.portfolioId === portfolioId) {
        void load();
      }
    }
  }), [load, portfolioId]);

  return { data, meta, loading, error, refresh: load };
}
