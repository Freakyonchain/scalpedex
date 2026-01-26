// /src/app/market/page.tsx
import { Suspense } from 'react';
import MarketView from '@/features/market/components/MarketView';

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MarketPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-b from-violet-950 to-black">
      <h1 className="text-3xl font-bold text-white mb-6">Analyse du Marché</h1>
      
      <Suspense fallback={
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-violet-900/20 rounded-xl" />
          <div className="h-80 bg-violet-900/20 rounded-xl" />
        </div>
      }>
        <MarketView />
      </Suspense>
    </div>
  );
}