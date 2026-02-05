'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Search, 
  Package,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  X,
  Zap,
  Calendar,
  DollarSign,
  Trash2,
  Check,
  Filter
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type Condition = 'FACTORY_SEALED' | 'CUSTOM_SEALED' | 'MINT' | 'NEAR_MINT' | 'PLAYED';

const CONDITIONS: Record<Condition, string> = {
  FACTORY_SEALED: 'Scellé Usine',
  CUSTOM_SEALED: 'Scellé Custom',
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  PLAYED: 'Joué'
};

interface Product {
  id: string;
  name: string;
  imageUrl?: string;
  category?: string;
  marketPrice?: number;
}

interface CollectionItem {
  id: string;
  product: Product;
  quantity: number;
  condition: Condition;
  purchasePrice: number;
  purchaseDate?: string;
}

// ============================================
// MOCK DATA
// ============================================
const mockItems: CollectionItem[] = [
  {
    id: '1',
    product: { id: 'p1', name: 'Écarlate et Violet 151 - ETB JAP', category: 'Elite Trainer Box', marketPrice: 89.99 },
    quantity: 2, condition: 'FACTORY_SEALED', purchasePrice: 42.99, purchaseDate: '2024-11-15'
  },
  {
    id: '2',
    product: { id: 'p2', name: 'Couronne Stellaire - Booster Bundle', category: 'Booster Bundle', marketPrice: 45.99 },
    quantity: 1, condition: 'FACTORY_SEALED', purchasePrice: 32.99, purchaseDate: '2024-12-20'
  },
  {
    id: '3',
    product: { id: 'p3', name: 'Pikachu ex Premium Collection', category: 'Premium Collection', marketPrice: 129.99 },
    quantity: 3, condition: 'MINT', purchasePrice: 89.99, purchaseDate: '2025-01-05'
  },
  {
    id: '4',
    product: { id: 'p4', name: 'Destinées de Paldea - ETB', category: 'Elite Trainer Box', marketPrice: 54.99 },
    quantity: 1, condition: 'FACTORY_SEALED', purchasePrice: 54.99, purchaseDate: '2024-10-01'
  },
  {
    id: '5',
    product: { id: 'p5', name: 'Obsidian Flames - Booster Box', category: 'Booster Box', marketPrice: 159.99 },
    quantity: 1, condition: 'CUSTOM_SEALED', purchasePrice: 119.99, purchaseDate: '2024-08-15'
  },
  {
    id: '6',
    product: { id: 'p6', name: 'Charizard ex Premium Collection', category: 'Premium Collection', marketPrice: 89.99 },
    quantity: 2, condition: 'NEAR_MINT', purchasePrice: 49.99, purchaseDate: '2024-09-20'
  }
];

// ============================================
// STAT CARD
// ============================================
function StatCard({ icon, label, value, subValue, subValueColor = 'default', delay = 0 }: { 
  icon: React.ReactNode; label: string; value: string | number; subValue?: string; subValueColor?: 'profit' | 'loss' | 'default'; delay?: number;
}) {
  const colors = { profit: 'text-profit', loss: 'text-loss', default: 'text-zinc-500' };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      className="relative p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/5 overflow-hidden group">
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30" />
      <div className="flex items-center justify-between mb-3">
        <div className="p-1.5 rounded-md bg-white/5">{icon}</div>
        {subValue && <span className={`text-xs font-semibold ${colors[subValueColor]}`}>{subValue}</span>}
      </div>
      <p className="text-xl font-bold text-white font-mono">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">{label}</p>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

// ============================================
// ITEM CARD
// ============================================
function ItemCard({ item, onClick, index }: { item: CollectionItem; onClick: () => void; index: number; }) {
  const { product, condition, quantity, purchasePrice } = item;
  const profit = product.marketPrice ? product.marketPrice - purchasePrice : 0;
  const profitPercent = product.marketPrice ? ((profit / purchasePrice) * 100) : 0;
  
  const conditionStyles: Record<Condition, string> = {
    FACTORY_SEALED: 'from-cyan-500 to-blue-500 border-cyan-400/30',
    CUSTOM_SEALED: 'from-purple-500 to-fuchsia-500 border-purple-400/30',
    MINT: 'from-emerald-500 to-green-500 border-emerald-400/30',
    NEAR_MINT: 'from-amber-500 to-yellow-500 border-amber-400/30',
    PLAYED: 'from-zinc-500 to-zinc-600 border-zinc-400/30'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick} className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer">
      <div className="absolute inset-0 bg-surface border border-white/5 group-hover:border-primary/30 transition-colors" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
          <Package size={48} className="text-zinc-700" strokeWidth={1} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      
      <div className="absolute top-2 right-2 z-10">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${conditionStyles[condition]} text-white border backdrop-blur-sm shadow-lg`}>
          {condition === 'FACTORY_SEALED' && <Zap size={10} />}
          {CONDITIONS[condition]?.split(' ')[0]}
        </div>
      </div>
      
      {quantity > 1 && (
        <div className="absolute top-2 left-2 z-10">
          <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-xs font-bold text-white">×{quantity}</span>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="font-mono font-bold">
            <span className="text-white">{Math.floor(purchasePrice)}</span>
            <span className="text-zinc-500 text-sm">.{(purchasePrice % 1).toFixed(2).slice(2)}€</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${profitPercent >= 0 ? 'text-profit' : 'text-loss'}`}>
            {profitPercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(0)}%
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-primary/50 rounded-tl" />
        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-primary/50 rounded-tr" />
        <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-primary/50 rounded-bl" />
        <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-primary/50 rounded-br" />
      </div>
    </motion.div>
  );
}

