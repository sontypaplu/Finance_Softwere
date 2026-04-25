import type { FinanceNewsFeed } from '@/lib/contracts/market-data';
import { getMarketauxIndiaFinanceNews } from '@/lib/providers/news/marketaux';
import { getFinanceNews as getFallbackFinanceNews } from '@/lib/server/finance-news';

export async function getIndianFinanceNews(): Promise<FinanceNewsFeed> {
  const provider = process.env.NEWS_PROVIDER || 'marketaux';
  const apiKey = process.env.NEWS_PROVIDER_API_KEY || '';

  if (provider === 'marketaux' && apiKey) {
    try {
      return await getMarketauxIndiaFinanceNews(apiKey, 8);
    } catch {
      // fallback below
    }
  }

  const fallback = await getFallbackFinanceNews();
  return {
    items: fallback.items,
    fetchedAt: fallback.fetchedAt,
    source: 'rss-fallback',
    fallback: true
  };
}
