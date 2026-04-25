export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
      <div className="text-lg font-semibold text-slate-950">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}
