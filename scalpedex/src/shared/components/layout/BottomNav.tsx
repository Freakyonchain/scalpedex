// src/shared/components/layout/BottomNav.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scan, TrendingUp, Package, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-violet-800 to-purple-900 shadow-lg shadow-black/30 border-t border-violet-700/50 z-50">
      <div className="max-w-lg mx-auto h-full flex items-center justify-around">
        <Link 
          href="/scan" 
          className={`flex flex-col items-center justify-center w-20 h-full relative ${
            pathname === '/scan' 
              ? 'text-white' 
              : 'text-violet-200/70'
          }`}
        >
          {pathname === '/scan' && (
            <div className="absolute top-0 w-10 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-b-lg" />
          )}
          <div className={`p-1.5 rounded-full ${pathname === '/scan' ? 'bg-purple-600/30' : ''}`}>
            <Scan size={18} />
          </div>
          <span className="text-xs mt-1 font-medium">Scan</span>
        </Link>
        
        <Link 
          href="/collection" 
          className={`flex flex-col items-center justify-center w-20 h-full relative ${
            pathname === '/collection' 
              ? 'text-white' 
              : 'text-violet-200/70'
          }`}
        >
          {pathname === '/collection' && (
            <div className="absolute top-0 w-10 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-b-lg" />
          )}
          <div className={`p-1.5 rounded-full ${pathname === '/collection' ? 'bg-purple-600/30' : ''}`}>
            <Package size={18} />
          </div>
          <span className="text-xs mt-1 font-medium">Collection</span>
        </Link>
        
        <Link 
          href="/market" 
          className={`flex flex-col items-center justify-center w-20 h-full relative ${
            pathname === '/market' 
              ? 'text-white' 
              : 'text-violet-200/70'
          }`}
        >
          {pathname === '/market' && (
            <div className="absolute top-0 w-10 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-b-lg" />
          )}
          <div className={`p-1.5 rounded-full ${pathname === '/market' ? 'bg-purple-600/30' : ''}`}>
            <TrendingUp size={18} />
          </div>
          <span className="text-xs mt-1 font-medium">Market</span>
        </Link>
        
        <Link 
          href="/profile" 
          className={`flex flex-col items-center justify-center w-20 h-full relative ${
            pathname === '/profile' 
              ? 'text-white' 
              : 'text-violet-200/70'
          }`}
        >
          {pathname === '/profile' && (
            <div className="absolute top-0 w-10 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-b-lg" />
          )}
          <div className={`p-1.5 rounded-full ${pathname === '/profile' ? 'bg-purple-600/30' : ''}`}>
            <User size={18} />
          </div>
          <span className="text-xs mt-1 font-medium">Profil</span>
        </Link>
      </div>
    </nav>
  );
}