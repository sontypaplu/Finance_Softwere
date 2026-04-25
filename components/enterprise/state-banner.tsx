import { StatusBadge } from '@/components/enterprise/status-badge';

export function StateBanner({ title, detail, tone = 'info' }: { title: string; detail: string; tone?: 'info' | 'warning' | 'danger' | 'success' | 'neutral' }) {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-white/55 bg-white/80 p-4 shadow-[0_18px_44px_rgba(15,23,40,0.06)] md:flex-row md:items-start md:justify-between">
      <div>
        <div className="text-sm font-semibold text-slate-950">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{detail}</div>
      </div>
      <StatusBadge label="demo-ready" tone={tone} />
    </div>
  );
}
