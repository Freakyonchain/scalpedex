'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  TrendingUp,
  TrendingDown,
  Package,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Plus,
  X,
  ChevronRight,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Trash2,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  ShoppingCart,
  RefreshCw
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type AlertType = 'price_target' | 'restock' | 'price_drop' | 'price_spike' | 'tip';
type ActivityType = 'scan' | 'sale' | 'purchase' | 'alert_triggered' | 'achievement';

interface PriceAlert {
  id: string;
  productName: string;
  productId: string;
  currentPrice: number;
  targetPrice: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  data?: {
    profit?: number;
    price?: number;
    productName?: string;
  };
  read: boolean;
}

interface Notification {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  actionUrl?: string;
  read: boolean;
  data?: {
    currentPrice?: number;
    previousPrice?: number;
    change?: number;
    productName?: string;
  };
}

// ============================================
// MOCK DATA
// ============================================
const priceAlerts: PriceAlert[] = [
  { id: '1', productName: 'ETB 151 JAP', productId: 'p1', currentPrice: 89.99, targetPrice: 100, condition: 'above', active: true, createdAt: '2025-01-15' },
  { id: '2', productName: 'Pikachu ex Premium', productId: 'p2', currentPrice: 129.99, targetPrice: 80, condition: 'below', active: true, createdAt: '2025-01-10' },
  { id: '3', productName: 'Couronne Stellaire ETB', productId: 'p3', currentPrice: 54.99, targetPrice: 65, condition: 'above', active: false, createdAt: '2025-01-05' },
];

const notifications: Notification[] = [
  { 
    id: '1', 
    type: 'price_spike', 
    title: '🚀 Prix en hausse!', 
    message: 'ETB 151 JAP a augmenté de +15% en 24h',
    timestamp: '2025-01-26T10:30:00',
    read: false,
    data: { currentPrice: 89.99, previousPrice: 78.25, change: 15, productName: 'ETB 151 JAP' }
  },
  { 
    id: '2', 
    type: 'restock', 
    title: '📦 Restock détecté!', 
    message: 'Pikachu ex Premium disponible chez Fnac à 54.99€',
    timestamp: '2025-01-26T09:15:00',
    read: false,
    data: { currentPrice: 54.99, productName: 'Pikachu ex Premium' }
  },
  { 
    id: '3', 
    type: 'tip', 
    title: '💡 Conseil du jour', 
    message: 'Les ETB japonais montrent une tendance haussière cette semaine. Bon moment pour vendre?',
    timestamp: '2025-01-26T08:00:00',
    read: true
  },
  { 
    id: '4', 
    type: 'price_drop', 
    title: '📉 Baisse de prix', 
    message: 'Obsidian Flames ETB a baissé de -8% - opportunité d\'achat?',
    timestamp: '2025-01-25T16:45:00',
    read: true,
    data: { currentPrice: 42.99, previousPrice: 46.72, change: -8, productName: 'Obsidian Flames ETB' }
  },
];

const activities: ActivityItem[] = [
  { id: '1', type: 'sale', title: 'Vente enregistrée', description: 'ETB 151 JAP vendu à 89.99€', timestamp: '2025-01-26T14:30:00', data: { profit: 47, productName: 'ETB 151 JAP' }, read: false },
  { id: '2', type: 'scan', title: 'Nouveau scan', description: 'Couronne Stellaire Bundle scanné', timestamp: '2025-01-26T11:20:00', read: true },
  { id: '3', type: 'achievement', title: '🏆 Succès débloqué!', description: 'Streak 7 jours - Bravo!', timestamp: '2025-01-26T00:00:00', read: false },
  { id: '4', type: 'purchase', title: 'Achat ajouté', description: 'Pikachu ex Premium x2 @ 54.99€', timestamp: '2025-01-25T15:00:00', data: { price: 54.99 }, read: true },
  { id: '5', type: 'alert_triggered', title: 'Alerte déclenchée', description: 'ETB 151 JAP a atteint votre cible de 85€', timestamp: '2025-01-24T10:00:00', read: true },
];

