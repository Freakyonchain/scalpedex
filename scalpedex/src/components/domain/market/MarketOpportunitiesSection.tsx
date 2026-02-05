// /src/features/market/components/MarketOpportunitiesSection.tsx
'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MarketOpportunity } from '@/types/market.types';
import { MarketItemCard } from './MarketItemCard';

interface MarketOpportunitiesSectionProps {
  opportunities: MarketOpportunity[];
  loading?: boolean;
}

export function MarketOpportunitiesSection({ 
  opportunities, 
  loading = false 
}: MarketOpportunitiesSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <h2 className="text-xl font-bold text-white">🎯 Opportunités Détectées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">🎯 Opportunités Détectées</h2>
        <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
          <p className="text-violet-300">Aucune opportunité disponible actuellement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">🎯 Opportunités Détectées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map(opportunity => (
          <MarketItemCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
      
      {/* Voir plus */}
      <div className="flex justify-center">
        <button className="px-6 py-2 bg-violet-900/30 rounded-lg text-violet-300 hover:bg-violet-800/30 transition-colors flex items-center gap-2">
          Voir plus d&apos;opportunités
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}