// /src/features/market/components/MarketItemCard.tsx
'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MarketOpportunity } from '@/types/market.types';

interface MarketItemCardProps {
  opportunity: MarketOpportunity;
}

export function MarketItemCard({ opportunity }: MarketItemCardProps) {
  return (
    <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-violet-800/30 rounded-lg shrink-0 overflow-hidden">
          {opportunity.imageUrl && (
            <img 
              src={opportunity.imageUrl} 
              alt={opportunity.productName} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-white">{opportunity.productName}</h3>
              <p className="text-sm text-violet-300">Retail: {opportunity.retailPrice.toFixed(2)}€</p>
            </div>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
              +{opportunity.profitPercentage.toFixed(0)}% Margin
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-violet-300">
              Market Price: <span className="text-white font-medium">{opportunity.marketPrice.toFixed(2)}€</span>
            </div>
            <button className="text-violet-400 hover:text-white transition-colors flex items-center gap-1">
              Details <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}