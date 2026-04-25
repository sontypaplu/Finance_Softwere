export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-[28px] border border-white/55 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,40,0.08)] backdrop-blur-xl">
      <div className="animate-pulse space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-4 rounded-full bg-slate-200/70" />
        ))}
      </div>
    </div>
  );
}
