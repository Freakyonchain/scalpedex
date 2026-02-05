'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCollectionItems,
  addToCollection,
  removeFromCollection,
  recordSale,
  type CollectionItem,
  type ItemCondition,
} from '@/app/actions/collection-actions';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface CollectionQueryParams {
  search?: string;
  condition?: string;
  page?: number;
  limit?: number;
}

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
      const conditionFilter = params.condition as ItemCondition | undefined;
      const response = await getCollectionItems({
        search: params.search || undefined,
        condition: conditionFilter || undefined,
        limit: params.limit,
        offset: ((params.page || 1) - 1) * (params.limit || 12),
      });

      if (response.success && response.data) {
        setItems(response.data.items);
        setTotal(response.data.total);
        setPage(params.page || 1);
      } else if (!response.success) {
        setError(response.message);
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
      const result = await addToCollection({
        productId: data.productId,
        purchasePrice: data.purchasePrice,
        quantity: data.quantity,
        condition: data.condition as ItemCondition,
      });

      if (result.success) {
        toast.success(result.message);
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
      const result = await removeFromCollection(itemId);

      if (result.success) {
        toast.success(result.message);
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
      const result = await recordSale({
        collectionItemId: data.itemId,
        soldPrice: data.soldPrice,
        soldDate: data.soldDate,
      });

      if (result.success) {
        toast.success(result.message);
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
