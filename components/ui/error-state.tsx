export function ErrorState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[28px] border border-rose-100 bg-rose-50/90 p-6 shadow-[0_18px_50px_rgba(244,63,94,0.08)] backdrop-blur-xl">
      <div className="text-lg font-semibold tracking-[-0.03em] text-rose-700">{title}</div>
      <p className="mt-2 text-sm leading-6 text-rose-600">{detail}</p>
    </div>
  );
}
