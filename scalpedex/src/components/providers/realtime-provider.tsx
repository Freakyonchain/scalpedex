'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Bell, TrendingUp, TrendingDown, Package, Trophy, Zap } from 'lucide-react';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================
// TYPES
// ============================================
interface Notification {
  id: string;
  type: 'price_spike' | 'price_drop' | 'restock' | 'alert_triggered' | 'achievement' | 'tip' | 'system';
  title: string;
  message: string;
  data: Record<string, unknown>;
  action_url?: string;
  read: boolean;
  created_at: string;
}

interface RealtimeContextType {
  unreadCount: number;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

// ============================================
// TACTICAL NOTIFICATION TOAST
// ============================================
function showNotificationToast(notification: Notification) {
  const iconMap: Record<string, React.ReactNode> = {
    price_spike: <TrendingUp size={16} className="text-profit" />,
    price_drop: <TrendingDown size={16} className="text-loss" />,
    alert_triggered: <Zap size={16} className="text-warning" />,
    achievement: <Trophy size={16} className="text-primary" />,
    restock: <Package size={16} className="text-cyan-400" />,
    tip: <Bell size={16} className="text-violet-400" />,
    system: <Bell size={16} className="text-zinc-400" />,
  };

  const styleMap: Record<string, React.CSSProperties> = {
    price_spike: {
      background: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.4)',
      boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
    },
    price_drop: {
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
    },
    alert_triggered: {
      background: 'rgba(245, 158, 11, 0.15)',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)',
    },
    achievement: {
      background: 'rgba(139, 92, 246, 0.15)',
      border: '1px solid rgba(139, 92, 246, 0.4)',
      boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
    },
    restock: {
      background: 'rgba(34, 211, 238, 0.15)',
      border: '1px solid rgba(34, 211, 238, 0.4)',
      boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)',
    },
    default: {
      background: 'rgba(63, 63, 70, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  };

  toast(
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-white text-sm">{notification.title}</span>
      <span className="text-zinc-400 text-xs">{notification.message}</span>
    </div>,
    {
      icon: iconMap[notification.type] || iconMap.system,
      style: styleMap[notification.type] || styleMap.default,
      duration: 5000,
      action: notification.action_url ? {
        label: 'Voir',
        onClick: () => window.location.href = notification.action_url!,
      } : undefined,
    }
  );
}

// ============================================
// PROVIDER
// ============================================
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Initialize connection
  useEffect(() => {
    const supabase = createClient();
    
    // Get initial unread count
    const fetchUnreadCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      setUnreadCount(count ?? 0);
    };

    // Subscribe to new notifications
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newChannel = supabase
        .channel('notifications-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            
            // Add to local state
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast
            showNotificationToast(newNotification);
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
          console.log('[Realtime] Subscription status:', status);
        });

      setChannel(newChannel);
    };

    fetchUnreadCount();
    setupRealtimeSubscription();

    // Cleanup
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Mark single notification as read
  const markAsRead = useCallback(async (id: string) => {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  }, []);

  return (
    <RealtimeContext.Provider value={{
      unreadCount,
      notifications,
      markAsRead,
      markAllAsRead,
      isConnected,
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================
export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}

// ============================================
// NOTIFICATION BADGE COMPONENT
// ============================================
export function NotificationBadge({ className = '' }: { className?: string }) {
  const { unreadCount, isConnected } = useRealtime();

  if (unreadCount === 0) return null;

  return (
    <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-loss text-white text-[10px] font-bold ${className}`}>
      {unreadCount > 99 ? '99+' : unreadCount}
      {isConnected && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-profit rounded-full animate-pulse" />
      )}
    </span>
  );
}