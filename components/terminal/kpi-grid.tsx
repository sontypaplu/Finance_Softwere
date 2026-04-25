export function KPIGrid({ items }: { items: { label: string; value: string; change: string; tone: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="rounded-[28px] border border-white/55 bg-white/78 p-5 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
          <div className="text-sm font-medium text-slate-500">{item.label}</div>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{item.value}</div>
          <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${item.tone === 'up' ? 'bg-emerald-50 text-emerald-600' : item.tone === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
            {item.change}
          </div>
        </div>
      ))}
    </div>
  );
}
