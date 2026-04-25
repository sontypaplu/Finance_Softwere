export type MarketQuote = {
  symbol: string;
  name: string;
  currency: string;
  exchange?: string;
  marketState?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime?: string;
  source: string;
};

export type HistoricalPricePoint = {
  date: string;
  close: number;
  volume?: number;
};

export type HistoricalPriceSeries = {
  symbol: string;
  currency: string;
  points: HistoricalPricePoint[];
  source: string;
};

export type FinanceNewsArticle = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  url: string;
  image?: string | null;
  sentiment?: 'positive' | 'neutral' | 'negative';
};

export type FinanceNewsFeed = {
  items: FinanceNewsArticle[];
  fetchedAt: string;
  source: string;
  fallback: boolean;
};
