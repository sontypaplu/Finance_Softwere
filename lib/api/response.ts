import { nanoid } from 'nanoid';
import type { ApiEnvelope, ApiError, DataSourceKind, EnvironmentBadge, FilterRule, PaginationMeta, SortRule } from '@/lib/contracts/api';

export type ResponseMetaInput = {
  source?: DataSourceKind;
  environment?: EnvironmentBadge;
  pagination?: PaginationMeta;
  filters?: FilterRule[];
  sort?: SortRule[];
  notices?: string[];
};

export function okResponse<T>(data: T, meta: ResponseMetaInput = {}): ApiEnvelope<T> {
  return {
    ok: true,
    data,
    meta: {
      requestId: nanoid(12),
      generatedAt: new Date().toISOString(),
      source: meta.source ?? 'service',
      environment: meta.environment ?? (process.env.NODE_ENV === 'production' ? 'production' : 'demo'),
      pagination: meta.pagination,
      filters: meta.filters,
      sort: meta.sort,
      notices: meta.notices
    }
  };
}

export function errorResponse<T>(error: ApiError, data: T, meta: ResponseMetaInput = {}): ApiEnvelope<T> {
  return {
    ok: false,
    data,
    error,
    meta: {
      requestId: nanoid(12),
      generatedAt: new Date().toISOString(),
      source: meta.source ?? 'service',
      environment: meta.environment ?? (process.env.NODE_ENV === 'production' ? 'production' : 'demo'),
      pagination: meta.pagination,
      filters: meta.filters,
      sort: meta.sort,
      notices: meta.notices
    }
  };
}
