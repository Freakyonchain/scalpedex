// /src/features/market/hooks/usePriceHistory.ts
'use client';

import { useState, useEffect } from 'react';
import { getProductPriceHistory } from '../server-actions/market-actions';
import { PriceHistory } from '../types/market-types';

export function usePriceHistory(productId: string | null) {
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPriceHistory = async () => {
      if (!productId) {
        setPriceHistory(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const history = await getProductPriceHistory(productId);
        setPriceHistory(history);
      } catch (err) {
        setError('Erreur lors du chargement de l\'historique des prix');
        console.error('Price history load error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPriceHistory();
  }, [productId]);

  return {
    priceHistory,
    loading,
    error
  };
}