import type { FilterRule } from '@/lib/contracts/api';

export function FilterBar({ filters }: { filters: FilterRule[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button key={`${filter.field}-${filter.operator}`} className="rounded-full border border-white/60 bg-white/88 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,40,0.04)]">
          {filter.label || filter.field}
        </button>
      ))}
    </div>
  );
}
