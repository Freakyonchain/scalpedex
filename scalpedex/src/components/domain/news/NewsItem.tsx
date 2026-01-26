// /src/features/news/components/NewsItem.tsx
'use client';

import React from 'react';
import { Timer, ArrowRight } from 'lucide-react';
import { NewsItem as NewsItemType } from '@/types/news.types';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/utils/news-formatters';

interface NewsItemProps {
  item: NewsItemType;
}

export function NewsItem({ item }: NewsItemProps) {
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'BREAKING':
        return 'bg-red-500/20 text-red-400';
      case 'RETAIL':
        return 'bg-violet-500/20 text-violet-300';
      case 'SUCCESS':
        return 'bg-green-500/20 text-green-400';
      case 'MARKET':
        return 'bg-blue-500/20 text-blue-400';
      case 'GUIDE':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-violet-500/20 text-violet-300';
    }
  };

  return (
    <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 hover:bg-violet-900/30 transition-colors">
      <div className="flex items-center gap-2 text-sm text-violet-400 mb-2">
        <Timer size={16} />
        <span>{formatTimeAgo(item.publishedAt)}</span>
        <span className={`px-2 py-0.5 rounded-full ${getCategoryStyle(item.category)}`}>
          {item.category}
        </span>
      </div>
      <h3 className="text-white font-medium">{item.title}</h3>
      <p className="text-sm text-violet-300 mt-1">{item.excerpt}</p>
      <Link 
        href={`/news/${item.id}`}
        className="text-violet-400 text-sm hover:text-white transition-colors flex items-center gap-1 mt-3"
      >
        Lire plus <ArrowRight size={16} />
      </Link>
    </div>
  );
}