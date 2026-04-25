export function SavedViewSwitcher({ views, activeView }: { views: string[]; activeView: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {views.map((view) => (
        <button key={view} className={`rounded-full px-4 py-2 text-sm font-medium ${view === activeView ? 'bg-slate-950 text-white' : 'border border-white/60 bg-white/88 text-slate-700'}`}>
          {view}
        </button>
      ))}
    </div>
  );
}
