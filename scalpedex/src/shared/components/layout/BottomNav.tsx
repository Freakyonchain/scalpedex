'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scan, TrendingUp, Package, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? 'text-white' : 'text-violet-300/70';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-black/40 backdrop-blur-md border-t border-violet-800/40">
      <div className="relative max-w-md mx-auto h-full flex items-center justify-between px-6">

        {/* LEFT */}
        <Link href="/collection" className={`flex flex-col items-center ${isActive('/collection')}`}>
          <Package size={22} />
          <span className="text-xs mt-1">Collection</span>
        </Link>

        {/* PLACEHOLDER MIDDLE (vide pour équilibre visuel) */}
        <div className="w-20" />

        {/* RIGHT */}
        <Link href="/market" className={`flex flex-col items-center ${isActive('/market')}`}>
          <TrendingUp size={22} />
          <span className="text-xs mt-1">Market</span>
        </Link>

        <Link href="/profile" className={`flex flex-col items-center ${isActive('/profile')}`}>
          <User size={22} />
          <span className="text-xs mt-1">Profil</span>
        </Link>

        {/* CENTER SCAN BUTTON (floating above) */}
        <Link
          href="/scan"
          className="absolute -top-6 left-1/2 -translate-x-1/2 bg-violet-600 hover:bg-violet-500 p-4 rounded-full shadow-xl border-4 border-black text-white transition"
        >
          <Scan size={28} />
        </Link>
      </div>
    </nav>
  );
}
