export function LogoBadge({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${small ? 'h-9 w-9' : 'h-12 w-12'} rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#4f46e5_55%,#111827_100%)] shadow-[0_14px_32px_rgba(79,70,229,0.22)]`}>
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold tracking-[0.28em] text-white">AF</div>
      </div>
      <div>
        <div className={`${small ? 'text-sm' : 'text-base'} font-semibold tracking-[0.2em] text-slate-900`}>AURELIUS</div>
        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Finance Terminal</div>
      </div>
    </div>
  );
}
