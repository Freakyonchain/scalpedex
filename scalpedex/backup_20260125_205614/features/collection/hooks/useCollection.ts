// /src/features/collection/hooks/useCollection.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getCollectionItems, 
  addCollectionItem, 
  removeCollectionItem, 
  markItemAsSold 
} from '../server-actions/collection-actions';
import { CollectionItem, CollectionQueryParams, CollectionResponse } from '../types/collection-types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function useCollection(initialParams: CollectionQueryParams = {}) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams.page || 1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Récupérer les paramètres de l'URL
  const getQueryParams = useCallback((): CollectionQueryParams => {
    return {
      search: searchParams.get('search') || '',
      condition: searchParams.get('condition') || '',
      page: Number(searchParams.get('page')) || 1,
      limit
    };
  }, [searchParams, limit]);
  
  // Charger les items de collection
  const loadItems = useCallback(async (params: CollectionQueryParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCollectionItems(params);
      
      if (response.status === 'success') {
        setItems(response.items);
        setTotal(response.total);
        setPage(response.page);
      } else {
        setError(response.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors du chargement de la collection');
      console.error('Collection load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Mettre à jour les filtres et recharger les items
  const updateFilters = useCallback((newParams: Partial<CollectionQueryParams>) => {
    const currentParams = getQueryParams();
    const updatedParams = { ...currentParams, ...newParams };
    
    // Supprimer les paramètres vides
    Object.keys(updatedParams).forEach(key => {
      if (!updatedParams[key as keyof CollectionQueryParams]) {
        delete updatedParams[key as keyof CollectionQueryParams];
      }
    });
    
    // Convertir en chaîne de requête
    const queryString = new URLSearchParams();
    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value) {
        queryString.set(key, value.toString());
      }
    });
    
    // Mettre à jour l'URL
    const newUrl = `${pathname}?${queryString.toString()}`;
    router.push(newUrl);
    
    // Recharger les items
    loadItems(updatedParams);
  }, [getQueryParams, pathname, router, loadItems]);
  
  // Ajouter un item à la collection
  const addItem = useCallback(async (data: {
    productId: string;
    condition: string;
    purchasePrice: number;
    quantity: number;
  }) => {
    try {
      const result = await addCollectionItem(data);
      
      if (result.success) {
        toast.success(result.message);
        // Recharger les items
        loadItems(getQueryParams());
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (err) {
      toast.error('Erreur lors de l\'ajout à la collection');
      console.error('Add item error:', err);
      return false;
    }
  }, [getQueryParams, loadItems]);
  
  // Supprimer un item de la collection
  const removeItem = useCallback(async (itemId: string) => {
    try {
      const result = await removeCollectionItem(itemId);
      
      if (result.success) {
        toast.success(result.message);
        // Recharger les items
        loadItems(getQueryParams());
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (err) {
      toast.error('Erreur lors de la suppression');
      console.error('Remove item error:', err);
      return false;
    }
  }, [getQueryParams, loadItems]);
  
  // Marquer un item comme vendu
  const sellItem = useCallback(async (data: {
    itemId: string;
    soldPrice: number;
    soldDate?: string;
  }) => {
    try {
      const result = await markItemAsSold(data);
      
      if (result.success) {
        toast.success(result.message);
        // Recharger les items
        loadItems(getQueryParams());
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
      console.error('Sell item error:', err);
      return false;
    }
  }, [getQueryParams, loadItems]);
  
  // Charger les items au chargement initial
  useEffect(() => {
    loadItems(getQueryParams());
  }, [loadItems, getQueryParams]);
  
  return {
    items,
    total,
    page,
    limit,
    loading,
    error,
    selectedItem,
    setSelectedItem,
    updateFilters,
    addItem,
    removeItem,
    sellItem,
    refresh: () => loadItems(getQueryParams())
  };
}