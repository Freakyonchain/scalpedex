// components/collection/CollectionFilters.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONDITIONS, Condition } from '@/types/collection';

interface CollectionFiltersProps {
  search?: string;
  condition?: string;
}

export function CollectionFilters({ 
  search = '', 
  condition = '' 
}: CollectionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(search);

  // Met à jour la valeur de recherche locale quand le prop change
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  // Mise à jour des filtres avec persistence dans l'URL
  const updateFilters = (
    newSearch: string | null = null, 
    newCondition: string | null = null
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSearch !== null) {
      if (newSearch.trim()) {
        params.set('search', newSearch.trim());
      } else {
        params.delete('search');
      }
    }

    if (newCondition !== null) {
      if (newCondition) {
        params.set('condition', newCondition);
      } else {
        params.delete('condition');
      }
    }

    router.push(`/collection?${params.toString()}`);
  };

  // Gère le changement de la valeur de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    updateFilters(value, null);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Barre de recherche */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Rechercher dans la collection..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-violet-900/20 border border-violet-800/50 
                   rounded-lg text-white placeholder-violet-400 
                   focus:outline-none focus:border-violet-600"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-violet-400" />
      </div>

      {/* Filtres par condition */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CONDITIONS).map(([value, label]) => (
          <button
            key={value}
            onClick={() => {
              const newCondition = condition === value ? '' : value;
              updateFilters(null, newCondition);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${condition === value
                ? 'bg-violet-600 text-white'
                : 'bg-violet-900/20 text-violet-300 hover:bg-violet-800/30'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}