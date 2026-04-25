export function DetailSidePanel({ title, description, badges, fields }: { title: string; description: string; badges: string[]; fields: { label: string; value: string }[] }) {
  return (
    <aside className="rounded-[28px] border border-white/55 bg-white/84 p-5 shadow-[0_22px_60px_rgba(15,23,40,0.08)]">
      <div className="text-lg font-semibold text-slate-950">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span key={badge} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">{badge}</span>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {fields.map((field) => (
          <div key={field.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{field.label}</div>
            <div className="mt-1 text-sm font-medium text-slate-800">{field.value}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
