'use client';

import Link from 'next/link';
import { MetricCard } from '@/components/enterprise/metric-card';
import { SectionShell } from '@/components/enterprise/section-shell';
import { StatusBadge } from '@/components/enterprise/status-badge';
import { DataGrid } from '@/components/enterprise/data-grid';
import { AuditTimeline } from '@/components/enterprise/audit-timeline';
import { controlCenterAuditEvents } from '@/features/control-center/mock/audit';
import type { ControlCenterDashboardPayload } from '@/features/control-center/contracts';

export function ControlCenterDashboardView({ data }: { data: ControlCenterDashboardPayload }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {data.kpis.map((item) => <MetricCard key={item.label} label={item.label} value={item.value} delta={item.delta} tone={item.tone} />)}
      </div>

      <SectionShell eyebrow="Module map" title="Operational domains" description="Entry points for tenant administration, approvals, support, jobs, and audit review.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.modules.map((module) => (
            <Link key={module.id} href={module.href} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4 transition hover:bg-white">
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-semibold text-slate-950">{module.title}</div>
                <StatusBadge label={module.status} tone={module.status === 'operational' ? 'success' : module.status === 'attention' ? 'warning' : 'info'} />
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600">{module.description}</div>
              <div className="mt-3 text-sm font-medium text-slate-700">{module.itemCount ? `${module.itemCount} mock records` : 'Module shell ready'}</div>
            </Link>
          ))}
        </div>
      </SectionShell>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionShell eyebrow="Approvals" title="Pending workflow queue" description="These records simulate approval orchestration and escalation flows.">
          <DataGrid
            columns={[
              { id: 'primary', label: 'Request' },
              { id: 'owner', label: 'Owner' },
              { id: 'status', label: 'Status' },
              { id: 'updatedAt', label: 'Submitted' }
            ]}
            rows={data.approvals.map((row) => ({ id: row.id, ...row, primary: row.title, updatedAt: row.submittedAt }))}
            density="compact"
            renderCell={(row, columnId) => {
              if (columnId === 'status') return <StatusBadge label={row.status} tone="warning" />;
              return (row as Record<string, string>)[columnId] || '';
            }}
          />
        </SectionShell>
        <SectionShell eyebrow="Incidents" title="Incident spotlight" description="Admin and support teams can review incidents from a common shell.">
          <div className="space-y-3">
            {data.incidents.map((incident) => (
              <div key={incident.id} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-950">{incident.title}</div>
                  <StatusBadge label={incident.severity} tone={incident.severity === 'High' ? 'danger' : incident.severity === 'Medium' ? 'warning' : 'info'} />
                </div>
                <div className="mt-2 text-sm text-slate-600">Owner: {incident.owner}</div>
                <div className="mt-1 text-sm text-slate-500">Updated {incident.updatedAt}</div>
              </div>
            ))}
          </div>
        </SectionShell>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionShell eyebrow="Jobs" title="Automation monitor" description="A mock view of scheduled processes and health status.">
          <DataGrid
            columns={[
              { id: 'primary', label: 'Job' },
              { id: 'status', label: 'Status' },
              { id: 'startedAt', label: 'Started' },
              { id: 'duration', label: 'Duration' }
            ]}
            rows={data.jobs.map((job) => ({ id: job.id, primary: job.name, status: job.status, startedAt: job.startedAt, duration: job.duration }))}
            density="compact"
            renderCell={(row, columnId) => {
              if (columnId === 'status') return <StatusBadge label={String((row as any)[columnId])} tone={String((row as any)[columnId]) === 'Healthy' ? 'success' : 'warning'} />;
              return String((row as any)[columnId] || '');
            }}
          />
        </SectionShell>
        <SectionShell eyebrow="Audit" title="Recent audit timeline" description="Audit components are reusable across enterprise surfaces and clearly marked as demo-backed.">
          <AuditTimeline events={controlCenterAuditEvents} />
        </SectionShell>
      </div>
    </div>
  );
}
