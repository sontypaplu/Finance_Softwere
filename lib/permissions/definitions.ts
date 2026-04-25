import type { DemoSession, RoleDefinition } from '@/lib/permissions/contracts';

export const roleDefinitions: Record<RoleDefinition['id'], RoleDefinition> = {
  super_admin: {
    id: 'super_admin',
    label: 'Super Admin',
    description: 'Full visibility across terminal and control center modules.',
    permissions: [
      'terminal.view','terminal.transactions.write','terminal.reports.export','terminal.alerts.manage','control-center.view','control-center.tenants.view','control-center.organizations.view','control-center.users.manage','control-center.roles.manage','control-center.approvals.manage','control-center.alerts.view','control-center.audit.view','control-center.jobs.view','control-center.flags.manage','control-center.config.manage','control-center.support.use','control-center.incidents.view'
    ]
  },
  ops_admin: {
    id: 'ops_admin', label: 'Ops Admin', description: 'Operations and jobs visibility.',
    permissions: ['terminal.view','terminal.alerts.manage','control-center.view','control-center.approvals.manage','control-center.alerts.view','control-center.jobs.view','control-center.support.use','control-center.incidents.view']
  },
  finance_controller: {
    id: 'finance_controller', label: 'Finance Controller', description: 'Finance oversight and export access.',
    permissions: ['terminal.view','terminal.transactions.write','terminal.reports.export','terminal.alerts.manage','control-center.view','control-center.approvals.manage','control-center.audit.view']
  },
  compliance_manager: {
    id: 'compliance_manager', label: 'Compliance Manager', description: 'Audit and control visibility.',
    permissions: ['terminal.view','control-center.view','control-center.audit.view','control-center.roles.manage','control-center.incidents.view']
  },
  support_agent: {
    id: 'support_agent', label: 'Support Agent', description: 'Support tooling and incident response.',
    permissions: ['terminal.view','control-center.view','control-center.support.use','control-center.incidents.view','control-center.alerts.view']
  },
  portfolio_manager: {
    id: 'portfolio_manager', label: 'Portfolio Manager', description: 'Primary portfolio operating role.',
    permissions: ['terminal.view','terminal.transactions.write','terminal.reports.export','terminal.alerts.manage']
  },
  analyst: {
    id: 'analyst', label: 'Analyst', description: 'Read-only analytical workspace.',
    permissions: ['terminal.view']
  }
};

export const defaultDemoSession: DemoSession = {
  userId: 'demo_user_1',
  name: 'Aurelius Demo Operator',
  email: 'demo@aurelius.finance',
  role: 'super_admin',
  permissions: roleDefinitions.super_admin.permissions,
  environment: 'demo'
};
