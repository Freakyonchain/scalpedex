// /src/app/collection/page.tsx
import { Suspense } from 'react';
import CollectionView from '@/components/domain/collection/CollectionView';

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CollectionPage({
  searchParams
}: {
  searchParams: { search?: string; condition?: string; page?: string }
}) {
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-b from-violet-950 to-black">
      <h1 className="text-3xl font-bold text-white mb-6">Ma Collection</h1>
      
      <Suspense fallback={
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-violet-900/20 rounded-xl" />
          <div className="h-80 bg-violet-900/20 rounded-xl" />
        </div>
      }>
        <CollectionView searchParams={searchParams} />
      </Suspense>
    </div>
  );
}