'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter,
  Flame,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Package,
  BarChart3,
  Star,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface MarketItem {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  change24h: number;
  change7d: number;
  volume: number;
  msrp: number;
  trend: 'up' | 'down' | 'stable';
  isHot?: boolean;
}

interface Opportunity {
  id: string;
  productName: string;
  retailer: string;
  retailPrice: number;
  marketPrice: number;
  profit: number;
  profitPercent: number;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  expiresAt?: string;
}

// ============================================
// MOCK DATA
// ============================================
const marketItems: MarketItem[] = [
  { id: '1', name: 'Écarlate et Violet 151 - ETB JAP', category: 'ETB', currentPrice: 89.99, previousPrice: 85.00, change24h: 5.87, change7d: 12.4, volume: 1247, msrp: 42.99, trend: 'up', isHot: true },
  { id: '2', name: 'Couronne Stellaire - ETB', category: 'ETB', currentPrice: 54.99, previousPrice: 52.99, change24h: 3.77, change7d: 8.2, volume: 892, msrp: 49.99, trend: 'up' },
  { id: '3', name: 'Destins de Paldea - Booster Box', category: 'Booster Box', currentPrice: 159.99, previousPrice: 165.00, change24h: -3.03, change7d: -5.1, volume: 456, msrp: 143.64, trend: 'down' },
  { id: '4', name: 'Pikachu ex Premium Collection', category: 'Premium', currentPrice: 129.99, previousPrice: 119.99, change24h: 8.33, change7d: 15.7, volume: 2341, msrp: 49.99, trend: 'up', isHot: true },
  { id: '5', name: 'Obsidian Flames - ETB', category: 'ETB', currentPrice: 42.99, previousPrice: 44.99, change24h: -4.45, change7d: -2.1, volume: 234, msrp: 49.99, trend: 'down' },
  { id: '6', name: 'Paradox Rift - Booster Bundle', category: 'Bundle', currentPrice: 32.99, previousPrice: 32.50, change24h: 1.51, change7d: 0.8, volume: 567, msrp: 29.99, trend: 'stable' },
];

const opportunities: Opportunity[] = [
  { id: '1', productName: 'ETB 151 JAP', retailer: 'Carrefour', retailPrice: 44.99, marketPrice: 89.99, profit: 45.00, profitPercent: 100, stock: 'low_stock', expiresAt: '2h 34m' },
  { id: '2', productName: 'Pikachu ex Premium', retailer: 'Fnac', retailPrice: 54.99, marketPrice: 129.99, profit: 75.00, profitPercent: 136, stock: 'in_stock' },
  { id: '3', productName: 'Couronne Stellaire ETB', retailer: 'Leclerc', retailPrice: 49.99, marketPrice: 54.99, profit: 5.00, profitPercent: 10, stock: 'in_stock' },
];

