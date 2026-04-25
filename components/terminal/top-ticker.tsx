export type TickerItem = {
  symbol: string;
  price: string;
  change: string;
  positive: boolean;
};

export function TopTicker({ items }: { items: TickerItem[] }) {
  const merged = [...items, ...items];

  return (
    <div className="rounded-full border border-white/50 bg-white/70 px-4 py-3 shadow-[0_16px_40px_rgba(15,23,40,0.08)] backdrop-blur-2xl">
      <div className="marquee">
        <div className="marquee-track">
          {merged.map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="inline-flex items-center gap-3 rounded-full border border-slate-100 bg-white/80 px-4 py-2 text-sm">
              <span className="font-semibold text-slate-900">{item.symbol}</span>
              <span className="text-slate-600">{item.price}</span>
              <span className={`font-medium ${item.positive ? 'text-emerald-600' : 'text-rose-600'}`}>{item.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
