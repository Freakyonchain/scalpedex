// /src/features/news/hooks/useNews.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getNews, 
  getBreakingNews,
  getNewsById 
} from '@/app/actions/news-actions';
import { NewsItem, NewsFilter, NewsResponse } from '@/types/news.types';

export function useNews(initialFilter: NewsFilter = {}) {
  const [newsData, setNewsData] = useState<NewsResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 10
  });
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [breakingLoading, setBreakingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NewsFilter>(initialFilter);

  // Charger les actualités
  const loadNews = useCallback(async (newsFilter: NewsFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getNews(newsFilter);
      setNewsData(data);
    } catch (err) {
      setError('Erreur lors du chargement des actualités');
      console.error('News load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les actualités "breaking"
  const loadBreakingNews = useCallback(async () => {
    setBreakingLoading(true);
    
    try {
      const breakingData = await getBreakingNews();
      setBreakingNews(breakingData);
    } catch (err) {
      console.error('Breaking news load error:', err);
    } finally {
      setBreakingLoading(false);
    }
  }, []);

  // Charger une news spécifique
  const loadNewsById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const newsItem = await getNewsById(id);
      setSelectedNews(newsItem);
      return newsItem;
    } catch (err) {
      setError('Erreur lors du chargement de l\'actualité');
      console.error('News detail load error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour les filtres
  const updateFilter = useCallback((newFilter: Partial<NewsFilter>) => {
    setFilter(prev => {
      const updated = { ...prev, ...newFilter };
      
      // Si on change autre chose que la page, on revient à la première page
      if (newFilter.page === undefined) {
        updated.page = 1;
      }
      
      return updated;
    });
  }, []);

  // Charger les actualités au chargement et quand les filtres changent
  useEffect(() => {
    loadNews(filter);
  }, [loadNews, filter]);

  // Charger les actualités "breaking" au chargement
  useEffect(() => {
    loadBreakingNews();
  }, [loadBreakingNews]);

  return {
    news: newsData.items,
    total: newsData.total,
    page: newsData.page,
    limit: newsData.limit,
    breakingNews,
    selectedNews,
    loading,
    breakingLoading,
    error,
    filter,
    updateFilter,
    loadNewsById,
    refresh: () => {
      loadNews(filter);
      loadBreakingNews();
    }
  };
}