'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CircleAlert, RefreshCcw, WifiOff } from 'lucide-react';
import type { FinanceNewsItem, FinanceNewsResponse } from '@/lib/types/finance-news';

type Status = 'idle' | 'loading' | 'success' | 'offline' | 'error';

const STORAGE_KEY = 'aft_finance_news_cache_v1';
const REFRESH_MS = 10 * 60 * 1000;

function formatRelativeTime(value: string) {
  const date = Date.parse(value);
  if (!date) return 'Just now';

  const diffMs = date - Date.now();
  const divisions = [
    { amount: 60, unit: 'second' as const },
    { amount: 60, unit: 'minute' as const },
    { amount: 24, unit: 'hour' as const },
    { amount: 7, unit: 'day' as const }
  ];

  let duration = Math.round(diffMs / 1000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(duration, division.unit);
    }
    duration = Math.round(duration / division.amount);
  }

  return formatter.format(duration, 'week');
}

function readCache() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FinanceNewsResponse;
  } catch {
    return null;
  }
}

function writeCache(payload: FinanceNewsResponse) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore localStorage failures
  }
}

export function FinanceNewsSection() {
  const [status, setStatus] = useState<Status>('idle');
  const [online, setOnline] = useState(true);
  const [news, setNews] = useState<FinanceNewsResponse | null>(null);

  const loadNews = useCallback(async () => {
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setOnline(false);
      setStatus('offline');
      return;
    }

    setOnline(true);
    setStatus((current) => (current === 'success' ? current : 'loading'));

    try {
      const response = await fetch('/api/terminal/finance-news', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Unable to load finance news.');
      }

      const payload = (await response.json()) as FinanceNewsResponse;
      if (!payload.items?.length) {
        throw new Error('No finance headlines returned.');
      }
      setNews(payload);
      writeCache(payload);
      setStatus('success');
    } catch {
      const cached = readCache();
      if (cached?.items?.length) {
        setNews(cached);
        setStatus('offline');
      } else {
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached?.items?.length) {
      setNews(cached);
      setStatus('success');
    }

    setOnline(typeof window === 'undefined' ? true : window.navigator.onLine);
    loadNews();

    const handleOnline = () => {
      setOnline(true);
      void loadNews();
    };

    const handleOffline = () => {
      setOnline(false);
      setStatus('offline');
      const cachedNews = readCache();
      if (cachedNews?.items?.length) {
        setNews(cachedNews);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const timer = window.setInterval(() => {
      if (window.navigator.onLine) {
        void loadNews();
      }
    }, REFRESH_MS);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.clearInterval(timer);
    };
  }, [loadNews]);

  const featured = news?.items?.[0] ?? null;
  const secondary = useMemo(() => (news?.items ?? []).slice(1, 7), [news]);

  return (
    <section className="rounded-[32px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(246,249,255,0.82))] p-6 shadow-[0_24px_70px_rgba(15,23,40,0.10)] backdrop-blur-2xl">
      <div className="flex flex-col gap-4 border-b border-slate-100/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Finance news</div>
          <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Editorial market surface</div>
          <p className="mt-2 max-w-[720px] text-sm leading-7 text-slate-600">
            Live finance headlines routed through a server endpoint, blended into the terminal without changing the existing dashboard language.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full border border-white/60 bg-white/75 px-4 py-2 backdrop-blur-xl">
            {online ? 'Online source check active' : 'Offline mode'}
          </span>
          <button
            onClick={() => void loadNews()}
            className="flex items-center gap-2 rounded-full border border-white/55 bg-white/78 px-4 py-2 text-slate-700 transition hover:bg-white"
          >
            <RefreshCcw size={15} /> Refresh
          </button>
        </div>
      </div>

      {status === 'loading' && !featured ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-[320px] animate-pulse rounded-[28px] border border-white/60 bg-slate-100/80" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-h-[150px] animate-pulse rounded-[24px] border border-white/60 bg-slate-100/80" />
            ))}
          </div>
        </div>
      ) : null}

      {(status === 'offline' || status === 'error') && !featured ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-white/72 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            {status === 'offline' ? <WifiOff size={22} /> : <CircleAlert size={22} />}
          </div>
          <div className="mt-4 text-xl font-semibold tracking-[-0.03em] text-slate-950">
            {status === 'offline' ? 'No internet connection' : 'Unable to load finance news'}
          </div>
          <p className="mx-auto mt-3 max-w-[560px] text-sm leading-7 text-slate-600">
            {status === 'offline'
              ? 'The dashboard stayed stable and paused live finance news requests until connectivity returns.'
              : 'Live news could not be fetched right now. The rest of the terminal remains unaffected.'}
          </p>
        </div>
      ) : null}

      {featured ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="relative overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(30,41,59,0.88))] p-7 text-white shadow-[0_28px_80px_rgba(15,23,40,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.24),transparent_34%),radial-gradient(circle_at_left,rgba(15,118,110,0.2),transparent_28%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                  <span>{featured.source}</span>
                  <span className="h-1 w-1 rounded-full bg-white/50" />
                  <span>{formatRelativeTime(featured.publishedAt)}</span>
                </div>
                <h3 className="mt-5 max-w-[760px] text-3xl font-semibold leading-tight tracking-[-0.04em] text-white lg:text-[2.2rem]">
                  {featured.title}
                </h3>
                <p className="mt-5 max-w-[760px] text-base leading-8 text-white/78">{featured.summary || 'Open the story to read the full market context.'}</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-xl">
                  {news?.sourceStatus === 'live' ? 'Live finance feed' : 'Fallback editorial data'}
                </div>
                <Link
                  href={featured.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/18"
                >
                  Open story <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            {secondary.map((item) => (
              <article key={item.id} className="rounded-[24px] border border-white/60 bg-white/78 p-5 shadow-[0_16px_44px_rgba(15,23,40,0.08)] backdrop-blur-xl transition hover:bg-white">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                  <span>{item.source}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                </div>
                <h4 className="mt-4 text-lg font-semibold leading-7 tracking-[-0.03em] text-slate-950">{item.title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary || 'Open the story to read the full market context.'}</p>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950"
                >
                  Read article <ArrowUpRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {(status === 'offline' || status === 'error') && featured ? (
        <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-600">
          {status === 'offline'
            ? 'No internet connection. Showing the last cached finance headlines available on this device.'
            : 'Live source refresh failed. Showing the most recent cached or fallback finance headlines.'}
        </div>
      ) : null}
    </section>
  );
}
