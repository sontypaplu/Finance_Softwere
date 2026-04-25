import type { ControlCenterDashboardPayload, ControlCenterModuleId, ControlCenterModulePayload, ControlCenterModuleSummary } from '@/lib/contracts/control-center';
import { controlCenterModuleNavigation } from '@/lib/navigation/registry';

const modules: ControlCenterModuleSummary[] = controlCenterModuleNavigation.map((item, index) => ({
  id: item.moduleId || 'dashboard',
  title: item.title,
  description: `Mock ${item.title.toLowerCase()} workspace ready for future service integration.`,
  domain: index < 3 ? 'tenant-admin' : index < 7 ? 'security' : index < 11 ? 'ops' : 'support',
  href: item.href,
  status: index % 4 === 0 ? 'attention' : index === 0 ? 'operational' : 'simulated',
  itemCount: `${(index + 2) * 7}`
}));

const dashboardPayload: ControlCenterDashboardPayload = {
  modules,
  kpis: [
    { label: 'Active organizations', value: '24', delta: '+2 this month', tone: 'up' },
    { label: 'Queued approvals', value: '18', delta: '+4 today', tone: 'down' },
    { label: 'Flagged incidents', value: '3', delta: 'needs attention', tone: 'down' },
    { label: 'Healthy jobs', value: '97.4%', delta: '+0.4%', tone: 'up' }
  ],
  incidents: [
    { id: 'inc_1', title: 'Pricing sync latency spike', severity: 'High', owner: 'Ops Admin', updatedAt: '12m ago' },
    { id: 'inc_2', title: 'Approval queue older than SLA', severity: 'Medium', owner: 'Finance Controller', updatedAt: '34m ago' },
    { id: 'inc_3', title: 'Config drift on feature flag bundle', severity: 'Low', owner: 'Platform Team', updatedAt: '2h ago' }
  ],
  approvals: [
    { id: 'apr_1', title: 'High-value withdrawal', owner: 'Portfolio Ops', status: 'Pending review', submittedAt: '18m ago' },
    { id: 'apr_2', title: 'Role escalation request', owner: 'Support', status: 'Needs compliance', submittedAt: '41m ago' }
  ],
  jobs: [
    { id: 'job_1', name: 'Mock price refresh', status: 'Healthy', startedAt: '2m ago', duration: '16s' },
    { id: 'job_2', name: 'Report snapshot build', status: 'Degraded', startedAt: '14m ago', duration: '2m 09s' },
    { id: 'job_3', name: 'Notification fanout', status: 'Healthy', startedAt: '31m ago', duration: '22s' }
  ]
};

function makeModulePayload(moduleId: ControlCenterModuleId): ControlCenterModulePayload {
  const summary = modules.find((item) => item.id === moduleId) || modules[0];
  return {
    summary,
    filters: [
      { field: 'status', operator: 'in', value: ['active', 'pending'], label: 'Operational states' },
      { field: 'owner', operator: 'contains', value: 'team', label: 'Assigned team' }
    ],
    sort: [{ field: 'updatedAt', direction: 'desc', label: 'Newest first' }],
    columns: [
      { id: 'primary', label: 'Primary', sortable: true, defaultVisible: true },
      { id: 'secondary', label: 'Secondary', sortable: true, defaultVisible: true },
      { id: 'owner', label: 'Owner', sortable: true, defaultVisible: true },
      { id: 'status', label: 'Status', sortable: true, defaultVisible: true },
      { id: 'updatedAt', label: 'Updated', sortable: true, defaultVisible: true }
    ],
    records: Array.from({ length: 7 }).map((_, index) => ({
      id: `${moduleId}_${index + 1}`,
      primary: `${summary.title} item ${index + 1}`,
      secondary: `Mock record for ${summary.title.toLowerCase()} workflows`,
      owner: ['Ops Admin', 'Compliance', 'Support', 'Platform'][index % 4],
      status: ['Active', 'Pending', 'Attention', 'Simulated'][index % 4],
      updatedAt: `${(index + 1) * 9}m ago`,
      severity: ['Low', 'Medium', 'High'][index % 3]
    })),
    detail: {
      title: `${summary.title} detail panel`,
      description: 'This module is intentionally UI-first. Actions are simulated and backend service boundaries are prepared but not connected.',
      badges: ['Demo-ready', 'Permission-aware', 'Mock repository'],
      fields: [
        { label: 'Module', value: summary.title },
        { label: 'Workflow state', value: summary.status },
        { label: 'Primary owner', value: 'Enterprise Admin' },
        { label: 'Integration status', value: 'Mock adapter active' }
      ]
    }
  };
}

export function getControlCenterDashboardPayload() {
  return dashboardPayload;
}

export function getControlCenterModulePayload(moduleId: ControlCenterModuleId) {
  return makeModulePayload(moduleId);
}
