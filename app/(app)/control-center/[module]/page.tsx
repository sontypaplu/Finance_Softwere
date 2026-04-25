'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ControlCenterShell } from '@/components/enterprise/control-center-shell';
import { PermissionGate } from '@/components/enterprise/permission-gate';
import { EmptyState } from '@/components/enterprise/empty-state';
import { LoadingSkeleton } from '@/components/enterprise/loading-skeleton';
import { ControlCenterModuleView } from '@/features/control-center/components/module-view';
import { useControlCenterModule } from '@/features/control-center/hooks/use-control-center-module';
import type { ControlCenterModuleId } from '@/features/control-center/contracts';
import type { AppPermission } from '@/lib/permissions/contracts';
import { controlCenterModuleNavigation } from '@/lib/navigation/registry';

const validModules = new Set(controlCenterModuleNavigation.map((item) => item.moduleId).filter(Boolean) as ControlCenterModuleId[]);

export default function ControlCenterModulePage() {
  const params = useParams() as { module: string };
  const moduleId = params.module as ControlCenterModuleId;
  const navigationItem = useMemo(() => controlCenterModuleNavigation.find((item) => item.moduleId === moduleId), [moduleId]);
  const title = navigationItem?.title || 'Control Center Module';
  const permission = (navigationItem?.permission || 'control-center.view') as AppPermission;
  const { data, loading, error } = useControlCenterModule(moduleId);

  if (!validModules.has(moduleId)) {
    return (
      <ControlCenterShell title="Unknown module" description="The requested control-center route is not part of the current registry.">
        <EmptyState title="Module not found" detail="This control-center entry does not exist in the current mock navigation registry." />
      </ControlCenterShell>
    );
  }

  return (
    <PermissionGate permission={permission}>
      <ControlCenterShell title={title} description="Registry-driven enterprise module shell with permissions, typed contracts, mock adapters, filters, and detail panels.">
      {loading ? <LoadingSkeleton lines={5} /> : null}
      {!loading && error ? <EmptyState title="Unable to load module" detail={error} /> : null}
      {data ? <ControlCenterModuleView data={data} /> : null}
      </ControlCenterShell>
    </PermissionGate>
  );
}