// ============================================
// ITEM MODAL
// ============================================
function ItemModal({ item, onClose }: { item: CollectionItem; onClose: () => void; }) {
  const [showSellPanel, setShowSellPanel] = useState(false);
  const [soldPrice, setSoldPrice] = useState('');
  const profit = soldPrice ? parseFloat(soldPrice) - item.purchasePrice : null;
  const profitPercentage = profit ? (profit / item.purchasePrice) * 100 : null;
  const marketProfit = item.product.marketPrice ? item.product.marketPrice - item.purchasePrice : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
        onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-surface rounded-2xl border border-white/10 overflow-hidden">
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors">
          <X size={18} className="text-zinc-400" />
        </button>

        <div className="relative h-40 bg-gradient-to-br from-primary/10 to-profit/5">
          <div className="w-full h-full flex items-center justify-center"><Package size={64} className="text-zinc-700" strokeWidth={1} /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="px-2 py-1 rounded-md text-xs font-semibold bg-primary/20 text-primary border border-primary/30">{CONDITIONS[item.condition]}</span>
            {item.product.marketPrice && (
              <span className={`flex items-center gap-1 text-sm font-semibold ${marketProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {marketProfit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {marketProfit >= 0 ? '+' : ''}{marketProfit.toFixed(2)}€
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{item.product.category}</p>
            <h2 className="text-xl font-bold text-white">{item.product.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-500 mb-1"><DollarSign size={14} /><span className="text-[10px] uppercase tracking-wider">Prix d&apos;achat</span></div>
              <p className="text-lg font-bold text-white font-mono">{item.purchasePrice.toFixed(2)}€</p>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-500 mb-1"><TrendingUp size={14} /><span className="text-[10px] uppercase tracking-wider">Prix marché</span></div>
              <p className="text-lg font-bold text-profit font-mono">{item.product.marketPrice?.toFixed(2) || '-'}€</p>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-500 mb-1"><Package size={14} /><span className="text-[10px] uppercase tracking-wider">Quantité</span></div>
              <p className="text-lg font-bold text-white font-mono">{item.quantity}</p>
            </div>
            {item.purchaseDate && (
              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <div className="flex items-center gap-2 text-zinc-500 mb-1"><Calendar size={14} /><span className="text-[10px] uppercase tracking-wider">Date</span></div>
                <p className="text-sm text-white">{new Date(item.purchaseDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: '2-digit' })}</p>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {showSellPanel ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Prix de vente</label>
                  <div className="relative">
                    <input type="number" placeholder="0.00" value={soldPrice} onChange={(e) => setSoldPrice(e.target.value)}
                      className="w-full h-12 px-4 pr-10 bg-black/40 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-primary/50" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                  </div>
                </div>
                {profit !== null && (
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Profit</span>
                      <span className={`font-bold font-mono ${profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {profit >= 0 ? '+' : ''}{profit.toFixed(2)}€ <span className="text-xs">({profitPercentage!.toFixed(1)}%)</span>
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setShowSellPanel(false)} className="flex-1 h-12 rounded-xl bg-white/5 text-zinc-400 font-semibold hover:bg-white/10 transition-colors">Annuler</button>
                  <button disabled={!soldPrice} className="flex-1 h-12 rounded-xl bg-gradient-to-r from-profit to-emerald-400 text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                    <Check size={18} />Confirmer
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                <button className="h-12 px-4 rounded-xl bg-white/5 text-zinc-400 hover:bg-loss/20 hover:text-loss transition-colors"><Trash2 size={18} /></button>
                <button onClick={() => setShowSellPanel(true)} className="flex-1 h-12 rounded-xl bg-gradient-to-r from-profit to-emerald-400 text-black font-semibold flex items-center justify-center gap-2">
                  <TrendingUp size={18} />Marquer vendu
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function CollectionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<Condition | ''>('');
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  
  const filteredItems = useMemo(() => {
    return mockItems.filter(item => {
      const matchesSearch = !searchQuery || item.product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCondition = !selectedCondition || item.condition === selectedCondition;
      return matchesSearch && matchesCondition;
    });
  }, [searchQuery, selectedCondition]);
  
  const stats = useMemo(() => {
    const totalValue = mockItems.reduce((sum, item) => sum + (item.product.marketPrice || item.purchasePrice) * item.quantity, 0);
    const totalCost = mockItems.reduce((sum, item) => sum + item.purchasePrice * item.quantity, 0);
    const totalItems = mockItems.reduce((sum, item) => sum + item.quantity, 0);
    const sealedCount = mockItems.filter(item => item.condition === 'FACTORY_SEALED' || item.condition === 'CUSTOM_SEALED').reduce((sum, item) => sum + item.quantity, 0);
    const profitPercent = ((totalValue - totalCost) / totalCost) * 100;
    return { totalValue, totalItems, sealedCount, profitPercent };
  }, []);

  return (
    <div className="min-h-screen px-4 pt-6 pb-32">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <LayoutGrid size={22} className="text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Ma Collection</h1>
              <p className="text-sm text-zinc-500">{stats.totalItems} produits trackés</p>
            </div>
          </div>
          <Link href="/scan">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-xl bg-gradient-to-r from-profit to-emerald-400 flex items-center justify-center">
              <Plus size={20} className="text-black" />
            </motion.button>
          </Link>
        </motion.header>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Wallet size={16} className="text-profit" strokeWidth={1.5} />} label="Valeur totale" value={`${stats.totalValue.toFixed(0)}€`} subValue={`${stats.profitPercent >= 0 ? '+' : ''}${stats.profitPercent.toFixed(1)}%`} subValueColor={stats.profitPercent >= 0 ? 'profit' : 'loss'} delay={0} />
          <StatCard icon={<Package size={16} className="text-primary" strokeWidth={1.5} />} label="Items" value={stats.totalItems} subValue={`${stats.sealedCount} scellés`} delay={0.1} />
          <StatCard icon={<TrendingUp size={16} className="text-profit" strokeWidth={1.5} />} label="Meilleur ROI" value="+109%" subValue="ETB 151 JAP" delay={0.2} />
          <StatCard icon={<AlertCircle size={16} className="text-warning" strokeWidth={1.5} />} label="Alertes prix" value="2" subValue="Actives" subValueColor="profit" delay={0.3} />
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.5} />
            <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10">
                <X size={16} className="text-zinc-500" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-white/5">
              <Filter size={14} className="text-zinc-500 ml-1.5" />
              <button onClick={() => setSelectedCondition('')} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${selectedCondition === '' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>Tous</button>
              {Object.entries(CONDITIONS).map(([value, label]) => (
                <button key={value} onClick={() => setSelectedCondition(value as Condition)} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${selectedCondition === value ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>{label.split(' ')[0]}</button>
              ))}
            </div>
          </div>
        </motion.div>

        {(searchQuery || selectedCondition) && <p className="text-sm text-zinc-500">{filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''}</p>}

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} onClick={() => setSelectedItem(item)} />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}