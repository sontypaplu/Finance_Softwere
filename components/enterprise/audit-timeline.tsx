import type { AuditLogEvent } from '@/lib/contracts/audit';
import { StatusBadge } from '@/components/enterprise/status-badge';

export function AuditTimeline({ events }: { events: AuditLogEvent[] }) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-950">{event.summary}</div>
              <div className="mt-1 text-sm text-slate-500">{event.actor.name} · {event.target.entityLabel} · {event.timestamp}</div>
            </div>
            <StatusBadge label={event.status} tone={event.status === 'success' ? 'success' : event.status === 'warning' ? 'warning' : 'danger'} />
          </div>
        </div>
      ))}
    </div>
  );
}
