// components/scanner/ScalpingScore.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

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

  const getRecommendation = () => {
    if (score >= 80) return 'SCALP RAPIDE 🔥';
    if (score >= 50) return 'Potentiel intéressant';
    return 'À éviter';
  };

  return (
    <div className="mt-4 p-3 bg-black/20 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-violet-300 text-sm">Scalping Score</span>
        <span className={`text-xl font-bold ${getScoreColor()}`}>
          {score.toFixed(0)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
        <div>
          <span className="text-violet-400">Prix Retail</span>
          <p className="text-white font-medium">${retailPrice.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-violet-400">Prix Market</span>
          <p className="text-white font-medium">${marketPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TrendingUp size={16} className={getScoreColor()} />
        <span className={`${getScoreColor()} font-medium`}>
          {profit > 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`}
          {' '}
          ({profitPercentage > 0 ? '+' : ''}{profitPercentage.toFixed(1)}%)
        </span>
      </div>

      <p className={`text-center font-bold mt-2 ${getScoreColor()}`}>
        {getRecommendation()}
      </p>
    </div>
  );
};