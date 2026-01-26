// /src/features/market/hooks/useMarketOpportunities.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMarketOpportunities } from '@/app/actions/market-actions';
import { MarketOpportunity, MarketSearchParams } from '@/types/market.types';

export function useMarketOpportunities(initialParams: MarketSearchParams = {}) {
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<MarketSearchParams>(initialParams);

  const loadOpportunities = useCallback(async (searchParams: MarketSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getMarketOpportunities(searchParams);
      setOpportunities(data);
    } catch (err) {
      setError('Erreur lors du chargement des opportunités');
      console.error('Market opportunities load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOpportunities(params);
  }, [loadOpportunities, params]);

  const updateParams = useCallback((newParams: Partial<MarketSearchParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams
    }));
  }, []);

  return {
    opportunities,
    loading,
    error,
    params,
    updateParams,
    refresh: () => loadOpportunities(params)
  };
}