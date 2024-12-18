'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scan, LayoutGrid, LineChart, User, Newspaper } from 'lucide-react';
import { createClientBrowser } from '@/lib/supabase/client';

export const BottomNav = () => {
  const [username, setUsername] = useState('Profil');
  const [showPulse, setShowPulse] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchUsername() {
      const supabase = createClientBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      
      const derivedUsername = user?.user_metadata?.username 
        || user?.email?.split('@')[0] 
        || 'Profil';
      
      setUsername(derivedUsername);
    }

    fetchUsername();

    // Désactive l'animation après la première visite
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      setShowPulse(false);
    }
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleScanClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/scan');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-violet-950/95 border-t border-violet-800/30 backdrop-blur-md pb-safe z-40">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-md">
        <Link 
          href="/collection"
          className={`flex flex-col items-center ${isActive('/collection') ? 'text-violet-400' : 'text-violet-400/60'}`}
        >
          <LayoutGrid size={20} />
          <span className="text-xs mt-1">Collection</span>
        </Link>

        <Link 
          href="/market"
          className={`flex flex-col items-center ${isActive('/market') ? 'text-violet-400' : 'text-violet-400/60'}`}
        >
          <LineChart size={20} />
          <span className="text-xs mt-1">Market</span>
        </Link>

        <div className="relative -top-2">
          <button 
            onClick={handleScanClick}
            className={`relative flex flex-col items-center -top-4 group`}
          >
            <div className={`
              w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center
              shadow-lg shadow-violet-600/20
              transform transition-all duration-200
              group-hover:bg-violet-500 group-hover:scale-105
              group-active:scale-95
              ${isActive('/scan') ? 'bg-violet-500' : ''}
            `}>
              <Scan size={24} className="text-white" />
              {showPulse && (
                <div className="absolute inset-0 rounded-full bg-violet-600/20 animate-ping" 
                     style={{ animationDuration: '3s', animationIterationCount: 3 }} />
              )}
            </div>
            <span className="text-xs mt-1 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Scanner
            </span>
          </button>
        </div>

        <Link 
          href="/news"
          className={`flex flex-col items-center ${isActive('/news') ? 'text-violet-400' : 'text-violet-400/60'}`}
        >
          <Newspaper size={20} />
          <span className="text-xs mt-1">Actu</span>
        </Link>

        <Link 
          href="/profile"
          className={`flex flex-col items-center ${isActive('/profile') ? 'text-violet-400' : 'text-violet-400/60'}`}
        >
          <User size={20} />
          <span className="text-xs mt-1">{username}</span>
        </Link>
      </div>
    </nav>
  );
};