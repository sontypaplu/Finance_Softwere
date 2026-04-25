import type { KPIItem } from '@/lib/types/terminal-pages';

export type MarketBoardCard = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  direction: 'up' | 'down';
  region: string;
};

export type WatchlistRow = {
  symbol: string;
  name: string;
  last: string;
  change: string;
  volume: string;
  trigger: string;
  thesis: string;
  route: string;
};

export type WatchlistPayload = {
  kpis: KPIItem[];
  board: MarketBoardCard[];
  pulse: { month: string; portfolio: number; benchmark: number }[];
  watchlist: WatchlistRow[];
  movers: { symbol: string; name: string; change: string; reason: string }[];
  themes: { title: string; detail: string }[];
  breadth: { name: string; value: number }[];
};

export type CalendarEventItem = {
  time: string;
  title: string;
  type: 'earnings' | 'dividend' | 'obligation' | 'macro';
  detail: string;
  value: string;
  status: string;
};

export type CalendarPayload = {
  kpis: KPIItem[];
  timeline: { day: string; date: string; items: CalendarEventItem[] }[];
  earnings: { symbol: string; name: string; when: string; estimate: string; focus: string }[];
  dividends: { security: string; exDate: string; payable: string; amount: string; note: string }[];
  obligations: { title: string; due: string; amount: string; status: string; detail: string }[];
  distribution: { name: string; value: number }[];
};

export type RebalancingPayload = {
  kpis: KPIItem[];
  bands: { name: string; current: number; target: number }[];
  drifts: { sleeve: string; current: string; target: string; drift: string; action: string; amount: string }[];
  actions: { title: string; detail: string }[];
  tradeList: { side: 'Buy' | 'Sell'; security: string; amount: string; account: string; rationale: string }[];
};

export type GoalCard = {
  title: string;
  target: string;
  current: string;
  funded: number;
  due: string;
  monthlyNeed: string;
  priority: string;
};

export type GoalsPayload = {
  kpis: KPIItem[];
  goals: GoalCard[];
  projection: { month: string; portfolio: number; benchmark: number }[];
  buckets: { name: string; value: number }[];
  milestones: { title: string; due: string; amount: string; status: string }[];
  insights: { title: string; detail: string }[];
};

export type ReportCard = {
  title: string;
  type: string;
  cadence: string;
  lastRun: string;
  status: string;
  format: string;
};

export type ReportsPayload = {
  kpis: KPIItem[];
  library: ReportCard[];
  exports: { id: string; title: string; requested: string; range: string; size: string; status: string }[];
  scheduled: { title: string; cadence: string; nextRun: string; recipients: string }[];
  categories: { name: string; value: number }[];
  notes: { title: string; detail: string }[];
};
