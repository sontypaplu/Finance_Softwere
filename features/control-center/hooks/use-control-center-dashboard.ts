'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api/fetch-client';
import type { ControlCenterDashboardPayload } from '@/features/control-center/contracts';

export function useControlCenterDashboard() {
  const [data, setData] = useState<ControlCenterDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const envelope = await fetchApi<ControlCenterDashboardPayload>('/api/control-center/dashboard');
        if (!cancelled) setData(envelope.data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load control center dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
