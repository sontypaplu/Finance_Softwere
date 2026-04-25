export function LoadingSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-2xl bg-slate-100/90" />
      ))}
    </div>
  );
}
