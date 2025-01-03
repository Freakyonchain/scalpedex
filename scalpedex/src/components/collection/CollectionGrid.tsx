'use client'

import React, { useState } from 'react';
import { CollectionItem } from '@/types/collection';
import { SmartImage } from './SmartImage';
import { ItemModal } from './ItemModal';
import { CONDITIONS } from '@/types/collection';

interface CollectionGridProps {
  items: CollectionItem[];
}

export function CollectionGrid({ items }: CollectionGridProps) {
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          // Vérification si le produit existe et extraction sécurisée des données
          const productName = item?.products?.name || 'Produit inconnu';
          const imageUrl = item?.products?.image_url || '';
          const condition = item?.condition || 'MINT';
          const quantity = item?.quantity || 1;
          const purchasePrice = item?.purchase_price || 0;

          return (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="group p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl 
                       border border-violet-800/50 hover:border-violet-600/50 
                       transition-all duration-300 cursor-pointer
                       hover:transform hover:scale-[1.02]"
            >
              <SmartImage 
                src={imageUrl}
                alt={productName}
                className="w-full aspect-square mb-3"
              />
              
              <h3 className="font-medium text-white group-hover:text-violet-300 
                           transition-colors truncate">
                {productName}
              </h3>
              
              <p className="text-violet-300 text-sm mt-1">
                {CONDITIONS[condition] || 'État inconnu'} • Qté: {quantity}
              </p>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-white font-medium">
                  {Number(purchasePrice).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
            </div>
          );
        })}
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