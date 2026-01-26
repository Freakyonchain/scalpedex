/**
 * ============================================================================
 * SCALPEDEX DATABASE TYPES
 * Version: 2.0.0
 * Generated from: database/migration_v2.sql
 * ============================================================================
 * 
 * These types mirror the Supabase database schema.
 * Keep in sync with SQL migrations.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type AlertCondition = 'above' | 'below';

export type AlertStatus = 'active' | 'paused' | 'triggered' | 'expired';

export type NotificationType = 
  | 'price_spike'
  | 'price_drop'
  | 'restock'
  | 'alert_triggered'
  | 'achievement'
  | 'tip'
  | 'system';

export type ActivityType = 
  | 'scan'
  | 'collection_add'
  | 'collection_sell'
  | 'collection_update'
  | 'alert_create'
  | 'alert_triggered'
  | 'achievement';

export type MarketTrend = 'up' | 'down' | 'stable';

export type CurrencyCode = 'USD' | 'EUR' | 'CAD' | 'GBP' | 'JPY';

export type ProductLanguage = 'EN' | 'FR' | 'JP' | 'DE' | 'ES' | 'IT';

export type ProductType = 
  | 'etb'
  | 'booster_box'
  | 'booster_bundle'
  | 'booster_pack'
  | 'premium_collection'
  | 'tin'
  | 'single_card'
  | 'accessory'
  | 'other';

export type ItemCondition = 
  | 'FACTORY_SEALED'
  | 'CUSTOM_SEALED'
  | 'MINT'
  | 'NEAR_MINT'
  | 'PLAYED';


// ============================================================================
// BASE TABLES
// ============================================================================

/**
 * User profile with gamification data
 */
export interface Profile {
  id: string; // UUID, references auth.users
  username: string | null;
  preferred_currency: CurrencyCode;
  level: number;
  xp: number;
  streak_current: number;
  streak_best: number;
  last_active_date: string | null; // ISO date string
  total_scans: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Product catalog
 */
export interface Product {
  id: string;
  ean: string | null;
  name: string;
  type: ProductType;
  set_name: string | null;
  release_date: string | null;
  msrp: number | null;
  image_url: string | null;
  slug: string | null;
  language: ProductLanguage;
  created_at: string;
}

/**
 * Historical market prices
 */
export interface MarketPrice {
  id: string;
  product_id: string;
  price: number;
  currency: CurrencyCode;
  source: string;
  recorded_at: string;
}

/**
 * Real-time price cache (updated via trigger)
 */
export interface ProductPriceCache {
  product_id: string;
  current_price: number | null;
  current_currency: CurrencyCode;
  price_24h_ago: number | null;
  price_7d_ago: number | null;
  change_24h: number | null; // Percentage
  change_7d: number | null;  // Percentage
  trend: MarketTrend;
  volume_24h: number;
  high_24h: number | null;
  low_24h: number | null;
  last_updated: string;
}

/**
 * User's collection items
 */
export interface UserCollectionItem {
  id: string;
  user_id: string;
  product_id: string | null;
  purchase_price: number | null;
  purchase_currency: CurrencyCode;
  quantity: number;
  condition: ItemCondition;
  purchase_date: string | null;
  sold_date: string | null;
  sold_price: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}


// ============================================================================
// GAMIFICATION
// ============================================================================

/**
 * Achievement definition (static data)
 */
export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string | null; // Lucide icon name
  rarity: AchievementRarity;
  xp_reward: number;
  max_progress: number | null; // NULL for one-shot achievements
  sort_order: number;
  created_at: string;
}

/**
 * User's achievement progress/unlock status
 */
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  unlocked_at: string | null; // NULL = locked
  notified: boolean;
  created_at: string;
}

/**
 * Achievement with user progress (joined query result)
 */
export interface AchievementWithProgress extends Achievement {
  user_progress: number;
  is_unlocked: boolean;
  unlocked_at: string | null;
}


