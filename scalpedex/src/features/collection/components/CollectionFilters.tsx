// /src/features/collection/components/CollectionFilters.tsx
'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { CONDITIONS, Condition } from '../types/collection-types';
import { useCollectionFilters } from '../hooks/useCollectionFilters';

export function CollectionFilters() {
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useCollectionFilters();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('search', e.target.value);
  };
  
  const handleConditionClick = (condition: Condition | '') => {
    if (filters.condition === condition) {
      // Désélectionner la condition si déjà sélectionnée
      updateFilter('condition', '');
    } else {
      // Sinon, sélectionner la nouvelle condition
      updateFilter('condition', condition);
    }
  };
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Barre de recherche */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Rechercher dans la collection..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-violet-900/20 border border-violet-800/50 
                   rounded-lg text-white placeholder-violet-400 
                   focus:outline-none focus:border-violet-600"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-violet-400" />
        
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute right-3 top-2.5 text-violet-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filtres par condition */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CONDITIONS).map(([value, label]) => (
          <button
            key={value}
            onClick={() => handleConditionClick(value as Condition)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filters.condition === value
                ? 'bg-violet-600 text-white'
                : 'bg-violet-900/20 text-violet-300 hover:bg-violet-800/30'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Bouton reset */}
      {hasActiveFilters() && (
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-violet-900/30 text-violet-300 rounded-lg hover:bg-violet-800/30 transition-colors"
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}