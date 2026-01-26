// /src/app/news/[id]/page.tsx
import React from 'react';
import { Suspense } from 'react';
import { getNewsById } from '@/app/actions/news-actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/utils/news-formatters';
import { notFound } from 'next/navigation';

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface NewsDetailPageProps {
  params: { id: string };
}

function NewsDetailLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-3/4 bg-violet-900/20 rounded-xl" />
      <div className="h-4 w-1/3 bg-violet-900/20 rounded-xl" />
      <div className="h-64 bg-violet-900/20 rounded-xl" />
    </div>
  );
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const newsItem = await getNewsById(params.id);
  
  if (!newsItem) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-b from-violet-950 to-black">
      <Link 
        href="/news" 
        className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" /> Retour aux actualités
      </Link>
      
      <Suspense fallback={<NewsDetailLoading />}>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">{newsItem.title}</h1>
            
            <div className="flex items-center text-violet-400 text-sm">
              <span>Publié {formatTimeAgo(newsItem.publishedAt)}</span>
              {newsItem.source && (
                <span className="ml-2 pl-2 border-l border-violet-700">
                  Source: {newsItem.source}
                </span>
              )}
            </div>
            
            {newsItem.imageUrl && (
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={newsItem.imageUrl} 
                  alt={newsItem.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-6">
              {newsItem.content ? (
                <div className="prose prose-violet prose-invert max-w-none">
                  <p className="text-lg text-violet-100 leading-relaxed">
                    {newsItem.excerpt}
                  </p>
                  <div className="mt-4 text-violet-200 leading-relaxed">
                    {newsItem.content}
                  </div>
                </div>
              ) : (
                <p className="text-lg text-violet-100 leading-relaxed">
                  {newsItem.excerpt}
                </p>
              )}
              
              {newsItem.externalUrl && (
                <div className="mt-6">
                  <a 
                    href={newsItem.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Lire l'article complet
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}