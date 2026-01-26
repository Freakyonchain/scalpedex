// /src/features/collection/hooks/useCollectionStats.ts
'use client';

import { useState, useEffect } from 'react';
import { getCollectionStats } from '../server-actions/collection-actions';
import { CollectionStats } from '../types/collection-types';

export function useCollectionStats() {
  const [stats, setStats] = useState<CollectionStats>({
    totalValue: 0,
    totalItems: 0,
    sealedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const statsData = await getCollectionStats();
        setStats(statsData);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error('Stats load error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: async () => {
      setLoading(true);
      try {
        const statsData = await getCollectionStats();
        setStats(statsData);
      } catch (err) {
        console.error('Refresh stats error:', err);
      } finally {
        setLoading(false);
      }
    }
  };
}