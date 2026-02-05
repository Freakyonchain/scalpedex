'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  TrendingUp,
  Package,
  Scan,
  DollarSign,
  Flame,
  Target,
  Zap,
  Crown,
  ChevronRight,
  Bell,
  Shield,
  Moon,
  LogOut,
  Edit3,
  Camera,
  Trophy,
  Calendar,
  BarChart3,
  Sparkles,
  Gift,
  Lock
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface UserStats {
  totalScans: number;
  totalSales: number;
  totalProfit: number;
  avgRoi: number;
  portfolioValue: number;
  itemsOwned: number;
  streak: number;
  level: number;
  xp: number;
  xpToNext: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SaleHistory {
  id: string;
  productName: string;
  soldPrice: number;
  profit: number;
  profitPercent: number;
  date: string;
}

// ============================================
// MOCK DATA
// ============================================
const userStats: UserStats = {
  totalScans: 247,
  totalSales: 18,
  totalProfit: 847.50,
  avgRoi: 42.3,
  portfolioValue: 1289.99,
  itemsOwned: 12,
  streak: 7,
  level: 12,
  xp: 2450,
  xpToNext: 3000
};

const achievements: Achievement[] = [
  { id: '1', name: 'Premier Scan', description: 'Scanner votre premier produit', icon: <Scan size={20} />, unlocked: true, unlockedAt: '15 Nov 2024', rarity: 'common' },
  { id: '2', name: 'Chasseur', description: 'Scanner 100 produits', icon: <Target size={20} />, unlocked: true, unlockedAt: '20 Dec 2024', rarity: 'rare' },
  { id: '3', name: 'Première Vente', description: 'Enregistrer votre première vente', icon: <DollarSign size={20} />, unlocked: true, unlockedAt: '18 Nov 2024', rarity: 'common' },
  { id: '4', name: 'Profit +500€', description: 'Atteindre 500€ de profit total', icon: <TrendingUp size={20} />, unlocked: true, unlockedAt: '10 Jan 2025', rarity: 'epic' },
  { id: '5', name: 'Streak 7 jours', description: 'Utiliser l\'app 7 jours consécutifs', icon: <Flame size={20} />, unlocked: true, unlockedAt: 'Aujourd\'hui', rarity: 'rare' },
  { id: '6', name: 'Légende', description: 'Atteindre le niveau 25', icon: <Crown size={20} />, unlocked: false, progress: 12, maxProgress: 25, rarity: 'legendary' },
  { id: '7', name: 'ROI Master', description: 'Réaliser une vente à +100% ROI', icon: <Zap size={20} />, unlocked: true, unlockedAt: '5 Jan 2025', rarity: 'epic' },
  { id: '8', name: 'Collectionneur', description: 'Posséder 50 items', icon: <Package size={20} />, unlocked: false, progress: 12, maxProgress: 50, rarity: 'rare' },
];

const salesHistory: SaleHistory[] = [
  { id: '1', productName: 'ETB 151 JAP', soldPrice: 89.99, profit: 47.00, profitPercent: 109, date: '2025-01-20' },
  { id: '2', productName: 'Pikachu ex Premium', soldPrice: 129.99, profit: 80.00, profitPercent: 160, date: '2025-01-15' },
  { id: '3', productName: 'Couronne Stellaire ETB', soldPrice: 52.99, profit: 3.00, profitPercent: 6, date: '2025-01-10' },
];

const portfolioData = [
  { month: 'Août', value: 450 },
  { month: 'Sep', value: 620 },
  { month: 'Oct', value: 580 },
  { month: 'Nov', value: 890 },
  { month: 'Déc', value: 1050 },
  { month: 'Jan', value: 1290 },
];

// ============================================
// LEVEL BADGE
// ============================================
function LevelBadge({ level, xp, xpToNext }: { level: number; xp: number; xpToNext: number }) {
  const progress = (xp / xpToNext) * 100;
  
  const getLevelTitle = (level: number) => {
    if (level >= 25) return 'Légende';
    if (level >= 20) return 'Expert';
    if (level >= 15) return 'Vétéran';
    if (level >= 10) return 'Confirmé';
    if (level >= 5) return 'Apprenti';
    return 'Débutant';
  };
  
  const getLevelColor = (level: number) => {
    if (level >= 25) return 'from-amber-400 to-yellow-500';
    if (level >= 20) return 'from-purple-400 to-fuchsia-500';
    if (level >= 15) return 'from-cyan-400 to-blue-500';
    if (level >= 10) return 'from-emerald-400 to-green-500';
    return 'from-zinc-400 to-zinc-500';
  };

  return (
    <div className="flex items-center gap-3">
      {/* Level Circle */}
      <div className="relative">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getLevelColor(level)} p-0.5`}>
          <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
            <span className="text-lg font-bold text-white">{level}</span>
          </div>
        </div>
        {/* Progress ring */}
        <svg className="absolute inset-0 w-14 h-14 transform -rotate-90">
          <circle
            cx="28" cy="28" r="26"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-white/10"
          />
          <motion.circle
            cx="28" cy="28" r="26"
            stroke="url(#levelGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 163' }}
            animate={{ strokeDasharray: `${(progress / 100) * 163} 163` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#00ffa3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Level Info */}
      <div>
        <p className="text-sm font-bold text-white">{getLevelTitle(level)}</p>
        <p className="text-xs text-zinc-500">{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</p>
      </div>
    </div>
  );
}

// ============================================
// STREAK COUNTER
// ============================================
function StreakCounter({ streak }: { streak: number }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
      >
        <Flame size={20} className="text-orange-500" />
      </motion.div>
      <div>
        <p className="text-lg font-bold text-white font-mono">{streak}</p>
        <p className="text-[9px] uppercase tracking-wider text-orange-400">jours</p>
      </div>
    </motion.div>
  );
}

// ============================================
// MINI CHART
// ============================================
function MiniChart({ data }: { data: { month: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  return (
    <div className="h-24 flex items-end gap-1">
      {data.map((point, i) => {
        const height = ((point.value - minValue) / range) * 100;
        const isLast = i === data.length - 1;
        
        return (
          <motion.div
            key={point.month}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(height, 10)}%` }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div 
              className={`w-full rounded-t-sm ${
                isLast 
                  ? 'bg-gradient-to-t from-profit to-emerald-400' 
                  : 'bg-white/10 hover:bg-white/20'
              } transition-colors`}
              style={{ height: '100%' }}
            />
            <span className="text-[8px] text-zinc-600">{point.month.slice(0, 3)}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================
// STAT CARD
// ============================================
function StatCard({ icon, label, value, subValue, delay = 0 }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-3 rounded-xl bg-white/5 border border-white/5"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 rounded-md bg-white/5">{icon}</div>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-white font-mono">{value}</p>
      {subValue && <p className="text-xs text-zinc-500 mt-0.5">{subValue}</p>}
    </motion.div>
  );
}

