import { cn } from '@/lib/utils/styles';

const toneMap = {
  up: 'bg-emerald-50 text-emerald-600',
  down: 'bg-rose-50 text-rose-600',
  flat: 'bg-slate-100 text-slate-600'
} as const;

export function MetricCard({ label, value, delta, tone = 'flat' }: { label: string; value: string; delta?: string; tone?: keyof typeof toneMap }) {
  return (
    <div className="rounded-[28px] border border-white/55 bg-white/78 p-5 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{value}</div>
      {delta ? <div className={cn('mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium', toneMap[tone])}>{delta}</div> : null}
    </div>
  );
}
