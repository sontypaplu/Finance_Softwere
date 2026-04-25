import { financeNewsFallback } from '@/lib/data/finance-news-fallback';
import type { FinanceNewsItem, FinanceNewsResponse } from '@/lib/types/finance-news';

const FEED_URLS = [
  'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=(markets%20OR%20stocks%20OR%20earnings%20OR%20macroeconomics%20OR%20commodities%20OR%20banking%20OR%20investing)%20when:1d&hl=en-IN&gl=IN&ceid=IN:en'
];

const SOURCE_WHITELIST = new Set([
  'Reuters',
  'Bloomberg',
  'The Wall Street Journal',
  'Financial Times',
  'CNBC',
  'MarketWatch',
  "Barron's",
  'Associated Press',
  'AP News',
  'The Economist',
  'Yahoo Finance'
]);

const KEYWORD_PATTERN = /(market|markets|stock|stocks|business|earnings|macro|economy|economic|commodit|bank|banking|invest|yield|bond|fed|inflation|currency|fx|oil|gold)/i;

let cachedResponse: FinanceNewsResponse | null = null;
let cachedAt = 0;
const CACHE_WINDOW_MS = 5 * 60 * 1000;

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function normalizeLink(url: string) {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_medium');
    parsed.searchParams.delete('utm_campaign');
    return parsed.toString();
  } catch {
    return url;
  }
}

function extractSource(block: string, title: string) {
  const sourceTag = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
  if (sourceTag) {
    return decodeEntities(sourceTag[1]);
  }

  const separator = title.lastIndexOf(' - ');
  if (separator > 0) {
    return title.slice(separator + 3).trim();
  }

  return 'Unknown';
}

function extractTitle(rawTitle: string) {
  const separator = rawTitle.lastIndexOf(' - ');
  if (separator > 0) {
    return rawTitle.slice(0, separator).trim();
  }
  return rawTitle.trim();
}

function parseFeed(xml: string) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);

  return items.map((block, index) => {
    const rawTitle = pickTag(block, 'title');
    const title = extractTitle(rawTitle);
    const source = extractSource(block, rawTitle);
    const summary = pickTag(block, 'description');
    const url = normalizeLink(pickTag(block, 'link'));
    const publishedAt = pickTag(block, 'pubDate');

    return {
      id: `${source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}-${Buffer.from(title).toString('base64').slice(0, 10)}`,
      title,
      source,
      summary,
      url,
      publishedAt,
      image: null
    } satisfies FinanceNewsItem;
  });
}

function uniqByTitle(items: FinanceNewsItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortByDate(items: FinanceNewsItem[]) {
  return [...items].sort((a, b) => {
    const aTime = Date.parse(a.publishedAt || '') || 0;
    const bTime = Date.parse(b.publishedAt || '') || 0;
    return bTime - aTime;
  });
}

function isAllowed(item: FinanceNewsItem) {
  const haystack = `${item.title} ${item.summary}`;
  return SOURCE_WHITELIST.has(item.source) && KEYWORD_PATTERN.test(haystack);
}

async function fetchFeed(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; AureliusFinanceTerminal/1.0; +https://localhost)',
        accept: 'application/rss+xml, application/xml, text/xml, text/plain;q=0.9, */*;q=0.8'
      },
      cache: 'no-store',
      signal: controller.signal,
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Feed request failed: ${response.status}`);
    }

    const xml = await response.text();
    return parseFeed(xml);
  } finally {
    clearTimeout(timeout);
  }
}

export async function getFinanceNews(): Promise<FinanceNewsResponse> {
  if (cachedResponse && Date.now() - cachedAt < CACHE_WINDOW_MS) {
    return cachedResponse;
  }

  const results = await Promise.allSettled(FEED_URLS.map((feed) => fetchFeed(feed)));
  const liveItems = sortByDate(
    uniqByTitle(
      results
        .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
        .filter(isAllowed)
    )
  ).slice(0, 7);

  const response: FinanceNewsResponse = liveItems.length
    ? {
        items: liveItems,
        fetchedAt: new Date().toISOString(),
        sourceStatus: 'live'
      }
    : {
        items: financeNewsFallback,
        fetchedAt: new Date().toISOString(),
        sourceStatus: 'fallback'
      };

  cachedResponse = response;
  cachedAt = Date.now();
  return response;
}
