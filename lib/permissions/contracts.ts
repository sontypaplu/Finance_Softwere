export type AppRole =
  | 'super_admin'
  | 'ops_admin'
  | 'finance_controller'
  | 'compliance_manager'
  | 'support_agent'
  | 'portfolio_manager'
  | 'analyst';

export type AppPermission =
  | 'terminal.view'
  | 'terminal.transactions.write'
  | 'terminal.reports.export'
  | 'terminal.alerts.manage'
  | 'control-center.view'
  | 'control-center.tenants.view'
  | 'control-center.organizations.view'
  | 'control-center.users.manage'
  | 'control-center.roles.manage'
  | 'control-center.approvals.manage'
  | 'control-center.alerts.view'
  | 'control-center.audit.view'
  | 'control-center.jobs.view'
  | 'control-center.flags.manage'
  | 'control-center.config.manage'
  | 'control-center.support.use'
  | 'control-center.incidents.view';

export type RoleDefinition = {
  id: AppRole;
  label: string;
  description: string;
  permissions: AppPermission[];
};

export type DemoSession = {
  userId: string;
  name: string;
  email: string;
  role: AppRole;
  permissions: AppPermission[];
  environment: 'demo';
};