// ============================================
// NOTIFICATION CARD
// ============================================
function NotificationCard({ notification, onDismiss }: { notification: Notification; onDismiss: () => void }) {
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'price_spike':
        return { bg: 'bg-profit/10', border: 'border-profit/20', icon: <TrendingUp size={18} className="text-profit" /> };
      case 'price_drop':
        return { bg: 'bg-loss/10', border: 'border-loss/20', icon: <TrendingDown size={18} className="text-loss" /> };
      case 'restock':
        return { bg: 'bg-primary/10', border: 'border-primary/20', icon: <Package size={18} className="text-primary" /> };
      case 'tip':
        return { bg: 'bg-warning/10', border: 'border-warning/20', icon: <Sparkles size={18} className="text-warning" /> };
      default:
        return { bg: 'bg-white/5', border: 'border-white/10', icon: <Bell size={18} className="text-zinc-400" /> };
    }
  };

  const styles = getTypeStyles();
  const timeAgo = getTimeAgo(notification.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={`relative p-4 rounded-xl ${styles.bg} border ${styles.border} ${
        !notification.read ? 'ring-1 ring-primary/30' : ''
      }`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
      
      <div className="flex gap-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-black/20">
          {styles.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm mb-1">{notification.title}</h3>
          <p className="text-xs text-zinc-400 mb-2">{notification.message}</p>
          
          {/* Price change data */}
          {notification.data?.change && (
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-bold font-mono ${
                notification.data.change > 0 ? 'text-profit' : 'text-loss'
              }`}>
                {notification.data.change > 0 ? '+' : ''}{notification.data.change}%
              </span>
              <span className="text-xs text-zinc-500">
                {notification.data.previousPrice?.toFixed(2)}€ → {notification.data.currentPrice?.toFixed(2)}€
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-600">{timeAgo}</span>
            
            {notification.actionUrl && (
              <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                Voir <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
        
        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          <X size={14} className="text-zinc-500" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================
// PRICE ALERT CARD
// ============================================
function PriceAlertCard({ alert, onToggle, onDelete }: { 
  alert: PriceAlert; 
  onToggle: () => void;
  onDelete: () => void;
}) {
  const progress = alert.condition === 'above'
    ? Math.min((alert.currentPrice / alert.targetPrice) * 100, 100)
    : Math.min((alert.targetPrice / alert.currentPrice) * 100, 100);
  
  const isClose = Math.abs(alert.currentPrice - alert.targetPrice) / alert.targetPrice < 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-4 rounded-xl border transition-all ${
        alert.active 
          ? 'bg-surface/50 border-white/10' 
          : 'bg-white/5 border-white/5 opacity-60'
      }`}
    >
      {/* Close indicator */}
      {isClose && alert.active && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-warning/20 text-warning"
        >
          Proche!
        </motion.div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${alert.active ? 'bg-primary/10' : 'bg-white/5'}`}>
          <Target size={18} className={alert.active ? 'text-primary' : 'text-zinc-500'} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm mb-1">{alert.productName}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-zinc-500">Actuel:</span>
            <span className="text-sm font-mono text-white">{alert.currentPrice.toFixed(2)}€</span>
            <span className={`text-xs ${alert.condition === 'above' ? 'text-profit' : 'text-loss'}`}>
              {alert.condition === 'above' ? '→ ≥' : '→ ≤'}
            </span>
            <span className="text-sm font-mono font-bold text-primary">{alert.targetPrice.toFixed(2)}€</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full rounded-full ${
                isClose ? 'bg-warning' : 'bg-primary'
              }`}
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                alert.active 
                  ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                  : 'bg-white/5 text-zinc-500 hover:bg-white/10'
              }`}
            >
              {alert.active ? 'Actif' : 'Inactif'}
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-loss hover:bg-loss/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ACTIVITY ITEM
// ============================================
function ActivityListItem({ activity, index }: { activity: ActivityItem; index: number }) {
  const getTypeIcon = () => {
    switch (activity.type) {
      case 'sale':
        return <DollarSign size={14} className="text-profit" />;
      case 'scan':
        return <Zap size={14} className="text-primary" />;
      case 'purchase':
        return <ShoppingCart size={14} className="text-cyan-400" />;
      case 'achievement':
        return <Sparkles size={14} className="text-warning" />;
      case 'alert_triggered':
        return <Bell size={14} className="text-primary" />;
      default:
        return <Clock size={14} className="text-zinc-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
    >
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          activity.type === 'sale' ? 'bg-profit/10' :
          activity.type === 'achievement' ? 'bg-warning/10' :
          'bg-white/5'
        }`}>
          {getTypeIcon()}
        </div>
        {/* Line */}
        <div className="w-px flex-1 bg-white/5 mt-2" />
      </div>
      
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`font-medium text-sm ${!activity.read ? 'text-white' : 'text-zinc-300'}`}>
              {activity.title}
            </p>
            <p className="text-xs text-zinc-500">{activity.description}</p>
          </div>
          
          {activity.data?.profit && (
            <span className="text-sm font-bold text-profit font-mono flex-shrink-0">
              +{activity.data.profit}€
            </span>
          )}
        </div>
        
        <p className="text-[10px] text-zinc-600 mt-1">{getTimeAgo(activity.timestamp)}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// CREATE ALERT MODAL
// ============================================
function CreateAlertModal({ onClose }: { onClose: () => void }) {
  const [productName, setProductName] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-surface rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="font-semibold text-white">Nouvelle Alerte</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} className="text-zinc-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
              Produit
            </label>
            <input
              type="text"
              placeholder="Ex: ETB 151 JAP"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full h-12 px-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50"
            />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
              Condition
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setCondition('above')}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                  condition === 'above'
                    ? 'bg-profit/20 text-profit border border-profit/30'
                    : 'bg-white/5 text-zinc-400 border border-white/10'
                }`}
              >
                <ArrowUpRight size={18} />
                Au-dessus de
              </button>
              <button
                onClick={() => setCondition('below')}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                  condition === 'below'
                    ? 'bg-loss/20 text-loss border border-loss/30'
                    : 'bg-white/5 text-zinc-400 border border-white/10'
                }`}
              >
                <ArrowDownRight size={18} />
                En-dessous de
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
              Prix cible
            </label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="number"
                placeholder="0.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full h-12 pl-11 pr-12 bg-black/40 border border-white/10 rounded-xl text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-primary/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-white/5 text-zinc-400 font-medium hover:bg-white/10 transition-colors"
          >
            Annuler
          </button>
          <button
            disabled={!productName || !targetPrice}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bell size={18} />
            Créer l'alerte
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// HELPER
// ============================================
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'À l\'instant';
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)}min`;
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// ============================================
// MAIN PAGE
// ============================================
export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts' | 'activity'>('notifications');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [localAlerts, setLocalAlerts] = useState(priceAlerts);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const dismissNotification = (id: string) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleAlert = (id: string) => {
    setLocalAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  const deleteAlert = (id: string) => {
    setLocalAlerts(prev => prev.filter(a => a.id !== id));
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
            <div className="relative p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Bell size={22} className="text-primary" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-loss text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Alertes</h1>
              <p className="text-sm text-zinc-500">Notifications & activité</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-violet-500 flex items-center justify-center"
          >
            <Plus size={20} className="text-white" />
          </motion.button>
        </motion.header>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-2"
        >
          <div className="p-3 rounded-xl bg-surface/50 border border-white/5 text-center">
            <p className="text-lg font-bold text-white">{localAlerts.filter(a => a.active).length}</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Alertes actives</p>
          </div>
          <div className="p-3 rounded-xl bg-surface/50 border border-white/5 text-center">
            <p className="text-lg font-bold text-profit">{unreadCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Non lues</p>
          </div>
          <div className="p-3 rounded-xl bg-surface/50 border border-white/5 text-center">
            <p className="text-lg font-bold text-white">3</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Déclenchées</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-white/5">
          {[
            { id: 'notifications', label: 'Notifications', count: unreadCount },
            { id: 'alerts', label: 'Mes Alertes', count: localAlerts.filter(a => a.active).length },
            { id: 'activity', label: 'Activité' },
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
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-primary/20 text-primary'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {localNotifications.length > 0 ? (
                localNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => dismissNotification(notification.id)}
                  />
                ))
              ) : (
                <div className="py-12 text-center">
                  <Bell size={48} className="mx-auto text-zinc-700 mb-3" strokeWidth={1} />
                  <p className="text-zinc-500">Aucune notification</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {localAlerts.length > 0 ? (
                localAlerts.map((alert) => (
                  <PriceAlertCard
                    key={alert.id}
                    alert={alert}
                    onToggle={() => toggleAlert(alert.id)}
                    onDelete={() => deleteAlert(alert.id)}
                  />
                ))
              ) : (
                <div className="py-12 text-center">
                  <Target size={48} className="mx-auto text-zinc-700 mb-3" strokeWidth={1} />
                  <p className="text-zinc-500 mb-4">Aucune alerte de prix</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
                  >
                    Créer une alerte
                  </button>
                </div>
              )}
              
              {/* Create new alert CTA */}
              {localAlerts.length > 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-primary/30 transition-colors flex items-center justify-center gap-2 text-zinc-500 hover:text-primary"
                >
                  <Plus size={18} />
                  Ajouter une alerte
                </button>
              )}
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="rounded-xl bg-surface/50 border border-white/5 p-4">
                {activities.map((activity, index) => (
                  <ActivityListItem key={activity.id} activity={activity} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Alert Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateAlertModal onClose={() => setShowCreateModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}