// ============================================
// ACHIEVEMENT CARD
// ============================================
function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const rarityColors = {
    common: 'from-zinc-500 to-zinc-600 border-zinc-500/30',
    rare: 'from-blue-500 to-cyan-500 border-blue-500/30',
    epic: 'from-purple-500 to-fuchsia-500 border-purple-500/30',
    legendary: 'from-amber-400 to-yellow-500 border-amber-400/30',
  };
  
  const rarityBg = {
    common: 'bg-zinc-500/10',
    rare: 'bg-blue-500/10',
    epic: 'bg-purple-500/10',
    legendary: 'bg-amber-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`relative p-3 rounded-xl border ${
        achievement.unlocked 
          ? `${rarityBg[achievement.rarity]} ${rarityColors[achievement.rarity].split(' ')[2]}`
          : 'bg-white/5 border-white/5'
      } overflow-hidden`}
    >
      {/* Locked overlay */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10">
          <Lock size={16} className="text-zinc-500" />
        </div>
      )}
      
      {/* Content */}
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          achievement.unlocked 
            ? `bg-gradient-to-br ${rarityColors[achievement.rarity].split(' ').slice(0, 2).join(' ')}`
            : 'bg-white/10'
        }`}>
          <div className={achievement.unlocked ? 'text-white' : 'text-zinc-500'}>
            {achievement.icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-white' : 'text-zinc-500'}`}>
            {achievement.name}
          </h4>
          <p className="text-[10px] text-zinc-500 line-clamp-1">{achievement.description}</p>
          
          {/* Progress bar for locked achievements */}
          {!achievement.unlocked && achievement.progress !== undefined && (
            <div className="mt-2">
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <p className="text-[9px] text-zinc-600 mt-1">
                {achievement.progress}/{achievement.maxProgress}
              </p>
            </div>
          )}
          
          {/* Unlocked date */}
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-[9px] text-zinc-600 mt-1">{achievement.unlockedAt}</p>
          )}
        </div>
      </div>
      
      {/* Shine effect for legendary */}
      {achievement.unlocked && achievement.rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}
    </motion.div>
  );
}

