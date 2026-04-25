export type AuditActorType = 'user' | 'system' | 'service';

export type AuditActor = {
  id: string;
  name: string;
  type: AuditActorType;
  role?: string;
};

export type AuditTarget = {
  entityType: string;
  entityId: string;
  entityLabel: string;
};

export type AuditLogEvent = {
  id: string;
  timestamp: string;
  action: string;
  category: 'auth' | 'portfolio' | 'approval' | 'configuration' | 'support' | 'security';
  actor: AuditActor;
  target: AuditTarget;
  summary: string;
  status: 'success' | 'warning' | 'failed';
  requestId?: string;
  metadata?: Record<string, string>;
};
