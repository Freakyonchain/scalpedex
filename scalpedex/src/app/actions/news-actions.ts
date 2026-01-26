// /src/features/news/server-actions/news-actions.ts
'use server';

import { 
  NewsItem, 
  NewsFilter, 
  NewsResponse,
  Drop,
  DropCalendarResponse,
  Guide,
  GuidesResponse
} from '@/types/news.types';

/**
 * Récupère toutes les actualités avec filtres
 */
export async function getNews({ 
  category, 
  tag, 
  page = 1, 
  limit = 10 
}: NewsFilter = {}): Promise<NewsResponse> {
  try {
    // Mock data - Dans une implémentation réelle, nous requêterions la base de données
    const mockNews: NewsItem[] = [
      {
        id: 'news-1',
        title: 'Restock Micromania imminent ! 🚨',
        excerpt: 'Plusieurs magasins vont recevoir des 151 ce weekend',
        category: 'BREAKING',
        publishedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        isBreaking: true
      },
      {
        id: 'news-2',
        title: 'Leclerc lance sa nouvelle politique TCG 😱',
        excerpt: 'Limitation à 2 produits par référence et par personne...',
        category: 'RETAIL',
        publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: 'news-3',
        title: 'Il scalpe 50 ETB en 10 minutes 🏆',
        excerpt: 'Comment @ScalpMaster a réussi son coup chez Cultura...',
        category: 'SUCCESS',
        publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      }
    ];
    
    // Filtrer par catégorie si fournie
    let filteredNews = mockNews;
    if (category) {
      filteredNews = mockNews.filter(news => news.category === category);
    }
    
    // Filtrer par tag si fourni
    if (tag) {
      filteredNews = filteredNews.filter(news => news.tags?.includes(tag));
    }
    
    // Calculer la pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNews = filteredNews.slice(startIndex, endIndex);
    
    return {
      items: paginatedNews,
      total: filteredNews.length,
      page,
      limit
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      items: [],
      total: 0,
      page,
      limit
    };
  }
}

/**
 * Récupère une news spécifique par ID
 */
export async function getNewsById(id: string): Promise<NewsItem | null> {
  try {
    // Mock data
    const mockNews: NewsItem[] = [
      {
        id: 'news-1',
        title: 'Restock Micromania imminent ! 🚨',
        excerpt: 'Plusieurs magasins vont recevoir des 151 ce weekend',
        content: 'Selon nos sources, Micromania recevra un réapprovisionnement massif de boîtes Pokémon 151 ce weekend. Plusieurs magasins ont confirmé avoir reçu l\'information de leur centrale. Les quantités devraient être limitées à 2 par personne...',
        category: 'BREAKING',
        publishedAt: new Date(Date.now() - 1800000).toISOString(),
        isBreaking: true
      },
      // Autres news...
    ];
    
    const news = mockNews.find(n => n.id === id);
    return news || null;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return null;
  }
}

/**
 * Récupère les actualités "breaking" ou importantes
 */
export async function getBreakingNews(): Promise<NewsItem[]> {
  try {
    const { items } = await getNews({ limit: 3 });
    return items.filter(news => news.isBreaking || news.isPinned);
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    return [];
  }
}

/**
 * Récupère le calendrier des prochains drops
 */
export async function getDropCalendar(): Promise<DropCalendarResponse> {
  try {
    // Mock data
    const mockDrops: Drop[] = [
      {
        id: 'drop-1',
        productName: 'Crown Zenith Elite Trainer Box',
        productType: 'Elite Trainer Box',
        retailPrice: 59.99,
        dropDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        hypeScore: 98,
        expectedMarketPrice: 89.99
      },
      {
        id: 'drop-2',
        productName: 'Scarlet & Violet 151 Booster Box',
        productType: 'Booster Box',
        retailPrice: 119.99,
        dropDate: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
        hypeScore: 85,
        expectedMarketPrice: 149.99
      }
    ];
    
    // Trier par date croissante
    const sortedDrops = mockDrops.sort((a, b) => {
      return new Date(a.dropDate).getTime() - new Date(b.dropDate).getTime();
    });
    
    return {
      upcoming: sortedDrops,
      total: sortedDrops.length
    };
  } catch (error) {
    console.error('Error fetching drop calendar:', error);
    return {
      upcoming: [],
      total: 0
    };
  }
}

/**
 * Récupère les guides disponibles
 */
export async function getGuides(): Promise<GuidesResponse> {
  try {
    // Mock data
    const mockGuides: Guide[] = [
      {
        id: 'guide-1',
        title: 'Guide des Précommandes',
        excerpt: 'Les meilleurs sites et techniques pour préco au MSRP',
        category: 'PREORDER',
        publishedAt: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
        readTime: 8,
        authorName: 'MasterScalper',
        authorAvatar: '/images/avatars/master-scalper.jpg',
        imageUrl: '/images/guides/preorder.jpg'
      },
      {
        id: 'guide-2',
        title: 'Comment identifier les boîtes à fort potentiel',
        excerpt: 'Analyse des facteurs qui font grimper les prix après le lancement',
        category: 'MARKET',
        publishedAt: new Date(Date.now() - 2592000000).toISOString(), // 1 month ago
        readTime: 12,
        authorName: 'ScalpPro',
        authorAvatar: '/images/avatars/scalp-pro.jpg',
        imageUrl: '/images/guides/identify-potential.jpg'
      }
    ];
    
    return {
      guides: mockGuides,
      total: mockGuides.length
    };
  } catch (error) {
    console.error('Error fetching guides:', error);
    return {
      guides: [],
      total: 0
    };
  }
}