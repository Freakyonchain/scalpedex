// /src/features/collection/components/EmptyState.tsx
'use client';

import React from 'react';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  userName: string;
}

export function EmptyState({ userName }: EmptyStateProps) {
  return (
    <div className="p-6 space-y-6 min-h-[70vh] bg-gradient-to-b from-violet-950/30 to-black/30 flex items-center justify-center rounded-xl border border-violet-800/30">
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-violet-400 mb-4" />
        <h3 className="text-2xl font-medium text-white mb-2">
          Salut {userName} 👋
        </h3>
        <p className="text-xl text-violet-300 mb-4">
          Ta collection est encore vide
        </p>
        <p className="text-violet-400 mb-6">
          Prêt à commencer ta première collection ?
        </p>
        
        <Link 
          href="/scan" 
          className="mt-4 inline-flex items-center justify-center px-6 py-3 
            bg-violet-600 text-white font-semibold 
            rounded-xl 
            hover:bg-violet-700 
            transition-colors 
            duration-300 
            shadow-lg 
            shadow-violet-500/50 
            hover:shadow-xl 
            hover:scale-105"
        >
          <Plus size={24} className="mr-2" />
          Ajoutez votre premier Item
        </Link>
      </div>
    </div>
  );
}