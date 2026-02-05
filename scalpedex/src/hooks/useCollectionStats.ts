'use client';

import { useState, useEffect } from 'react';
import { getPortfolioStats, type PortfolioStats } from '@/app/actions/collection-actions';

export function useCollectionStats() {
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalCost: 0,
    totalProfit: 0,
    totalItems: 0,
    sealedCount: 0,
    avgRoi: 0,
    bestRoiItem: null,
    bestRoiPercent: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getPortfolioStats();

      if (result.success && result.data) {
        setStats(result.data);
      } else if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Stats load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats
  };
}
