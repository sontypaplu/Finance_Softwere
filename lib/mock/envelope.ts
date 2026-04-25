import type { ApiEnvelope, FilterRule, SortRule, PaginationMeta } from '@/lib/contracts/api';
import { appEnvironment, appRequestSource } from '@/lib/config/environment';
import { createRequestId } from '@/lib/utils/request-id';

export function makeMockEnvelope<T>(data: T, options?: { filters?: FilterRule[]; sort?: SortRule[]; pagination?: PaginationMeta; notices?: string[]; requestPrefix?: string; }): ApiEnvelope<T> {
  return {
    ok: true,
    data,
    meta: {
      requestId: createRequestId(options?.requestPrefix),
      generatedAt: new Date().toISOString(),
      source: appRequestSource,
      environment: appEnvironment,
      filters: options?.filters,
      sort: options?.sort,
      pagination: options?.pagination,
      notices: options?.notices || ['UI-first mock adapter response. Backend integration pending.']
    }
  };
}
