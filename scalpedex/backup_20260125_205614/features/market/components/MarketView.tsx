// /src/features/market/components/MarketView.tsx
import React from 'react';
import { Suspense } from 'react';
import { getMarketData } from '../server-actions/market-actions';
import { MarketHeatSection } from './MarketHeatSection';
import { MarketOpportunitiesSection } from './MarketOpportunitiesSection';
import { LiveFeedSection } from './LiveFeedSection';
import { MarketStatsSection } from './MarketStatsSection';

function MarketLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-violet-900/20 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-violet-900/20 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-violet-900/20 rounded-xl" />
      <div className="h-64 bg-violet-900/20 rounded-xl" />
    </div>
  );
}

export default async function MarketView() {
  // Récupérer les données de marché côté serveur pour SSR
  const marketData = await getMarketData();

  return (
    <div className="space-y-6">
      <Suspense fallback={<MarketLoading />}>
        {/* Section Market Heat */}
        <MarketHeatSection products={marketData.hotProducts} />

        {/* Market Stats */}
        <MarketStatsSection stats={marketData.stats} />

        {/* Opportunités de scalping */}
        <MarketOpportunitiesSection opportunities={marketData.opportunities} />

        {/* Feed en direct */}
        <LiveFeedSection sales={marketData.recentSales} />
      </Suspense>
    </div>
  );
}