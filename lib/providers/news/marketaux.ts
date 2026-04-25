import { nanoid } from 'nanoid';
import type { FinanceNewsFeed } from '@/lib/contracts/market-data';

const MARKETAUX_URL = 'https://api.marketaux.com/v1/news/all';

export async function getMarketauxIndiaFinanceNews(apiKey: string, limit = 8): Promise<FinanceNewsFeed> {
  const url = new URL(MARKETAUX_URL);
  url.searchParams.set('api_token', apiKey);
  url.searchParams.set('countries', 'in');
  url.searchParams.set('language', 'en');
  url.searchParams.set('filter_entities', 'true');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('industries', 'Financial');

  const response = await fetch(url.toString(), {
    headers: { accept: 'application/json' },
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Marketaux request failed with ${response.status}`);
  }

  const payload = await response.json() as {
    data?: Array<{
      uuid?: string;
      title?: string;
      description?: string;
      source?: string;
      published_at?: string;
      url?: string;
      image_url?: string | null;
    }>;
  };

  return {
    items: (payload.data || []).map((item) => ({
      id: item.uuid || nanoid(),
      title: item.title || 'Untitled financial update',
      source: item.source || 'Marketaux',
      publishedAt: item.published_at || new Date().toISOString(),
      summary: item.description || 'No summary available.',
      url: item.url || '#',
      image: item.image_url || null
    })),
    fetchedAt: new Date().toISOString(),
    source: 'marketaux',
    fallback: false
  };
}
