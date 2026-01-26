// /src/features/market/components/LiveFeedSection.tsx
'use client';

import React from 'react';
import { Timer, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketSale } from '../types/market-types';
import { formatTimeAgo } from '../utils/market-formatters';

interface LiveFeedSectionProps {
  sales: MarketSale[];
  loading?: boolean;
}

export function LiveFeedSection({ sales, loading = false }: LiveFeedSectionProps) {
  if (loading) {
    return (
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 animate-pulse">
        <h2 className="text-xl font-bold text-white mb-4">📊 Live Market Feed</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-20 bg-black/20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <h2 className="text-xl font-bold text-white mb-4">📊 Live Market Feed</h2>
        <p className="text-violet-300">Aucune vente récente disponible.</p>
      </div>
    );
  }

  return (
    <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
      <h2 className="text-xl font-bold text-white mb-4">📊 Live Market Feed</h2>
      <div className="space-y-3">
        {sales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Timer size={20} className="text-violet-400" />
              <div>
                <h4 className="text-white font-medium">{sale.productName}</h4>
                <p className="text-sm text-violet-300">{sale.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{sale.price.toFixed(2)}€</p>
              <p className="text-sm flex items-center gap-1 justify-end">
                {sale.trend === 'up' ? (
                  <>
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-green-400">Vendu {formatTimeAgo(sale.timestamp)}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown size={14} className="text-red-400" />
                    <span className="text-red-400">Vendu {formatTimeAgo(sale.timestamp)}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}