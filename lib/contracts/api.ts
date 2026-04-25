export type EnvironmentBadge = 'demo' | 'staging' | 'production';
export type DataSourceKind = 'mock' | 'service' | 'unknown';

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'in'
  | 'gte'
  | 'lte'
  | 'between'
  | 'starts_with'
  | 'ends_with';

export type FilterRule = {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | null | Array<string | number | boolean>;
  label?: string;
};

export type SortDirection = 'asc' | 'desc';

export type SortRule = {
  field: string;
  direction: SortDirection;
  label?: string;
};

export type PaginationRequest = {
  page: number;
  pageSize: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TableDensity = 'compact' | 'comfortable';

export type TableColumnConfig<TRecord extends string = string> = {
  id: TRecord;
  label: string;
  width?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  pinned?: 'left' | 'right';
  defaultVisible?: boolean;
  tone?: 'default' | 'muted' | 'accent';
};

export type RequestMeta = {
  requestId: string;
  generatedAt: string;
  source: DataSourceKind;
  environment: EnvironmentBadge;
  pagination?: PaginationMeta;
  filters?: FilterRule[];
  sort?: SortRule[];
  notices?: string[];
};

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiEnvelope<T> = {
  ok: boolean;
  data: T;
  meta: RequestMeta;
  error?: ApiError;
};

export type QueryContract = {
  pagination?: PaginationRequest;
  filters?: FilterRule[];
  sort?: SortRule[];
  search?: string;
};
