export type FinanceNewsItem = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  url: string;
  image?: string | null;
};

export type FinanceNewsResponse = {
  items: FinanceNewsItem[];
  fetchedAt: string;
  sourceStatus: 'live' | 'fallback';
  source?: string;
  fallback?: boolean;
};
