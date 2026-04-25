import { AssetDetailClient } from '@/components/terminal/asset-detail-client';

export default async function AssetDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return <AssetDetailClient symbol={symbol} />;
}
