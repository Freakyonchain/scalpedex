// /src/features/collection/components/ItemCard.tsx
'use client';

import React from 'react';
import { CollectionItem, CONDITIONS } from '../types/collection-types';
import { SmartImage } from './SmartImage';

interface ItemCardProps {
  item: CollectionItem;
  onClick: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const { product, condition, quantity, purchasePrice } = item;
  
  return (
    <div 
      onClick={onClick}
      className="group p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl 
               border border-violet-800/50 hover:border-violet-600/50 
               transition-all duration-300 cursor-pointer
               hover:transform hover:scale-[1.02]"
    >
      <SmartImage 
        src={product.imageUrl}
        alt={product.name}
        className="w-full aspect-square mb-3"
      />
      
      <h3 className="font-medium text-white group-hover:text-violet-300 
                   transition-colors truncate">
        {product.name}
      </h3>
      
      <p className="text-violet-300 text-sm mt-1">
        {CONDITIONS[condition] || 'État inconnu'} • Qté: {quantity}
      </p>
      
      <div className="flex items-center justify-between mt-3">
        <span className="text-white font-medium">
          {purchasePrice.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          })}
        </span>
      </div>
    </div>
  );
}