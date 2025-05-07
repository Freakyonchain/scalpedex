// /src/features/collection/components/Pagination.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useCollection } from '../hooks/useCollection';
import { useCollectionFilters } from '../hooks/useCollectionFilters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination() {
  const { total, limit, page } = useCollection();
  const { filters, updateFilter } = useCollectionFilters();
  
  if (total <= limit) {
    return null;
  }
  
  const totalPages = Math.ceil(total / limit);
  
  // Génère un tableau de numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    
    // Toujours inclure la première page
    pages.push(1);
    
    // Ajouter les pages autour de la page courante
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    
    // Ajouter des points de suspension si nécessaire
    if (start > 2) {
      pages.push('...');
    }
    
    // Ajouter les pages du milieu
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Ajouter des points de suspension si nécessaire
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Toujours inclure la dernière page si différente de la première
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const handlePageClick = (newPage: number) => {
    updateFilter('page', newPage);
  };
  
  return (
    <div className="flex justify-center gap-2 mt-8">
      {/* Bouton précédent */}
      {page > 1 && (
        <button
          onClick={() => handlePageClick(page - 1)}
          className="px-3 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors flex items-center"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline ml-1">Précédent</span>
        </button>
      )}
      
      {/* Numéros de page */}
      <div className="flex gap-2">
        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-violet-400">
                ...
              </span>
            );
          }
          
          const pageNumber = Number(pageNum);
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                page === pageNumber
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      
      {/* Bouton suivant */}
      {page < totalPages && (
        <button
          onClick={() => handlePageClick(page + 1)}
          className="px-3 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors flex items-center"
        >
          <span className="hidden sm:inline mr-1">Suivant</span>
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}