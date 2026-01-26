// /src/features/market/components/MarketStatsSection.tsx
'use client';

import React from 'react';
import { Package, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketStats } from '../types/market-types';

interface MarketStatsSectionProps {
  stats: MarketStats;
  loading?: boolean;
}

export function MarketStatsSection({ stats, loading = false }: MarketStatsSectionProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package size={20} className="text-violet-400" />
          <h3 className="text-white font-medium">Volume 24h</h3>
        </div>
        <p className="text-2xl font-bold text-white">
          {stats.volume24h.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm flex items-center gap-1 mt-1">
          {stats.volumeChange >= 0 ? (
            <>
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-green-400">+{stats.volumeChange.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-red-400" />
              <span className="text-red-400">{stats.volumeChange.toFixed(1)}%</span>
            </>
          )}
        </p>
      </div>
      
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={20} className="text-violet-400" />
          <h3 className="text-white font-medium">Prix Moyen</h3>
        </div>
        <p className="text-2xl font-bold text-white">
          {stats.averagePrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
        <p className="text-sm flex items-center gap-1 mt-1">
          {stats.priceChange >= 0 ? (
            <>
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-green-400">+{stats.priceChange.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-red-400" />
              <span className="text-red-400">{stats.priceChange.toFixed(1)}%</span>
            </>
          )}
        </p>
      </div>
      
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package size={20} className="text-violet-400" />
          <h3 className="text-white font-medium">Catégorie Tendance</h3>
        </div>
        <p className="text-2xl font-bold text-white">{stats.topCategory}</p>
        <p className="text-sm text-violet-300 mt-1">
          Mise à jour: {new Date(stats.timestamp).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  );
}