'use client';

import { ControlCenterShell } from '@/components/enterprise/control-center-shell';
import { PermissionGate } from '@/components/enterprise/permission-gate';
import { EmptyState } from '@/components/enterprise/empty-state';
import { LoadingSkeleton } from '@/components/enterprise/loading-skeleton';
import { ControlCenterDashboardView } from '@/features/control-center/components/dashboard-view';
import { useControlCenterDashboard } from '@/features/control-center/hooks/use-control-center-dashboard';

export default function ControlCenterDashboardPage() {
  const { data, loading, error } = useControlCenterDashboard();

  return (
    <PermissionGate permission="control-center.view">
      <ControlCenterShell title="Enterprise command layer" description="A backend-ready admin foundation for tenants, users, roles, approvals, alerts, audits, jobs, flags, configuration, support, and incident workflows.">
      {loading ? <LoadingSkeleton lines={6} /> : null}
      {!loading && error ? <EmptyState title="Unable to load Control Center" detail={error} /> : null}
      {data ? <ControlCenterDashboardView data={data} /> : null}
      </ControlCenterShell>
    </PermissionGate>
  );
}
