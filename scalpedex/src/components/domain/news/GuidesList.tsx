// /src/features/news/components/GuidesList.tsx
'use client';

import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Guide } from '@/types/news.types';
import Link from 'next/link';

interface GuidesListProps {
  guides: Guide[];
  loading?: boolean;
}

export function GuidesList({ guides, loading = false }: GuidesListProps) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">🎓 Guides du Scalpeur</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-violet-900/20 rounded-xl h-32" />
        </div>
      </div>
    );
  }

  if (!guides || guides.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">🎓 Guides du Scalpeur</h2>
        <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
          <p className="text-violet-300">Aucun guide disponible pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🎓 Guides du Scalpeur</h2>
        <Link
          href="/guides"
          className="text-violet-400 text-sm hover:text-white transition-colors flex items-center gap-1"
        >
          Plus de guides <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map(guide => (
          <Link 
            key={guide.id}
            href={`/guides/${guide.id}`}
            className="group bg-violet-900/20 hover:bg-violet-900/30 transition-colors backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {guide.imageUrl ? (
                  <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-violet-400 transition-colors">{guide.title}</h3>
                <p className="text-sm text-violet-300 mt-1">{guide.excerpt}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-violet-400">Lire le guide</span>
                  <ArrowUpRight size={14} className="text-violet-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}