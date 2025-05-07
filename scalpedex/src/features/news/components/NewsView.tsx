// /src/features/news/components/NewsView.tsx
import React from 'react';
import { Suspense } from 'react';
import { 
  getNews, 
  getBreakingNews, 
  getDropCalendar, 
  getGuides 
} from '../server-actions/news-actions';
import { BreakingAlert } from './BreakingAlert';
import { NewsList } from './NewsList';
import { DropCalendar } from './DropCalendar';
import { GuidesList } from './GuidesList';
import { formatTimeAgo } from '../utils/news-formatters';

function NewsLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-32 bg-gradient-to-r from-orange-900/20 via-red-900/20 to-red-900/20 rounded-xl" />
      <div className="h-64 bg-violet-900/20 rounded-xl" />
      <div className="h-64 bg-violet-900/20 rounded-xl" />
      <div className="h-32 bg-violet-900/20 rounded-xl" />
    </div>
  );
}

// Helper pour calculer les jours restants
function getDaysRemaining(dropDate: string): number {
  const now = new Date();
  const drop = new Date(dropDate);
  const diffTime = drop.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default async function NewsView() {
  // Récupérer les données côté serveur pour SSR
  const [breakingNews, newsData, dropCalendar, guidesData] = await Promise.all([
    getBreakingNews(),
    getNews({ limit: 5 }),
    getDropCalendar(),
    getGuides()
  ]);

  return (
    <div className="space-y-6">
      <Suspense fallback={<NewsLoading />}>
        {/* Breaking Alert */}
        {breakingNews.length > 0 && (
          <BreakingAlert news={breakingNews[0]} />
        )}

        {/* Prochaines Sorties */}
        <DropCalendar 
          drops={dropCalendar.upcoming} 
          getDaysRemaining={getDaysRemaining}
        />

        {/* Guides & Tips */}
        <GuidesList guides={guidesData.guides} />

        {/* News Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">📰 Dernières News</h2>
          <NewsList items={newsData.items} />
        </div>
      </Suspense>
    </div>
  );
}