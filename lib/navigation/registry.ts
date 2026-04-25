import { AlertTriangle, BarChart3, BriefcaseBusiness, Building2, CalendarClock, CircleUserRound, Compass, Database, FileKey2, Files, Flag, Gauge, HandCoins, LayoutGrid, LifeBuoy, Newspaper, Orbit, PieChart, ReceiptText, Radar, Scale, ScrollText, Settings2, ShieldCheck, Sigma, Siren, WalletCards, Users2, Workflow, Bot, SlidersHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AppPermission } from '@/lib/permissions/contracts';
import type { ControlCenterModuleId } from '@/lib/contracts/control-center';

export type NavItem = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  domain: string;
  permission?: AppPermission;
  children?: NavItem[];
};

export const terminalNavigation: NavItem[] = [
  {
    id: 'dashboard-domain', title: 'Terminal', href: '/terminal', icon: LayoutGrid, domain: 'terminal', permission: 'terminal.view', children: [
      { id: 'overview', title: 'Overview', href: '/terminal', icon: LayoutGrid, domain: 'terminal', permission: 'terminal.view' },
      { id: 'portfolio-analytics', title: 'Portfolio Analytics', href: '/terminal/portfolio-analytics', icon: PieChart, domain: 'terminal', permission: 'terminal.view' },
      { id: 'deep-tables', title: 'Deep Tables', href: '/terminal/deep-tables', icon: BarChart3, domain: 'terminal', permission: 'terminal.view' },
      { id: 'chart-studio', title: 'Chart Studio', href: '/terminal/chart-studio', icon: Gauge, domain: 'terminal', permission: 'terminal.view' },
      { id: 'security-drill', title: 'Security Drill-Down', href: '/terminal/security-drilldown', icon: Orbit, domain: 'terminal', permission: 'terminal.view' },
      { id: 'ratio-center', title: 'Ratio Center', href: '/terminal/ratio-center', icon: Sigma, domain: 'terminal', permission: 'terminal.view' },
      { id: 'tax-center', title: 'Tax Center', href: '/terminal/tax-center', icon: ReceiptText, domain: 'terminal', permission: 'terminal.view' }
    ]
  },
  {
    id: 'research-domain', title: 'Research', href: '/terminal/watchlist', icon: Compass, domain: 'research', permission: 'terminal.view', children: [
      { id: 'watchlist', title: 'Watchlist Board', href: '/terminal/watchlist', icon: Radar, domain: 'research', permission: 'terminal.view' },
      { id: 'events', title: 'Events Calendar', href: '/terminal/calendar', icon: CalendarClock, domain: 'research', permission: 'terminal.view' },
      { id: 'news-pulse', title: 'News Pulse', href: '/terminal', icon: Newspaper, domain: 'research', permission: 'terminal.view' }
    ]
  },
  {
    id: 'operations-domain', title: 'Operate', href: '/terminal/transactions', icon: Workflow, domain: 'operations', permission: 'terminal.view', children: [
      { id: 'transactions', title: 'Transactions', href: '/terminal/transactions', icon: ScrollText, domain: 'operations', permission: 'terminal.transactions.write' },
      { id: 'master-data', title: 'Master Data', href: '/terminal/master', icon: Database, domain: 'operations', permission: 'terminal.view' },
      { id: 'planning', title: 'Planning', href: '/terminal/planning', icon: WalletCards, domain: 'operations', permission: 'terminal.view' },
      { id: 'reports', title: 'Reports', href: '/terminal/reports', icon: Files, domain: 'operations', permission: 'terminal.reports.export' },
      { id: 'alerts', title: 'Alerts', href: '/terminal', icon: AlertTriangle, domain: 'operations', permission: 'terminal.alerts.manage' }
    ]
  },
  { id: 'control-center-entry', title: 'Control Center', href: '/control-center', icon: ShieldCheck, domain: 'platform', permission: 'control-center.view' },
  { id: 'settings', title: 'Settings', href: '/terminal/settings', icon: Settings2, domain: 'account', permission: 'terminal.view' },
  { id: 'profile', title: 'Profile', href: '/terminal/profile', icon: CircleUserRound, domain: 'account', permission: 'terminal.view' }
];

export const controlCenterModuleNavigation: Array<NavItem & { moduleId?: ControlCenterModuleId }> = [
  { id: 'cc-dashboard', title: 'Dashboard', href: '/control-center', icon: LayoutGrid, domain: 'control-center', permission: 'control-center.view', moduleId: 'dashboard' },
  { id: 'cc-tenants', title: 'Tenants', href: '/control-center/tenants', icon: Building2, domain: 'control-center', permission: 'control-center.tenants.view', moduleId: 'tenants' },
  { id: 'cc-organizations', title: 'Organizations', href: '/control-center/organizations', icon: BriefcaseBusiness, domain: 'control-center', permission: 'control-center.organizations.view', moduleId: 'organizations' },
  { id: 'cc-users', title: 'Users', href: '/control-center/users', icon: Users2, domain: 'control-center', permission: 'control-center.users.manage', moduleId: 'users' },
  { id: 'cc-roles', title: 'Roles & Permissions', href: '/control-center/roles-permissions', icon: FileKey2, domain: 'control-center', permission: 'control-center.roles.manage', moduleId: 'roles-permissions' },
  { id: 'cc-approvals', title: 'Approvals', href: '/control-center/approvals', icon: Workflow, domain: 'control-center', permission: 'control-center.approvals.manage', moduleId: 'approvals' },
  { id: 'cc-alerts', title: 'Alerts Center', href: '/control-center/alerts-center', icon: Siren, domain: 'control-center', permission: 'control-center.alerts.view', moduleId: 'alerts-center' },
  { id: 'cc-audit', title: 'Audit Explorer', href: '/control-center/audit-explorer', icon: ShieldCheck, domain: 'control-center', permission: 'control-center.audit.view', moduleId: 'audit-explorer' },
  { id: 'cc-jobs', title: 'Jobs Monitor', href: '/control-center/jobs-monitor', icon: Bot, domain: 'control-center', permission: 'control-center.jobs.view', moduleId: 'jobs-monitor' },
  { id: 'cc-flags', title: 'Feature Flags', href: '/control-center/feature-flags', icon:Flag, domain: 'control-center', permission: 'control-center.flags.manage', moduleId: 'feature-flags' },
  { id: 'cc-config', title: 'Configuration', href: '/control-center/configuration-center', icon: SlidersHorizontal, domain: 'control-center', permission: 'control-center.config.manage', moduleId: 'configuration-center' },
  { id: 'cc-support', title: 'Support Tools', href: '/control-center/support-tools', icon: LifeBuoy, domain: 'control-center', permission: 'control-center.support.use', moduleId: 'support-tools' },
  { id: 'cc-incidents', title: 'Incidents / Change Log', href: '/control-center/incidents-change-log', icon: AlertTriangle, domain: 'control-center', permission: 'control-center.incidents.view', moduleId: 'incidents-change-log' }
];
