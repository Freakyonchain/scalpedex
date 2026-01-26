// src/features/collection/components/CollectionView.tsx
import React from 'react';
import { Suspense } from 'react';
import { getUserSession } from '@/app/actions/auth-actions';
import { getCollectionItems } from '@/app/actions/collection-actions';
import { CollectionFilters } from './CollectionFilters';
import { CollectionGrid } from './CollectionGrid';
import { CollectionStats } from './CollectionStats';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { Package } from 'lucide-react';

// Définir le type de searchParams pour être compatible avec la version asynchrone
interface CollectionViewProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function CollectionLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-violet-900/20 rounded-xl" />
        ))}
      </div>
      <div className="h-12 bg-violet-900/20 rounded-lg w-full max-w-md" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-52 bg-violet-900/20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default async function CollectionView({ searchParams }: CollectionViewProps) {
  // Extraction sécurisée des valeurs de searchParams
  const pageParam = searchParams.page;
  const pageNum = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const page = isNaN(pageNum) ? 1 : pageNum;
  
  const searchParam = searchParams.search;
  const search = typeof searchParam === 'string' ? searchParam : '';
  
  const conditionParam = searchParams.condition;
  const condition = typeof conditionParam === 'string' ? conditionParam : '';
  
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
    <div className="px-2 space-y-4 pb-20">
      <header className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Package size={20} className="text-violet-400" />
          <h1 className="text-2xl font-bold text-white">Ma Collection</h1>
        </div>
        <p className="text-sm text-violet-300">
          Gérez et suivez vos produits collectionnés
        </p>
      </header>
      
      <Suspense fallback={<CollectionLoading />}>
        {/* Stats Cards */}
        <div className="mb-6">
          <CollectionStats />
        </div>

        {/* Filtres et Recherche */}
        <div className="sticky top-0 z-10 py-2 bg-black/50 backdrop-blur-md -mx-2 px-2 mb-4">
          <CollectionFilters />
        </div>

        {/* Message pour les résultats filtrés */}
        {(search || condition) && (
          <div className="text-violet-300 text-sm mb-3">
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