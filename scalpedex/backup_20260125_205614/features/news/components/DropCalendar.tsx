// /src/features/news/components/DropCalendar.tsx
'use client';

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Drop } from '../types/news-types';
import Link from 'next/link';

interface DropCalendarProps {
  drops: Drop[];
  getDaysRemaining: (dropDate: string) => number;
  loading?: boolean;
}

export function DropCalendar({ drops, getDaysRemaining, loading = false }: DropCalendarProps) {
  if (loading) {
    return (
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-violet-400" size={24} />
            <h2 className="text-xl font-bold text-white">Drop Calendar</h2>
          </div>
        </div>
        <div className="h-32 bg-black/20 rounded-lg" />
      </div>
    );
  }

  if (!drops || drops.length === 0) {
    return (
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-violet-400" size={24} />
            <h2 className="text-xl font-bold text-white">Drop Calendar</h2>
          </div>
        </div>
        <p className="text-violet-300">Aucun drop programmé pour le moment.</p>
      </div>
    );
  }

  // Helper pour obtenir l'affichage du délai
  const getTimeDisplay = (dropDate: string) => {
    const days = getDaysRemaining(dropDate);
    
    if (days <= 0) {
      return { text: 'Aujourd\'hui', class: 'text-green-400' };
    } else if (days === 1) {
      return { text: 'Demain', class: 'text-green-400' };
    } else if (days <= 3) {
      return { text: `Dans ${days} jours`, class: 'text-amber-400' };
    } else {
      return { text: `Dans ${days} jours`, class: 'text-violet-300' };
    }
  };

  return (
    <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-violet-400" size={24} />
          <h2 className="text-xl font-bold text-white">Drop Calendar</h2>
        </div>
        <Link
          href="/drops"
          className="text-violet-400 text-sm hover:text-white transition-colors flex items-center gap-1"
        >
          Voir tout <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid gap-3">
        {drops.map(drop => {
          const timeDisplay = getTimeDisplay(drop.dropDate);
          
          return (
            <div key={drop.id} className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={timeDisplay.class + ' font-medium'}>
                  {timeDisplay.text}
                </span>
                <span className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                  Hype: {drop.hypeScore}%
                </span>
              </div>
              <h3 className="text-white font-medium">{drop.productName}</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-violet-300">MSRP: {drop.retailPrice.toFixed(2)}€</p>
                {drop.expectedMarketPrice && (
                  <span className="text-green-400 text-sm">
                    Prévision: {drop.expectedMarketPrice.toFixed(2)}€ 📈
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}