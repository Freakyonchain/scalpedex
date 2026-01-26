// /src/features/collection/hooks/useCollectionFilters.ts
'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CollectionFiltersState } from '@/types/collection.types';

export function useCollectionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // État initial des filtres
  const [filters, setFilters] = useState<CollectionFiltersState>({
    search: searchParams.get('search') || '',
    condition: (searchParams.get('condition') || '') as CollectionFiltersState['condition'],
    sortBy: 'date',
    sortOrder: 'desc',
    page: Number(searchParams.get('page')) || 1
  });
  
  // Mettre à jour un filtre spécifique
  const updateFilter = useCallback(<K extends keyof CollectionFiltersState>(
    key: K,
    value: CollectionFiltersState[K]
  ) => {
    // Mettre à jour l'état local
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Mettre à jour les paramètres d'URL
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    
    // Réinitialiser la page quand on change les filtres
    if (key !== 'page') {
      params.set('page', '1');
    }
    
    // Mettre à jour l'URL
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);
  
  // Réinitialiser tous les filtres
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      condition: '',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1
    });
    
    router.push(pathname);
  }, [router, pathname]);
  
  // Vérifier si des filtres sont actuellement appliqués
  const hasActiveFilters = useCallback(() => {
    return !!(filters.search || filters.condition);
  }, [filters.search, filters.condition]);
  
  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters
  };
}