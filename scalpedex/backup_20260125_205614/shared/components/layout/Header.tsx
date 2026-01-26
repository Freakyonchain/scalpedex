// src/shared/components/layout/Header.tsx
'use client'

import { Scan } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 bg-violet-900/80 backdrop-blur-md border-b border-violet-800/50 p-4 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Scan className="h-6 w-6 text-violet-400" />
          <span className="font-bold text-white text-xl">ScalpeDex</span>
        </Link>
        
        <Link href="/collection" className="text-violet-300 hover:text-white transition-colors">
          Ma Collection
        </Link>
      </div>
    </header>
  );
}