// ============================================
// MARKET STATS
// ============================================
function MarketStats() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: 'Volume 24h', value: '€247K', change: '+12.4%', isPositive: true },
        { label: 'Actifs', value: '1,247', change: '+89', isPositive: true },
        { label: 'Tendance', value: 'Haussier', icon: TrendingUp, isPositive: true },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-3 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/5"
        >
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{stat.label}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white font-mono">{stat.value}</span>
            {stat.icon ? (
              <stat.icon size={14} className="text-profit" />
            ) : (
              <span className={`text-xs font-semibold ${stat.isPositive ? 'text-profit' : 'text-loss'}`}>
                {stat.change}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// HOT OPPORTUNITIES
// ============================================
function HotOpportunities({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-loss/10">
            <Flame size={16} className="text-loss" />
          </div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Opportunités</h2>
        </div>
        <button className="text-xs text-primary hover:underline">Voir tout</button>
      </div>
      
      <div className="space-y-2">
        {opportunities.map((opp, i) => (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="group relative p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/5 hover:border-profit/30 transition-all cursor-pointer overflow-hidden"
          >
            {/* Hot indicator */}
            {opp.profitPercent >= 50 && (
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-2 right-[-20px] w-[80px] transform rotate-45 bg-gradient-to-r from-loss to-orange-500 text-[8px] font-bold text-white text-center py-0.5">
                  HOT
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{opp.productName}</h3>
                  {opp.stock === 'low_stock' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-warning/20 text-warning">
                      Stock bas
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{opp.retailer}</span>
                  {opp.expiresAt && (
                    <span className="flex items-center gap-1 text-warning">
                      <Clock size={10} />
                      {opp.expiresAt}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-profit font-bold font-mono">
                  <ArrowUpRight size={14} />
                  +{opp.profit.toFixed(0)}€
                </div>
                <p className="text-xs text-zinc-500">
                  {opp.retailPrice}€ → {opp.marketPrice}€
                </p>
              </div>
            </div>
            
            {/* Profit bar */}
            <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(opp.profitPercent, 100)}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-profit to-emerald-400"
              />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 text-right">+{opp.profitPercent}% ROI</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ============================================
// PRICE TABLE ROW
// ============================================
function PriceRow({ item, index }: { item: MarketItem; index: number }) {
  const isPositive = item.change24h >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
    >
      {/* Rank/Hot */}
      <div className="w-8 flex-shrink-0 text-center">
        {item.isHot ? (
          <div className="w-6 h-6 mx-auto rounded-full bg-loss/20 flex items-center justify-center">
            <Flame size={12} className="text-loss" />
          </div>
        ) : (
          <span className="text-sm text-zinc-600 font-mono">{index + 1}</span>
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
            {item.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 uppercase">
            {item.category}
          </span>
          <span className="text-[10px] text-zinc-600">Vol: {item.volume}</span>
        </div>
      </div>
      
      {/* Price & Change */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-white font-mono">{item.currentPrice.toFixed(2)}€</p>
        <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${isPositive ? 'text-profit' : 'text-loss'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {isPositive ? '+' : ''}{item.change24h.toFixed(2)}%
        </div>
      </div>
      
      {/* Arrow */}
      <ChevronRight size={16} className="text-zinc-600 group-hover:text-white transition-colors flex-shrink-0" />
    </motion.div>
  );
}

// ============================================
// MARKET TABLE
// ============================================
function MarketTable({ items, filter }: { items: MarketItem[]; filter: string }) {
  const filteredItems = items.filter(item => {
    if (filter === 'trending') return item.trend === 'up';
    if (filter === 'falling') return item.trend === 'down';
    return true;
  });

  return (
    <div className="space-y-1">
      {filteredItems.map((item, index) => (
        <PriceRow key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-32">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-profit/10 border border-profit/20">
              <BarChart3 size={22} className="text-profit" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Market</h1>
              <p className="text-sm text-zinc-500">Prix en temps réel</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={18} className={`text-zinc-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </motion.header>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-profit/10 border border-profit/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-profit"></span>
          </span>
          <span className="text-xs font-semibold text-profit uppercase tracking-wider">Données Live</span>
          <span className="text-xs text-zinc-500">• Mise à jour il y a 12s</span>
        </motion.div>

        {/* Stats */}
        <MarketStats />

        {/* Hot Opportunities */}
        <HotOpportunities opportunities={opportunities} />

        {/* Price Table Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <TrendingUp size={16} className="text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Prix du Marché</h2>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10">
                  <X size={16} className="text-zinc-500" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {['all', 'trending', 'falling'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter === 'all' && 'Tous'}
                  {filter === 'trending' && (
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} /> Hausse
                    </span>
                  )}
                  {filter === 'falling' && (
                    <span className="flex items-center gap-1">
                      <TrendingDown size={12} /> Baisse
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-surface/30 border border-white/5 overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-500">
              <div className="w-8 text-center">#</div>
              <div className="flex-1">Produit</div>
              <div className="text-right w-24">Prix / 24h</div>
              <div className="w-4"></div>
            </div>
            
            {/* Table Body */}
            <MarketTable items={marketItems} filter={activeFilter} />
          </div>
        </motion.section>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-profit/10 border border-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black/30">
              <Star size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Alertes Prix</h3>
              <p className="text-xs text-zinc-400">Soyez notifié quand un prix atteint votre cible</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition-colors">
              Créer
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}