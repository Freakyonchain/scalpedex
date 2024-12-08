// components/scanner/ScalpingScore.tsx
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ScalpingScoreProps {
  retailPrice: number;
  marketPrice: number;
}

export const ScalpingScore = ({ retailPrice, marketPrice }: ScalpingScoreProps) => {
  const profit = marketPrice - retailPrice;
  const profitPercentage = (profit / retailPrice) * 100;
  
  // Score de 0 à 100 basé sur la marge
  const score = Math.min(100, Math.max(0, profitPercentage * 2));
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = () => {
    if (score >= 80) return 'bg-green-400/10';
    if (score >= 50) return 'bg-yellow-400/10';
    return 'bg-red-400/10';
  };

  const getRecommendation = () => {
    if (score >= 80) return '🔥 SCALP IMMÉDIAT';
    if (score >= 50) return '👍 Potentiel intéressant';
    return '❌ Pas rentable';
  };

  return (
    <div className={`w-full max-w-md p-4 rounded-xl backdrop-blur-sm border border-violet-800/50 ${getScoreBackground()} transition-colors`}>
      {/* Header avec Score */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-violet-300 text-sm font-medium">Scalping Score</h3>
          <p className={`text-3xl font-bold ${getScoreColor()}`}>
            {score.toFixed(0)}
          </p>
        </div>
        <div className={`${getScoreColor()} text-right`}>
          <p className="text-lg font-bold">
            {profit > 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`}
          </p>
          <p className="text-sm">
            {profitPercentage > 0 ? '+' : ''}{profitPercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Prix Détails */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg bg-black/20">
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <DollarSign size={16} />
            <span className="text-sm">Prix Retail</span>
          </div>
          <p className="text-xl font-bold text-white">${retailPrice.toFixed(2)}</p>
        </div>
        <div className="p-3 rounded-lg bg-black/20">
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <TrendingUp size={16} />
            <span className="text-sm">Prix Market</span>
          </div>
          <p className="text-xl font-bold text-white">${marketPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`text-center py-2 px-4 rounded-lg ${getScoreBackground()} border border-violet-800/50`}>
        <p className={`font-bold ${getScoreColor()}`}>
          {getRecommendation()}
        </p>
      </div>
    </div>
  );
};