// /src/features/news/components/BreakingAlert.tsx
'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { NewsItem } from '../types/news-types';
import Link from 'next/link';

interface BreakingAlertProps {
  news: NewsItem | null;
  loading?: boolean;
}

export function BreakingAlert({ news, loading = false }: BreakingAlertProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-900/20 via-red-900/20 to-red-900/20 rounded-xl border border-red-800/50 p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-400 font-medium text-sm">BREAKING</span>
        </div>
        <div className="h-6 w-3/4 bg-red-800/30 rounded mb-2" />
        <div className="h-4 w-1/2 bg-red-800/30 rounded" />
      </div>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-900/20 via-red-900/20 to-red-900/20 rounded-xl border border-red-800/50 p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="text-red-400" size={20} />
        <span className="text-red-400 font-medium text-sm">BREAKING</span>
      </div>
      <h2 className="text-white font-bold mb-1">{news.title}</h2>
      <p className="text-sm text-red-200">{news.excerpt}</p>
      {news.id && (
        <div className="mt-2 text-right">
          <Link 
            href={`/news/${news.id}`}
            className="text-sm text-red-300 hover:text-red-200 transition-colors"
          >
            Lire plus →
          </Link>
        </div>
      )}
    </div>
  );
}