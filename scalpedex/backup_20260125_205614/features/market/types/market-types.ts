// /src/features/market/types/market-types.ts

export type TrendDirection = 'up' | 'down' | 'stable';

export interface ProductTrend {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  currentPrice: number;
  previousPrice: number;
  percentageChange: number;
  volumeChange: number;
  trend: TrendDirection;
  heatScore: number; // 0-100
}

export interface MarketOpportunity {
  id: string;
  productId: string;
  productName: string;
  imageUrl?: string;
  retailPrice: number;
  marketPrice: number;
  profit: number;
  profitPercentage: number;
  score: number; // 0-100
  source: string;
  updatedAt: string;
}

export interface MarketSale {
  id: string;
  productId: string;
  productName: string;
  imageUrl?: string;
  price: number;
  condition: string;
  platform: string;
  timestamp: string;
  trend: TrendDirection;
}

export interface MarketStats {
  volume24h: number;
  volumeChange: number;
  averagePrice: number;
  priceChange: number;
  topCategory: string;
  timestamp: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface PriceHistory {
  productId: string;
  productName: string;
  history: PriceHistoryPoint[];
  lastUpdated: string;
}

export interface MarketSearchParams {
  category?: string;
  trend?: TrendDirection;
  minProfit?: number;
  limit?: number;
}

export interface MarketDataResponse {
  hotProducts: ProductTrend[];
  opportunities: MarketOpportunity[];
  recentSales: MarketSale[];
  stats: MarketStats;
}