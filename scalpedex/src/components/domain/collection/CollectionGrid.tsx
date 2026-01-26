'use client';

import React from 'react';
import { ItemCard } from './ItemCard';
import { ItemModal } from './ItemModal';
import { useCollection } from '@/hooks/useCollection';
import { CollectionQueryParams } from '@/types/collection.types';

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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '12px',
        justifyItems: 'center'
      }}>
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            style={{
              height: '220px',
              width: '160px',
              maxHeight: '220px',
              maxWidth: '160px',
              borderRadius: '12px',
              background: 'linear-gradient(to bottom, rgba(76, 29, 149, 0.3), rgba(49, 46, 129, 0.3))',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div style={{ height: '120px', backgroundColor: 'rgba(76, 29, 149, 0.2)' }}></div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '12px', backgroundColor: 'rgba(76, 29, 149, 0.2)', borderRadius: '4px' }}></div>
              <div style={{ height: '12px', backgroundColor: 'rgba(76, 29, 149, 0.2)', width: '66%', borderRadius: '4px' }}></div>
              <div style={{ height: '16px', backgroundColor: 'rgba(76, 29, 149, 0.2)', width: '50%', marginTop: '8px', borderRadius: '4px' }}></div>
            </div>
            {/* Animation de ligne de scan */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-scan"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-700/40 
                   text-red-300 text-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-purple-900/10 animate-pulse"></div>
        <div className="relative z-10">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 bg-gradient-to-b from-violet-900/10 to-black/20 
                   backdrop-blur-sm rounded-xl border border-violet-800/30
                   relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-violet opacity-20"></div>
        <div className="relative z-10">
          <p className="text-violet-300 text-sm font-medium">
            Aucun item ne correspond à vos critères de recherche.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '12px',
        justifyItems: 'center'
      }}>
        {items.map((item) => (
          <div key={item.id} className="animate-fadeIn">
            <ItemCard
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          </div>
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