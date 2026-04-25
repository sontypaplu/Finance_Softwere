'use client';

import type { ApiEnvelope } from '@/lib/contracts/api';

export async function fetchApi<T>(input: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const response = await fetch(input, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<ApiEnvelope<T>>;
}

export async function fetchApiData<T>(input: string, init?: RequestInit): Promise<T> {
  const envelope = await fetchApi<T>(input, init);
  if (!envelope.ok) {
    throw new Error(envelope.error?.message || 'Unknown API failure');
  }
  return envelope.data;
}
