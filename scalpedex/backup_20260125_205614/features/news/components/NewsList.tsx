// /src/features/news/components/NewsList.tsx
'use client';

import React from 'react';
import { NewsItem as NewsItemType } from '../types/news-types';
import { NewsItem } from './NewsItem';

interface NewsListProps {
  items: NewsItemType[];
  loading?: boolean;
}

export function NewsList({ items, loading = false }: NewsListProps) {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-violet-900/20 rounded-xl h-32" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <p className="text-violet-300">Aucune actualité disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <NewsItem key={item.id} item={item} />
      ))}
    </div>
  );
}