import type { AuditLogEvent } from '@/lib/contracts/audit';

export const controlCenterAuditEvents: AuditLogEvent[] = [
  {
    id: 'audit_1',
    timestamp: '2026-04-23T09:12:00Z',
    action: 'approval.reviewed',
    category: 'approval',
    actor: { id: 'u_1', name: 'Aurelius Demo Operator', type: 'user', role: 'super_admin' },
    target: { entityType: 'approval', entityId: 'apr_1', entityLabel: 'High-value withdrawal' },
    summary: 'Approval workflow reviewed in Control Center',
    status: 'success',
    requestId: 'ccdash_1234'
  },
  {
    id: 'audit_2',
    timestamp: '2026-04-23T08:48:00Z',
    action: 'feature_flag.changed',
    category: 'configuration',
    actor: { id: 'svc_1', name: 'Mock automation', type: 'system' },
    target: { entityType: 'feature_flag', entityId: 'flag_1', entityLabel: 'advanced_reports' },
    summary: 'Feature flag bundle drift detected',
    status: 'warning',
    requestId: 'ccmod_7788'
  },
  {
    id: 'audit_3',
    timestamp: '2026-04-23T08:10:00Z',
    action: 'support.session.impersonation_requested',
    category: 'support',
    actor: { id: 'u_2', name: 'Support Agent 1', type: 'user', role: 'support_agent' },
    target: { entityType: 'support_session', entityId: 'ss_1', entityLabel: 'Org 12 support session' },
    summary: 'Support workflow requested elevated session',
    status: 'failed',
    requestId: 'ccmod_5544'
  }
];
