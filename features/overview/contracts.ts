import type { KPIItem } from '@/lib/types/terminal-pages';

export type OverviewNewsItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  badge: string;
};

export type OverviewPayload = {
  kpis: KPIItem[];
  trend: { month: string; portfolio: number; benchmark: number }[];
  allocation: { name: string; value: number }[];
  news: OverviewNewsItem[];
  recent: { id: string; title: string; meta: string; amount: string; date: string }[];
  alerts: { title: string; detail: string }[];
};
