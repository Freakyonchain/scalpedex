// /src/features/news/hooks/useDropCalendar.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDropCalendar, getGuides } from '@/app/actions/news-actions';
import { Drop, Guide } from '@/types/news.types';

export function useDropCalendar() {
  const [upcomingDrops, setUpcomingDrops] = useState<Drop[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le calendrier des drops
  const loadDrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { upcoming } = await getDropCalendar();
      setUpcomingDrops(upcoming);
    } catch (err) {
      setError('Erreur lors du chargement du calendrier');
      console.error('Drop calendar load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les guides
  const loadGuides = useCallback(async () => {
    setGuidesLoading(true);
    
    try {
      const { guides } = await getGuides();
      setGuides(guides);
    } catch (err) {
      console.error('Guides load error:', err);
    } finally {
      setGuidesLoading(false);
    }
  }, []);

  // Charger les données au chargement
  useEffect(() => {
    loadDrops();
    loadGuides();
  }, [loadDrops, loadGuides]);

  // Calculer les jours restants jusqu'à un drop
  const getDaysRemaining = useCallback((dropDate: string): number => {
    const now = new Date();
    const drop = new Date(dropDate);
    const diffTime = drop.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  return {
    upcomingDrops,
    guides,
    loading,
    guidesLoading,
    error,
    getDaysRemaining,
    refresh: () => {
      loadDrops();
      loadGuides();
    }
  };
}