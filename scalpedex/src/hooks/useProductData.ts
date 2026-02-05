'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProductByEAN, type ScanResult as ScanActionResult } from '@/app/actions/scan-actions';

export function useProductData(barcode: string | null) {
  const [scanResult, setScanResult] = useState<ScanActionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!barcode) {
        setScanResult(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getProductByEAN(barcode);

        if (!result.success) {
          setError(result.message);
          return;
        }

        setScanResult(result.data ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la recherche du produit';
        setError(message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [barcode]);

  const calculateScalpingScore = useCallback((retailPrice: number) => {
    const product = scanResult?.product;
    if (!product || !product.current_price) {
      return {
        score: 0,
        profit: 0,
        profitPercentage: 0,
        recommendation: 'Données insuffisantes'
      };
    }

    const profit = product.current_price - retailPrice;
    const profitPercentage = (profit / retailPrice) * 100;

    let score: number;
    let recommendation: string;

    if (profitPercentage >= 50) {
      score = 90 + Math.min(10, (profitPercentage - 50) / 5);
      recommendation = 'ACHETER IMMEDIATEMENT';
    } else if (profitPercentage >= 25) {
      score = 70 + ((profitPercentage - 25) / 25) * 20;
      recommendation = 'Excellente opportunite';
    } else if (profitPercentage >= 10) {
      score = 50 + ((profitPercentage - 10) / 15) * 20;
      recommendation = 'Profit modere';
    } else if (profitPercentage > 0) {
      score = 30 + (profitPercentage / 10) * 20;
      recommendation = 'Marge faible';
    } else {
      score = Math.max(0, 30 + profitPercentage);
      recommendation = 'Non rentable';
    }

    return {
      score: Math.round(score),
      profit,
      profitPercentage,
      recommendation
    };
  }, [scanResult]);

  return {
    product: scanResult?.product ?? null,
    scanResult,
    loading,
    error,
    calculateScalpingScore
  };
}
