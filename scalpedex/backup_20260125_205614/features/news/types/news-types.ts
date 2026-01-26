// /src/features/news/types/news-types.ts

export type NewsCategory = 'BREAKING' | 'RETAIL' | 'SUCCESS' | 'MARKET' | 'GUIDE';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: NewsCategory;
  imageUrl?: string;
  publishedAt: string;
  source?: string;
  externalUrl?: string;
  tags?: string[];
  isPinned?: boolean;
  isBreaking?: boolean;
}

export interface Drop {
  id: string;
  productName: string;
  productType: string;
  retailPrice: number;
  dropDate: string;
  imageUrl?: string;
  expectedMarketPrice?: number;
  hypeScore: number; // 0-100
  details?: string;
  links?: {
    title: string;
    url: string;
  }[];
}

export interface Guide {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  category: string;
  publishedAt: string;
  readTime: number; // minutes
  authorName?: string;
  authorAvatar?: string;
}

export interface NewsFilter {
  category?: NewsCategory;
  tag?: string;
  limit?: number;
  page?: number;
}

export interface NewsResponse {
  items: NewsItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DropCalendarResponse {
  upcoming: Drop[];
  total: number;
}

export interface GuidesResponse {
  guides: Guide[];
  total: number;
}