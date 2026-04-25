import type { FilterRule, SortRule, TableColumnConfig } from '@/lib/contracts/api';

export type ControlCenterModuleId =
  | 'dashboard'
  | 'tenants'
  | 'organizations'
  | 'users'
  | 'roles-permissions'
  | 'approvals'
  | 'alerts-center'
  | 'audit-explorer'
  | 'jobs-monitor'
  | 'feature-flags'
  | 'configuration-center'
  | 'support-tools'
  | 'incidents-change-log';

export type ControlCenterModuleSummary = {
  id: ControlCenterModuleId;
  title: string;
  description: string;
  domain: 'tenant-admin' | 'security' | 'ops' | 'support' | 'platform';
  href: string;
  status: 'operational' | 'attention' | 'simulated';
  itemCount?: string;
};

export type ControlCenterRecord = {
  id: string;
  primary: string;
  secondary: string;
  owner: string;
  status: string;
  updatedAt: string;
  severity?: string;
};

export type ControlCenterModulePayload = {
  summary: ControlCenterModuleSummary;
  filters: FilterRule[];
  sort: SortRule[];
  columns: TableColumnConfig[];
  records: ControlCenterRecord[];
  detail: {
    title: string;
    description: string;
    badges: string[];
    fields: { label: string; value: string }[];
  };
};

export type ControlCenterDashboardPayload = {
  modules: ControlCenterModuleSummary[];
  kpis: { label: string; value: string; delta: string; tone: 'up' | 'down' | 'flat' }[];
  incidents: { id: string; title: string; severity: string; owner: string; updatedAt: string }[];
  approvals: { id: string; title: string; owner: string; status: string; submittedAt: string }[];
  jobs: { id: string; name: string; status: string; startedAt: string; duration: string }[];
};
