export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[28px] border border-white/55 bg-white/80 p-6 text-center shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
      <div className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}
