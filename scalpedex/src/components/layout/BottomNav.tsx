'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Scan, LayoutGrid, LineChart, User } from 'lucide-react';
import { createClientBrowser } from '@/lib/supabase/client';

export const BottomNav = () => {
  const [username, setUsername] = useState('Profil');
  const pathname = usePathname();

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
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Navigation principale */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-violet-950/95 border-t border-violet-800/30 backdrop-blur-md pb-safe z-40">
        <div className="flex items-center justify-around h-16 px-4 mx-auto max-w-md">
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

          <Link 
            href="/profile"
            className={`flex flex-col items-center ${isActive('/profile') ? 'text-violet-400' : 'text-violet-400/60'}`}
          >
            <User size={20} />
            <span className="text-xs mt-1">{username}</span>
          </Link>
        </div>
      </nav>

      {/* Bouton de scan flottant */}
      <Link 
        href="/scan"
        className={`fixed right-4 bottom-20 bg-violet-600 w-14 h-14 rounded-full 
                   flex items-center justify-center shadow-lg z-50
                   hover:bg-violet-500 active:scale-95
                   transition-all duration-150 ease-in-out
                   ${isActive('/scan') ? 'bg-violet-500' : ''}`}
      >
        <Scan size={24} className="text-white" />
      </Link>
    </>
  );
};