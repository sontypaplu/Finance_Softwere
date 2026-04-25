'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export type NewsItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  badge: string;
};

export function NewsCarousel({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [items.length]);

  const item = items[active];

  return (
    <div className="rounded-[30px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(245,248,255,0.8))] p-4 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[280px] overflow-hidden rounded-[26px]">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,40,0.08),rgba(15,23,40,0.38))]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/40 bg-white/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-xl">
            {item.badge}
          </div>
          <div className="absolute bottom-5 left-5 max-w-[70%] text-white">
            <div className="text-sm uppercase tracking-[0.24em] text-white/80">{item.category}</div>
            <div className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.03em]">{item.title}</div>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-[26px] border border-white/60 bg-white/78 p-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Market spotlight</div>
            <div className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950">Live editorial surface for your terminal homepage</div>
            <p className="mt-4 text-base leading-7 text-slate-600">{item.summary}</p>
          </div>
          <div className="mt-6 flex gap-2">
            {items.map((news, index) => (
              <button
                key={news.id}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition ${index === active ? 'w-10 bg-slate-900' : 'w-2.5 bg-slate-300'}`}
                aria-label={`Go to ${news.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