// ============================================
// SALE HISTORY ITEM
// ============================================
function SaleHistoryItem({ sale, index }: { sale: SaleHistory; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
    >
      <div className="p-2 rounded-lg bg-profit/10">
        <DollarSign size={16} className="text-profit" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{sale.productName}</p>
        <p className="text-[10px] text-zinc-500">
          {new Date(sale.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </p>
      </div>
      
      <div className="text-right">
        <p className="text-profit font-bold font-mono">+{sale.profit.toFixed(0)}€</p>
        <p className="text-[10px] text-zinc-500">+{sale.profitPercent}%</p>
      </div>
    </motion.div>
  );
}

// ============================================
// SETTINGS ITEM
// ============================================
function SettingsItem({ icon, label, value, onClick, danger = false }: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
        danger ? 'hover:bg-loss/10' : 'hover:bg-white/5'
      }`}
    >
      <div className={`p-2 rounded-lg ${danger ? 'bg-loss/10' : 'bg-white/5'}`}>
        <div className={danger ? 'text-loss' : 'text-zinc-400'}>{icon}</div>
      </div>
      <span className={`flex-1 text-left font-medium ${danger ? 'text-loss' : 'text-white'}`}>
        {label}
      </span>
      {value && <span className="text-sm text-zinc-500">{value}</span>}
      <ChevronRight size={16} className={danger ? 'text-loss/50' : 'text-zinc-600'} />
    </button>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'settings'>('stats');

  return (
    <div className="min-h-screen px-4 pt-6 pb-32">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-2xl bg-surface/50 backdrop-blur-sm border border-white/5 overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-profit/10 opacity-50" />
          
          {/* HUD Corners */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
          
          <div className="relative">
            {/* Top row: Avatar + Streak */}
            <div className="flex items-start justify-between mb-4">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-profit p-0.5">
                  <div className="w-full h-full rounded-2xl bg-surface flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-zinc-600" />
                  </div>
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              
              {/* Streak */}
              <StreakCounter streak={userStats.streak} />
            </div>
            
            {/* User Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">Tinmar</h1>
                <button className="p-1 rounded-md hover:bg-white/10 transition-colors">
                  <Edit3 size={14} className="text-zinc-500" />
                </button>
              </div>
              <p className="text-sm text-zinc-500">Scalper depuis Nov 2024</p>
            </div>
            
            {/* Level */}
            <LevelBadge level={userStats.level} xp={userStats.xp} xpToNext={userStats.xpToNext} />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-white/5">
          {[
            { id: 'stats', label: 'Stats', icon: BarChart3 },
            { id: 'achievements', label: 'Succès', icon: Trophy },
            { id: 'settings', label: 'Paramètres', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={<Scan size={14} className="text-primary" />}
                  label="Scans"
                  value={userStats.totalScans}
                  delay={0}
                />
                <StatCard
                  icon={<DollarSign size={14} className="text-profit" />}
                  label="Ventes"
                  value={userStats.totalSales}
                  delay={0.1}
                />
                <StatCard
                  icon={<TrendingUp size={14} className="text-profit" />}
                  label="Profit Total"
                  value={`${userStats.totalProfit.toFixed(0)}€`}
                  subValue={`ROI moy. ${userStats.avgRoi}%`}
                  delay={0.2}
                />
                <StatCard
                  icon={<Package size={14} className="text-primary" />}
                  label="Portfolio"
                  value={`${userStats.portfolioValue.toFixed(0)}€`}
                  subValue={`${userStats.itemsOwned} items`}
                  delay={0.3}
                />
              </div>
              
              {/* Portfolio Chart */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl bg-surface/50 border border-white/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-profit/10">
                      <BarChart3 size={16} className="text-profit" />
                    </div>
                    <span className="text-sm font-semibold text-white">Évolution Portfolio</span>
                  </div>
                  <span className="text-xs text-profit font-semibold">+186%</span>
                </div>
                <MiniChart data={portfolioData} />
              </motion.div>
              
              {/* Recent Sales */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <DollarSign size={16} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-white">Ventes Récentes</span>
                  </div>
                  <button className="text-xs text-primary hover:underline">Voir tout</button>
                </div>
                
                <div className="space-y-2">
                  {salesHistory.map((sale, index) => (
                    <SaleHistoryItem key={sale.id} sale={sale} index={index} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Progress Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-profit/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/30">
                    <Trophy size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {achievements.filter(a => a.unlocked).length}/{achievements.length} Succès
                    </p>
                    <div className="h-2 rounded-full bg-black/30 mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-profit"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Achievement Grid */}
              <div className="grid grid-cols-1 gap-3">
                {achievements.map((achievement, index) => (
                  <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Notifications */}
              <div className="rounded-xl bg-surface/50 border border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Notifications</p>
                </div>
                <div className="p-2">
                  <SettingsItem icon={<Bell size={18} />} label="Alertes de prix" value="Activé" />
                  <SettingsItem icon={<Gift size={18} />} label="Nouveaux drops" value="Activé" />
                  <SettingsItem icon={<Sparkles size={18} />} label="Tips & Astuces" value="Désactivé" />
                </div>
              </div>
              
              {/* Préférences */}
              <div className="rounded-xl bg-surface/50 border border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Préférences</p>
                </div>
                <div className="p-2">
                  <SettingsItem icon={<Moon size={18} />} label="Thème sombre" value="Auto" />
                  <SettingsItem icon={<Target size={18} />} label="Devise" value="EUR €" />
                  <SettingsItem icon={<Calendar size={18} />} label="Format de date" value="DD/MM/YYYY" />
                </div>
              </div>
              
              {/* Sécurité */}
              <div className="rounded-xl bg-surface/50 border border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Compte</p>
                </div>
                <div className="p-2">
                  <SettingsItem icon={<Shield size={18} />} label="Sécurité" />
                  <SettingsItem icon={<User size={18} />} label="Modifier le profil" />
                  <SettingsItem icon={<LogOut size={18} />} label="Déconnexion" danger />
                </div>
              </div>
              
              {/* Version */}
              <div className="text-center py-4">
                <p className="text-xs text-zinc-600">ScalpeDex v1.0.0</p>
                <p className="text-[10px] text-zinc-700">Made with 💜 for scalpers</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}