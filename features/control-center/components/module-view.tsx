'use client';

import { BulkActionsBar } from '@/components/enterprise/bulk-actions-bar';
import { DataGrid } from '@/components/enterprise/data-grid';
import { DetailSidePanel } from '@/components/enterprise/detail-side-panel';
import { FilterBar } from '@/components/enterprise/filter-bar';
import { SavedViewSwitcher } from '@/components/enterprise/saved-view-switcher';
import { SectionShell } from '@/components/enterprise/section-shell';
import { StatusBadge } from '@/components/enterprise/status-badge';
import type { ControlCenterModulePayload } from '@/features/control-center/contracts';

export function ControlCenterModuleView({ data }: { data: ControlCenterModulePayload }) {
  return (
    <div className="space-y-6">
      <SectionShell eyebrow={data.summary.domain} title={data.summary.title} description={data.summary.description} actions={<StatusBadge label={data.summary.status} tone={data.summary.status === 'operational' ? 'success' : data.summary.status === 'attention' ? 'warning' : 'info'} />}>
        <div className="space-y-4">
          <SavedViewSwitcher views={['Default view', 'Ops focus', 'Escalations']} activeView="Default view" />
          <FilterBar filters={data.filters} />
          <BulkActionsBar label="Simulated bulk actions" actions={['Assign', 'Escalate', 'Export']} />
        </div>
      </SectionShell>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionShell eyebrow="Module table" title="Operational records" description="This grid is fed by typed module contracts and can later switch to live adapters without changing the page shell.">
          <DataGrid
            columns={data.columns}
            rows={data.records}
            renderCell={(row, columnId) => {
              if (columnId === 'status') {
                const tone = row.status === 'Active' ? 'success' : row.status === 'Attention' ? 'warning' : row.status === 'Pending' ? 'info' : 'neutral';
                return <StatusBadge label={row.status} tone={tone as any} />;
              }
              return (row as Record<string, string>)[columnId] || '';
            }}
          />
        </SectionShell>
        <DetailSidePanel title={data.detail.title} description={data.detail.description} badges={data.detail.badges} fields={data.detail.fields} />
      </div>
    </div>
  );
}
