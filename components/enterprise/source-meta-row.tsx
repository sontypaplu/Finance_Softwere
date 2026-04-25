import type { RequestMeta } from '@/lib/contracts/api';

export function SourceMetaRow({ meta }: { meta: RequestMeta | null | undefined }) {
  if (!meta) return null;
  return (
    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
      <span className="rounded-full border border-white/60 bg-white/80 px-3 py-1">Source: {meta.source}</span>
      <span className="rounded-full border border-white/60 bg-white/80 px-3 py-1">Env: {meta.environment}</span>
      <span className="rounded-full border border-white/60 bg-white/80 px-3 py-1">Request: {meta.requestId}</span>
      <span className="rounded-full border border-white/60 bg-white/80 px-3 py-1">Updated: {new Date(meta.generatedAt).toLocaleString()}</span>
    </div>
  );
}
