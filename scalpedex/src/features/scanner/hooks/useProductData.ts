'use client';

import { useState, useEffect } from 'react';
import { getProductByBarcode, createProduct } from '../server-actions/product-actions';
import { Product, ScalpingScore } from '../types/scanner-types';

export function useProductData(barcode: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch le produit quand le code-barres change
  useEffect(() => {
    async function fetchProduct() {
      if (!barcode) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const productData = await getProductByBarcode(barcode);
        setProduct(productData);
        
        if (!productData) {
          setError('Produit non trouvé');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la recherche du produit');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [barcode]);
  
  // Calculer le scalping score
  const calculateScalpingScore = (retailPrice: number): ScalpingScore => {
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
    const score = Math.min(100, Math.max(0, profitPercentage * 2));
    
    let recommendation = 'À éviter';
    if (score >= 80) recommendation = 'SCALP RAPIDE 🔥';
    else if (score >= 50) recommendation = 'Potentiel intéressant';
    
    return {
      score,
      profit,
      profitPercentage,
      recommendation
    };
  };
  
  // Créer un nouveau produit
  const createNewProduct = async (newProduct: Omit<Product, 'id'>): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const product = await createProduct(newProduct);
      if (product) {
        setProduct(product);
      }
      return product;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du produit');
      console.error('Error creating product:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    product,
    loading,
    error,
    calculateScalpingScore,
    createNewProduct
  };
}