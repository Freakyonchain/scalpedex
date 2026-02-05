// /src/features/collection/components/CollectionStats.tsx
'use client';

import React from 'react';
import { TrendingUp, Package, DollarSign, AlertCircle } from 'lucide-react';
import { useCollectionStats } from '@/hooks/useCollectionStats';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  subtitleIcon?: React.ReactNode;
  subtitleColor?: string;
  loading?: boolean;
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  subtitleIcon, 
  subtitleColor = "text-violet-400",
  loading = false 
}: StatsCardProps) {
  return (
    <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-violet-300">{title}</p>
          {loading ? (
            <div className="h-7 bg-violet-800/50 rounded w-20 animate-pulse mt-1" />
          ) : (
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          )}
          {subtitle && (
            <div className={`flex items-center gap-1 ${subtitleColor} text-sm mt-2`}>
              {subtitleIcon}
              <span>{subtitle}</span>
            </div>
          )}
        </div>
        <div className="p-2 bg-violet-600/20 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function CollectionStats() {
  const { stats, loading } = useCollectionStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Valeur Totale"
        value={loading ? '-' : stats.totalValue.toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        })}
        icon={<DollarSign size={24} className="text-violet-400" />}
        loading={loading}
      />

      <StatsCard
        title="Items"
        value={loading ? '-' : stats.totalItems}
        icon={<Package size={24} className="text-violet-400" />}
        subtitle={`${stats.sealedCount || 0} sealed`}
        subtitleIcon={<Package size={16} className="text-violet-400" />}
        loading={loading}
      />

      <StatsCard
        title="Meilleur ROI"
        value={loading || !stats.bestRoiPercent ? '-' : `${stats.bestRoiPercent.toFixed(1)}%`}
        icon={<TrendingUp size={24} className="text-violet-400" />}
        subtitle={stats.bestRoiItem || 'Aucune vente'}
        subtitleIcon={<TrendingUp size={16} />}
        loading={loading}
      />

      <StatsCard
        title="Alertes Prix"
        value="-"
        icon={<AlertCircle size={24} className="text-violet-400" />}
        subtitle="À venir"
        subtitleIcon={<AlertCircle size={16} />}
        subtitleColor="text-yellow-400"
      />
    </div>
  );
}