// ============================================================================
// ALERTS
// ============================================================================

/**
 * User price alert
 */
export interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  target_price: number;
  condition: AlertCondition;
  status: AlertStatus;
  triggered_at: string | null;
  triggered_price: number | null;
  created_at: string;
  expires_at: string | null;
}

/**
 * Price alert with product info (joined query result)
 */
export interface PriceAlertWithProduct extends PriceAlert {
  product: Pick<Product, 'id' | 'name' | 'image_url' | 'ean'>;
  current_price: number | null;
}


// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * User notification
 */
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  action_url: string | null;
  read: boolean;
  created_at: string;
}

/**
 * JSONB data schemas by notification type
 */
export type NotificationData = 
  | PriceSpikeData
  | PriceDropData
  | RestockData
  | AlertTriggeredData
  | AchievementNotificationData
  | TipData
  | SystemData;

export interface PriceSpikeData {
  product_id: string;
  product_name: string;
  old_price: number;
  new_price: number;
  change_percent: number;
}

export interface PriceDropData {
  product_id: string;
  product_name: string;
  old_price: number;
  new_price: number;
  change_percent: number;
}

export interface RestockData {
  product_id: string;
  product_name: string;
  retailer: string;
  price: number;
  url?: string;
}

export interface AlertTriggeredData {
  alert_id: string;
  product_id: string;
  product_name: string;
  target_price: number;
  actual_price: number;
  condition: AlertCondition;
}

export interface AchievementNotificationData {
  achievement_id: string;
  achievement_code: string;
  xp_gained: number;
  rarity: AchievementRarity;
}

export interface TipData {
  tip_id?: string;
  category?: string;
}

export interface SystemData {
  category?: string;
  priority?: 'low' | 'normal' | 'high';
}


// ============================================================================
// ACTIVITY LOG
// ============================================================================

/**
 * Activity log entry
 */
export interface ActivityLogEntry {
  id: string;
  user_id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  data: ActivityData;
  created_at: string;
}

/**
 * JSONB data schemas by activity type
 */
export type ActivityData = 
  | ScanActivityData
  | CollectionAddActivityData
  | CollectionSellActivityData
  | AlertActivityData
  | AchievementActivityData;

export interface ScanActivityData {
  barcode: string;
  product_id: string | null;
  score: number | null;
  retail_price: number | null;
}

export interface CollectionAddActivityData {
  collection_id: string;
  product_id: string;
  quantity: number;
  purchase_price: number;
  condition: ItemCondition;
}

export interface CollectionSellActivityData {
  collection_id: string;
  product_id: string;
  sold_price: number;
  purchase_price: number;
  profit: number;
}

export interface AlertActivityData {
  alert_id: string;
  product_id?: string;
  price?: number;
  triggered_price?: number;
}

export interface AchievementActivityData {
  achievement_id: string;
  xp_gained: number;
}


// ============================================================================
// SCAN HISTORY
// ============================================================================

/**
 * Scan history entry
 */
export interface ScanHistoryEntry {
  id: string;
  user_id: string;
  product_id: string | null;
  barcode: string;
  retail_price: number | null;
  retailer: string | null;
  location_hint: string | null;
  calculated_score: number | null; // 0-100
  added_to_collection: boolean;
  created_at: string;
}

/**
 * Scan with product info (joined query result)
 */
export interface ScanWithProduct extends ScanHistoryEntry {
  product: Product | null;
  market_price: number | null;
}


// ============================================================================
// API RESPONSES / COMPUTED TYPES
// ============================================================================

/**
 * User stats summary (from fn_get_user_stats)
 */
export interface UserStats {
  total_scans: number;
  level: number;
  xp: number;
  streak_current: number;
  streak_best: number;
  total_items: number;
  portfolio_value: number;
  total_sales: number;
  total_profit: number;
  avg_roi: number;
  achievements_unlocked: number;
  achievements_total: number;
}

/**
 * XP requirements helper
 */
export const XP_PER_LEVEL = 500;

