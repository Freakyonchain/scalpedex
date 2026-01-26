'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Bell, Settings } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  
  // Don't show header on home page
  if (pathname === '/') return null;
  
  // Get page title based on path
  const getPageTitle = () => {
    switch (pathname) {
      case '/scan': return 'Scanner';
      case '/collection': return 'Collection';
      case '/market': return 'Market Intel';
      case '/news': return 'News Feed';
      case '/profile': return 'Profile';
      case '/settings': return 'Settings';
      default: return 'ScalpeDex';
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 w-full"
    >
      {/* Glass Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl border-b border-white/5" />
      
      {/* Content */}
      <div className="relative max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap 
              size={20} 
              strokeWidth={2} 
              className="relative text-primary" 
            />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            Scalpe<span className="text-primary">Dex</span>
          </span>
        </Link>
        
        {/* Center: Page Title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
            {getPageTitle()}
          </h1>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <Bell size={18} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300" />
            {/* Notification Dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-profit animate-pulse" />
          </button>
          
          {/* Settings */}
          <Link href="/settings" className="p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <Settings size={18} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300" />
          </Link>
        </div>
      </div>
      
      {/* Subtle gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.header>
  );
}