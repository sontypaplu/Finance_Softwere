'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api/fetch-client';
import type { AlertsPayload } from '@/features/alerts/contracts';
import type { ApiEnvelope } from '@/lib/contracts/api';

export function useAlertsCenter(enabled = true) {
  const [data, setData] = useState<AlertsPayload | null>(null);
  const [meta, setMeta] = useState<ApiEnvelope<AlertsPayload>['meta'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const envelope = await fetchApi<AlertsPayload>('/api/terminal/alerts');
        if (!cancelled) {
          setData(envelope.data);
          setMeta(envelope.meta);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load alerts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { data, meta, loading, error };
}
