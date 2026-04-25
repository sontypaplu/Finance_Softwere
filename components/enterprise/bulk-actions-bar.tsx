export function BulkActionsBar({ label, actions }: { label: string; actions: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-white/55 bg-slate-50/80 px-4 py-3">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button key={action} className="rounded-full border border-white/60 bg-white px-3 py-2 text-sm font-medium text-slate-700">{action}</button>
        ))}
      </div>
    </div>
  );
}
