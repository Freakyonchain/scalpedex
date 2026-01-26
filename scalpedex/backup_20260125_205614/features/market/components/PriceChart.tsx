// /src/features/market/components/PriceChart.tsx
'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { PriceHistory } from '../types/market-types';

interface PriceChartProps {
  priceHistory: PriceHistory | null;
  loading?: boolean;
}

export function PriceChart({ priceHistory, loading = false }: PriceChartProps) {
  if (loading) {
    return (
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 h-80 animate-pulse">
        <div className="h-8 w-40 bg-violet-800/30 rounded mb-4" />
        <div className="h-full w-full bg-violet-800/30 rounded" />
      </div>
    );
  }

  if (!priceHistory) {
    return (
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <h3 className="text-lg font-medium text-white mb-2">Historique des prix</h3>
        <p className="text-violet-300">Aucune donnée disponible</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)}€`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
      <h3 className="text-lg font-medium text-white mb-2">{priceHistory.productName}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={priceHistory.history}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#6b46c1" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate} 
              stroke="#a78bfa" 
              tick={{ fill: '#a78bfa' }}
            />
            <YAxis 
              tickFormatter={formatPrice} 
              stroke="#a78bfa"
              tick={{ fill: '#a78bfa' }}
            />
            <Tooltip 
              formatter={(value: number) => formatPrice(value)}
              labelFormatter={(value) => formatDate(value as string)}
              contentStyle={{ 
                backgroundColor: 'rgba(76, 29, 149, 0.8)', 
                border: '1px solid rgba(139, 92, 246, 0.5)',
                borderRadius: '0.5rem',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#c4b5fd', r: 4 }}
              activeDot={{ r: 6, fill: '#a78bfa' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-violet-300 mt-2 text-right">
        Dernière mise à jour: {new Date(priceHistory.lastUpdated).toLocaleString('fr-FR')}
      </p>
    </div>
  );
}