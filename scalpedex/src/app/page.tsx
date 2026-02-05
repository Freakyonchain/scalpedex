'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  ChevronRight,
  Lock,
  Sparkles
} from 'lucide-react';
import { createClientBrowser } from '@/lib/supabase/client';

// Fake market data for ticker
const TICKER_DATA = [
  { name: 'ETB 151 JAP', change: 12.4, positive: true },
  { name: 'CROWN ZENITH', change: 8.2, positive: true },
  { name: 'EVOLVING SKIES', change: -2.1, positive: false },
  { name: 'PALDEAN FATES', change: 15.7, positive: true },
  { name: 'OBSIDIAN FLAMES', change: -4.3, positive: false },
  { name: '151 ENG', change: 6.8, positive: true },
  { name: 'PARADOX RIFT', change: 3.2, positive: true },
  { name: 'TEMPORAL FORCES', change: -1.5, positive: false },
  { name: 'SURGING SPARKS', change: 22.1, positive: true },
  { name: 'PSA 10 CHAR', change: 5.9, positive: true },
];

// Ticker Component
function MarketTicker() {
  return (
    <div className="w-full overflow-hidden bg-black/60 border-b border-white/5">
      <div className="flex animate-ticker hover:[animation-play-state:paused]">
        {/* Duplicate for seamless loop */}
        {[...TICKER_DATA, ...TICKER_DATA].map((item, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 px-6 py-3 border-r border-white/5 whitespace-nowrap"
          >
            <span className="text-sm font-medium text-zinc-400">{item.name}</span>
            <span className={`
              flex items-center gap-0.5 text-sm font-semibold
              ${item.positive ? 'text-profit' : 'text-loss'}
            `}>
              {item.positive ? (
                <TrendingUp size={14} strokeWidth={2} />
              ) : (
                <TrendingDown size={14} strokeWidth={2} />
              )}
              {item.positive ? '+' : ''}{item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bento Card Component
interface BentoCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  className?: string;
  delay?: number;
}

function BentoCard({ title, icon, children, href, className = '', delay = 0 }: BentoCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        glass glass-hover group relative overflow-hidden
        p-5 h-full min-h-[140px]
        ${href ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* HUD Corner */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/40" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            {title}
          </span>
        </div>
        {href && (
          <ChevronRight 
            size={16} 
            className="text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all" 
          />
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientBrowser();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };
    checkAuth();
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Market Ticker */}
      <MarketTicker />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-32">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-profit/10 border border-profit/20"
          >
            <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
            <span className="text-xs font-semibold text-profit uppercase tracking-wider">
              Market Live
            </span>
          </motion.div>
          
          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl font-display font-extrabold tracking-tight mb-4">
            <span className="text-white">Scalpe</span>
            <span className="text-gradient-primary">Dex</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-zinc-500 text-lg max-w-sm mx-auto">
            Market Intelligence pour les investisseurs Pokémon
          </p>
        </motion.div>

        {/* Main CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-sm mb-12"
        >
          <Link href={isAuthenticated ? '/scan' : '/auth/sign-in'}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                relative w-full py-5 px-8
                bg-gradient-to-r from-profit to-profit-dark
                rounded-2xl overflow-hidden
                shadow-btn-profit hover:shadow-btn-profit-hover
                transition-all duration-300
                group
              "
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-shimmer bg-shimmer animate-shimmer opacity-30" />
              
              {/* Button Content */}
              <div className="relative flex items-center justify-center gap-3">
                <Zap size={24} strokeWidth={2} className="text-black" />
                <span className="text-xl font-bold text-black uppercase tracking-wide">
                  {isAuthenticated ? 'Lancer le Scan' : 'Commencer'}
                </span>
              </div>
              
              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-2xl animate-pulse-profit opacity-50" />
            </motion.button>
          </Link>
          
          {!isAuthenticated && !isLoading && (
            <p className="text-center text-zinc-600 text-sm mt-3">
              Créez un compte gratuit pour commencer
            </p>
          )}
        </motion.div>

        {/* Bento Grid */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-3">
          {/* Portfolio Value */}
          <BentoCard 
            title="Portfolio" 
            icon={<Wallet size={16} strokeWidth={1.5} />}
            href={isAuthenticated ? '/collection' : undefined}
            delay={0.4}
          >
            {isAuthenticated ? (
              <div>
                <p className="text-3xl font-bold text-white font-mono">
                  €3,249<span className="text-xl text-zinc-500">.75</span>
                </p>
                <div className="flex items-center gap-1 mt-2 text-profit text-sm font-medium">
                  <TrendingUp size={14} />
                  <span>+12.4% ce mois</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <Lock size={24} className="text-zinc-600 mb-2" />
                <p className="text-zinc-500 text-sm">Connectez-vous</p>
              </div>
            )}
          </BentoCard>

          {/* Market Trends */}
          <BentoCard 
            title="Tendances" 
            icon={<BarChart3 size={16} strokeWidth={1.5} />}
            href="/market"
            delay={0.5}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">ETB 151</span>
                <span className="text-sm font-semibold text-profit">+15.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Crown Zenith</span>
                <span className="text-sm font-semibold text-profit">+8.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Evolving Skies</span>
                <span className="text-sm font-semibold text-loss">-2.1%</span>
              </div>
            </div>
          </BentoCard>

          {/* Quick Actions - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="col-span-2 glass glass-hover p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Opportunités du jour</h3>
                  <p className="text-xs text-zinc-500">3 produits avec +20% de marge</p>
                </div>
              </div>
              <Link 
                href="/market"
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-colors"
              >
                Voir
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 flex items-center gap-8 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-white font-mono">1,247</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Scans</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-2xl font-bold text-white font-mono">24/7</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Live Data</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-2xl font-bold text-profit font-mono">+18%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Avg ROI</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}