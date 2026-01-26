// /src/features/market/components/MarketHeatSection.tsx
'use client';

import React from 'react';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { ProductTrend } from '@/types/market.types';

interface MarketHeatSectionProps {
  products: ProductTrend[];
  loading?: boolean;
}

export function MarketHeatSection({ products, loading = false }: MarketHeatSectionProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-violet-900/20 via-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-orange-500" size={24} />
          <h2 className="text-xl font-bold text-white">Market Heat</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-4 h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-gradient-to-r from-violet-900/20 via-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-orange-500" size={24} />
          <h2 className="text-xl font-bold text-white">Market Heat</h2>
        </div>
        <p className="text-violet-300">Aucune tendance disponible pour le moment.</p>
      </div>
    );
  }

  // Helper pour obtenir la classe et l'icône en fonction de la chaleur
  const getHeatIndicator = (heatScore: number) => {
    if (heatScore >= 90) return { class: 'text-orange-400', label: '🔥 Ultra-Hot' };
    if (heatScore >= 75) return { class: 'text-amber-400', label: '⚡ Trending' };
    return { class: 'text-violet-400', label: '📈 Rising' };
  };

  return (
    <div className="bg-gradient-to-r from-violet-900/20 via-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="text-orange-500" size={24} />
        <h2 className="text-xl font-bold text-white">Market Heat</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.slice(0, 3).map((product) => {
          const heatIndicator = getHeatIndicator(product.heatScore);
          
          return (
            <div key={product.id} className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={heatIndicator.class}>{heatIndicator.label}</span>
                {product.trend === 'up' ? (
                  <TrendingUp className="text-green-400" size={20} />
                ) : (
                  <TrendingDown className="text-red-400" size={20} />
                )}
              </div>
              <h3 className="text-white font-medium">{product.name}</h3>
              <p className="text-sm text-violet-300">
                Volume 24h: {product.volumeChange > 0 ? '+' : ''}{product.volumeChange}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}