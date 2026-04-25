import { cn } from '@/lib/utils/styles';

const toneMap = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-indigo-50 text-indigo-700 border-indigo-200'
} as const;

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: keyof typeof toneMap }) {
  return <span className={cn('inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]', toneMap[tone])}>{label}</span>;
}
