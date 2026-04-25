'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api/fetch-client';
import type { ControlCenterModuleId, ControlCenterModulePayload } from '@/features/control-center/contracts';

export function useControlCenterModule(moduleId: ControlCenterModuleId) {
  const [data, setData] = useState<ControlCenterModulePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const envelope = await fetchApi<ControlCenterModulePayload>(`/api/control-center/module/${moduleId}`);
        if (!cancelled) setData(envelope.data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load module');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [moduleId]);

  return { data, loading, error };
}
