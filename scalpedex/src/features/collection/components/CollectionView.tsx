// /src/features/collection/components/CollectionView.tsx
import React from 'react';
import { Suspense } from 'react';
import { getUserSession } from '@/features/auth/server-actions/auth-actions';
import { getCollectionItems } from '../server-actions/collection-actions';
import { CollectionFilters } from './CollectionFilters';
import { CollectionGrid } from './CollectionGrid';
import { CollectionStats } from './CollectionStats';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';

interface CollectionViewProps {
  searchParams: { search?: string; condition?: string; page?: string };
}

async function CollectionLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-violet-900/20 rounded-xl" />
        ))}
      </div>
      <div className="h-12 bg-violet-900/20 rounded-lg w-full max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-violet-900/20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default async function CollectionView({ searchParams }: CollectionViewProps) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || '';
  const condition = searchParams?.condition || '';
  
  // Récupérer la session utilisateur
  const { user } = await getUserSession();
  const userName = user?.email?.split('@')[0] || 'Collectionneur';

  // Récupérer les données de collection côté serveur pour SSR
  const collectionData = await getCollectionItems({ 
    search, 
    condition, 
    page,
    limit: 12
  });

  // Si la collection est vide (sans filtres actifs)
  if (collectionData.items.length === 0 && !search && !condition) {
    return <EmptyState userName={userName} />;
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={<CollectionLoading />}>
        {/* Stats Cards */}
        <CollectionStats />

        {/* Filtres et Recherche */}
        <CollectionFilters />

        {/* Message pour les résultats filtrés */}
        {(search || condition) && (
          <div className="text-violet-300 mb-4">
            {collectionData.total === 0 ? (
              <p>Aucun résultat trouvé pour votre recherche</p>
            ) : (
              <p>{collectionData.total} résultat(s) trouvé(s)</p>
            )}
          </div>
        )}

        {/* Grille de la Collection */}
        <CollectionGrid initialParams={{ search, condition, page }} />

        {/* Pagination */}
        {collectionData.total > 12 && (
          <Pagination />
        )}
      </Suspense>
    </div>
  );
}