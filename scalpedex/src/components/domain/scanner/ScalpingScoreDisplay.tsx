'use client';

import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { ScalpingScore } from '@/types/scanner.types';

interface ScalpingScoreDisplayProps {
  retailPrice: number;
  marketPrice: number;
  score: ScalpingScore;
}

export function ScalpingScoreDisplay({ retailPrice, marketPrice, score }: ScalpingScoreDisplayProps) {
  const getScoreColor = () => {
    if (score.score >= 80) return 'text-green-400';
    if (score.score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = () => {
    if (score.score >= 80) return 'bg-green-400/10';
    if (score.score >= 50) return 'bg-yellow-400/10';
    return 'bg-red-400/10';
  };

  return (
    <div className={`w-full max-w-md p-4 rounded-xl backdrop-blur-sm border border-violet-800/50 ${getScoreBackground()} transition-colors`}>
      {/* Header avec Score */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-violet-300 text-sm font-medium">Scalping Score</h3>
          <p className={`text-3xl font-bold ${getScoreColor()}`}>
            {score.score.toFixed(0)}
          </p>
        </div>
        <div className={`${getScoreColor()} text-right`}>
          <p className="text-lg font-bold">
            {score.profit > 0 ? `+$${score.profit.toFixed(2)}` : `-$${Math.abs(score.profit).toFixed(2)}`}
          </p>
          <p className="text-sm">
            {score.profitPercentage > 0 ? '+' : ''}{score.profitPercentage.toFixed(1)}%
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
          {score.recommendation}
        </p>
      </div>
    </div>
  );
}