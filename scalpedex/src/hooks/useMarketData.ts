// /src/features/market/hooks/useMarketData.ts
'use client';

import { useState, useEffect } from 'react';
import { getMarketData } from '@/app/actions/market-actions';
import { MarketDataResponse } from '@/types/market.types';

export function useMarketData() {
  const [data, setData] = useState<MarketDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const marketData = await getMarketData();
        setData(marketData);
      } catch (err) {
        setError('Erreur lors du chargement des données de marché');
        console.error('Market data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadMarketData();
  }, []);

  return {
    data,
    loading,
    error,
    refreshData: async () => {
      setLoading(true);
      try {
        const marketData = await getMarketData();
        setData(marketData);
      } catch (err) {
        console.error('Refresh market data error:', err);
      } finally {
        setLoading(false);
      }
    }
  };
}