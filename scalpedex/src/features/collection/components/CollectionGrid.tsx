// /src/features/collection/components/CollectionGrid.tsx
'use client';

import React from 'react';
import { ItemCard } from './ItemCard';
import { ItemModal } from './ItemModal';
import { useCollection } from '../hooks/useCollection';
import { CollectionQueryParams } from '../types/collection-types';

interface CollectionGridProps {
  initialParams?: CollectionQueryParams;
}

export function CollectionGrid({ initialParams = {} }: CollectionGridProps) {
  const {
    items,
    loading,
    error,
    selectedItem,
    setSelectedItem
  } = useCollection(initialParams);

  if (loading) {
    return (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
{[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-violet-900/20 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
<p>{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-violet-300">
          Aucun item ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }
  return (
    <>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
{items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {selectedItem && (
        <ItemModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </>
  );
}