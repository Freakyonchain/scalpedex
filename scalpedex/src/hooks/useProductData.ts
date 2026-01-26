'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, ScalpingScore } from '@/types/scanner.types';

export function useProductData(barcode: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!barcode) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Simulated product data for now
        // In production, this would call the actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProduct({
          id: 'demo-' + barcode,
          name: 'Pokémon TCG Product',
          barcode: barcode,
          category: 'Elite Trainer Box',
          msrp: 49.99,
          marketPrice: 64.99,
          imageUrl: undefined
        });
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la recherche du produit');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [barcode]);
  
  const calculateScalpingScore = useCallback((retailPrice: number): ScalpingScore => {
    if (!product || !product.marketPrice) {
      return {
        score: 0,
        profit: 0,
        profitPercentage: 0,
        recommendation: 'Données insuffisantes'
      };
    }
    
    const profit = product.marketPrice - retailPrice;
    const profitPercentage = (profit / retailPrice) * 100;
    
    let score: number;
    let recommendation: string;
    
    if (profitPercentage >= 50) {
      score = 90 + Math.min(10, (profitPercentage - 50) / 5);
      recommendation = '🔥 EXCELLENT - Acheter immédiatement!';
    } else if (profitPercentage >= 25) {
      score = 70 + ((profitPercentage - 25) / 25) * 20;
      recommendation = '✅ Bon deal - À prendre';
    } else if (profitPercentage >= 10) {
      score = 50 + ((profitPercentage - 10) / 15) * 20;
      recommendation = '⚠️ Acceptable - Si vous avez le temps';
    } else if (profitPercentage > 0) {
      score = 30 + (profitPercentage / 10) * 20;
      recommendation = '😐 Marge faible - À éviter';
    } else {
      score = Math.max(0, 30 + profitPercentage);
      recommendation = '❌ Non rentable';
    }
    
    return {
      score: Math.round(score),
      profit,
      profitPercentage,
      recommendation
    };
  }, [product]);
  
  return {
    product,
    loading,
    error,
    calculateScalpingScore
  };
}