export function getXpForLevel(level: number): number {
  return level * XP_PER_LEVEL;
}

export function getLevelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export function getXpProgress(xp: number): { current: number; required: number; percent: number } {
  const level = getLevelFromXp(xp);
  const currentLevelXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const progress = xp - currentLevelXp;
  const required = nextLevelXp - currentLevelXp;
  return {
    current: progress,
    required,
    percent: (progress / required) * 100,
  };
}

/**
 * Level titles
 */
export function getLevelTitle(level: number): string {
  if (level >= 25) return 'Légende';
  if (level >= 20) return 'Expert';
  if (level >= 15) return 'Vétéran';
  if (level >= 10) return 'Confirmé';
  if (level >= 5) return 'Apprenti';
  return 'Débutant';
}

/**
 * Scalp score calculation
 */
export interface ScalpScore {
  score: number; // 0-100
  profit: number;
  profitPercent: number;
  recommendation: string;
  color: 'profit' | 'warning' | 'loss';
}

export function calculateScalpScore(
  retailPrice: number,
  marketPrice: number
): ScalpScore {
  const profit = marketPrice - retailPrice;
  const profitPercent = (profit / retailPrice) * 100;
  
  let score: number;
  let recommendation: string;
  let color: 'profit' | 'warning' | 'loss';
  
  if (profitPercent >= 50) {
    score = Math.min(100, 90 + (profitPercent - 50) / 5);
    recommendation = '🔥 ACHETER IMMÉDIATEMENT';
    color = 'profit';
  } else if (profitPercent >= 25) {
    score = 70 + ((profitPercent - 25) / 25) * 20;
    recommendation = '✅ Excellente opportunité';
    color = 'profit';
  } else if (profitPercent >= 10) {
    score = 50 + ((profitPercent - 10) / 15) * 20;
    recommendation = '⚠️ Profit modéré';
    color = 'warning';
  } else if (profitPercent > 0) {
    score = 30 + (profitPercent / 10) * 20;
    recommendation = '😐 Marge faible';
    color = 'warning';
  } else {
    score = Math.max(0, 30 + profitPercent);
    recommendation = '❌ Non rentable';
    color = 'loss';
  }
  
  return {
    score: Math.round(score),
    profit,
    profitPercent,
    recommendation,
    color,
  };
}


// ============================================================================
// SUPABASE QUERY HELPERS
// ============================================================================

/**
 * Product with price cache (common join)
 */
export interface ProductWithPrice extends Product {
  price_cache: ProductPriceCache | null;
}

/**
 * Collection item with product and price (common join)
 */
export interface CollectionItemWithDetails extends UserCollectionItem {
  product: Product | null;
  current_market_price: number | null;
  unrealized_profit: number | null;
  unrealized_roi: number | null;
}

/**
 * Input types for mutations
 */
export interface CreatePriceAlertInput {
  product_id: string;
  target_price: number;
  condition: AlertCondition;
  expires_at?: string;
}

export interface CreateScanInput {
  barcode: string;
  product_id?: string;
  retail_price?: number;
  retailer?: string;
  location_hint?: string;
  calculated_score?: number;
}

export interface AddToCollectionInput {
  product_id: string;
  purchase_price: number;
  quantity?: number;
  condition?: ItemCondition;
  purchase_date?: string;
  notes?: string;
}

export interface RecordSaleInput {
  collection_item_id: string;
  sold_price: number;
  sold_date?: string;
}


// ============================================================================
// REALTIME SUBSCRIPTION PAYLOADS
// ============================================================================

export interface RealtimeNotification {
  eventType: 'INSERT';
  new: Notification;
}

export interface RealtimePriceUpdate {
  eventType: 'INSERT' | 'UPDATE';
  new: ProductPriceCache;
  old?: ProductPriceCache;
}

export interface RealtimeAlertTriggered {
  eventType: 'UPDATE';
  new: PriceAlert;
  old: PriceAlert;
}