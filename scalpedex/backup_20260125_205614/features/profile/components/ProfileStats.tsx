// /src/features/profile/components/ProfileStats.tsx
'use client';

import React from 'react';
import { LayoutGrid, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { ProfileStats as ProfileStatsType } from '../types/profile-types';

interface ProfileStatsProps {
  stats: ProfileStatsType | null;
  loading?: boolean;
}

export function ProfileStats({ stats, loading = false }: ProfileStatsProps) {
  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-lg bg-violet-800/30 h-32" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-violet-900/20 p-4">
          <p className="text-violet-300">Statistiques indisponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-lg bg-violet-900/20 p-4 text-center flex flex-col items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-violet-400" />
        <div className="text-lg font-medium text-white">{stats.totalItems} items</div>
        <div className="text-sm text-violet-300">Collection</div>
      </div>
      
      <div className="rounded-lg bg-violet-900/20 p-4 text-center flex flex-col items-center gap-2">
        <CreditCard className="h-5 w-5 text-green-400" />
        <div className="text-lg font-medium text-white">
          {stats.totalValue.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          })}
        </div>
        <div className="text-sm text-violet-300">Valeur totale</div>
      </div>
      
      <div className="rounded-lg bg-violet-900/20 p-4 text-center flex flex-col items-center gap-2">
        <Calendar className="h-5 w-5 text-blue-400" />
        <div className="text-lg font-medium text-white">{stats.memberSince}</div>
        <div className="text-sm text-violet-300">Membre depuis</div>
      </div>
      
      {stats.bestRoi !== undefined && (
        <div className="rounded-lg bg-violet-900/20 p-4 text-center flex flex-col items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-400" />
          <div className="text-lg font-medium text-white">+{stats.bestRoi}%</div>
          <div className="text-sm text-violet-300">Meilleur ROI</div>
        </div>
      )}
    </div>
  );
}