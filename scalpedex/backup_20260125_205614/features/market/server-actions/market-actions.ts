// /src/features/market/server-actions/market-actions.ts
'use server';

import { createClient } from '@/shared/server/supabase';
import { 
  MarketDataResponse, 
  ProductTrend, 
  MarketOpportunity, 
  MarketSale,
  MarketStats,
  PriceHistory,
  MarketSearchParams
} from '../types/market-types';

/**
 * Récupère toutes les données du marché pour le dashboard
 */
export async function getMarketData(): Promise<MarketDataResponse> {
  try {
    const hotProducts = await getHotProducts({ limit: 6 });
    const opportunities = await getMarketOpportunities({ limit: 4 });
    const recentSales = await getRecentSales({ limit: 5 });
    const stats = await getMarketStats();
    
    return {
      hotProducts,
      opportunities,
      recentSales,
      stats
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    
    // Retourner des données fictives en cas d'erreur pour éviter de casser l'UI
    return {
      hotProducts: [],
      opportunities: [],
      recentSales: [],
      stats: {
        volume24h: 0,
        volumeChange: 0,
        averagePrice: 0,
        priceChange: 0,
        topCategory: 'N/A',
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * Récupère les produits en tendance
 */
export async function getHotProducts({ 
  category, 
  limit = 10 
}: MarketSearchParams = {}): Promise<ProductTrend[]> {
  const supabase = await createClient();
  
  try {
    // Le code suivant est simulé pour l'exemple
    // Dans une implémentation réelle, nous utiliserions Supabase pour requêter les données
    
    // Données simulées
    const mockProducts: ProductTrend[] = [
      {
        id: 'prod-1',
        name: 'Scarlet & Violet 151',
        category: 'Elite Trainer Box',
        imageUrl: '/images/sv151.jpg',
        currentPrice: 89.99,
        previousPrice: 59.99,
        percentageChange: 50.01,
        volumeChange: 243,
        trend: 'up',
        heatScore: 95
      },
      {
        id: 'prod-2',
        name: 'Paradox Rift BB',
        category: 'Booster Bundle',
        imageUrl: '/images/paradox.jpg',
        currentPrice: 24.99,
        previousPrice: 19.99,
        percentageChange: 25,
        volumeChange: 121,
        trend: 'up',
        heatScore: 82
      },
      {
        id: 'prod-3',
        name: 'Paldean Fates',
        category: 'Elite Trainer Box',
        imageUrl: '/images/paldean.jpg',
        currentPrice: 49.99,
        previousPrice: 39.99,
        percentageChange: 25,
        volumeChange: 89,
        trend: 'up',
        heatScore: 78
      }
    ];
    
    // Filtrer par catégorie si fournie
    let filteredProducts = mockProducts;
    if (category) {
      filteredProducts = mockProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Limiter le nombre de résultats
    return filteredProducts.slice(0, limit);
  } catch (error) {
    console.error('Error fetching hot products:', error);
    return [];
  }
}

/**
 * Récupère les opportunités de scalping
 */
export async function getMarketOpportunities({ 
  minProfit = 10,
  limit = 10 
}: MarketSearchParams = {}): Promise<MarketOpportunity[]> {
  const supabase = await createClient();
  
  try {
    // Données simulées
    const mockOpportunities: MarketOpportunity[] = [
      {
        id: 'opp-1',
        productId: 'prod-1',
        productName: 'ETB 151',
        imageUrl: '/images/etb151.jpg',
        retailPrice: 59.99,
        marketPrice: 89.99,
        profit: 30,
        profitPercentage: 50,
        score: 85,
        source: 'Micromania',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'opp-2',
        productId: 'prod-2',
        productName: 'Paradox Rift ETB',
        imageUrl: '/images/paradox-etb.jpg',
        retailPrice: 49.99,
        marketPrice: 69.99,
        profit: 20,
        profitPercentage: 40,
        score: 75,
        source: 'Cultura',
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Filtrer par profit minimum
    const filteredOpportunities = mockOpportunities.filter(
      opp => opp.profitPercentage >= minProfit
    );
    
    // Limiter le nombre de résultats
    return filteredOpportunities.slice(0, limit);
  } catch (error) {
    console.error('Error fetching market opportunities:', error);
    return [];
  }
}

/**
 * Récupère les ventes récentes
 */
export async function getRecentSales({ 
  limit = 10 
}: MarketSearchParams = {}): Promise<MarketSale[]> {
  const supabase = await createClient();
  
  try {
    // Données simulées
    const mockSales: MarketSale[] = [
      {
        id: 'sale-1',
        productId: 'prod-1',
        productName: 'Charizard VSTAR',
        imageUrl: '/images/charizard-vstar.jpg',
        price: 89.99,
        condition: 'Mint',
        platform: 'eBay',
        timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
        trend: 'up'
      },
      {
        id: 'sale-2',
        productId: 'prod-2',
        productName: 'Mew VMAX',
        imageUrl: '/images/mew-vmax.jpg',
        price: 45.99,
        condition: 'Near Mint',
        platform: 'Cardmarket',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        trend: 'down'
      }
    ];
    
    // Limiter le nombre de résultats
    return mockSales.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    return [];
  }
}

/**
 * Récupère les statistiques du marché
 */
export async function getMarketStats(): Promise<MarketStats> {
  const supabase = await createClient();
  
  try {
    // Données simulées
    return {
      volume24h: 127842,
      volumeChange: 12.3,
      averagePrice: 47.25,
      priceChange: 3.8,
      topCategory: 'Elite Trainer Box',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return {
      volume24h: 0,
      volumeChange: 0,
      averagePrice: 0,
      priceChange: 0,
      topCategory: 'N/A',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Récupère l'historique des prix d'un produit
 */
export async function getProductPriceHistory(productId: string): Promise<PriceHistory | null> {
  const supabase = await createClient();
  
  try {
    // Dans une implémentation réelle, nous interrogerions la base de données
    // Données simulées pour l'exemple
    const mockHistory: PriceHistory = {
      productId,
      productName: 'Scarlet & Violet 151 ETB',
      history: [
        { date: '2025-01-01', price: 59.99 },
        { date: '2025-02-01', price: 64.99 },
        { date: '2025-03-01', price: 69.99 },
        { date: '2025-04-01', price: 74.99 },
        { date: '2025-05-01', price: 89.99 }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    return mockHistory;
  } catch (error) {
    console.error('Error fetching price history:', error);
    return null;
  }
}