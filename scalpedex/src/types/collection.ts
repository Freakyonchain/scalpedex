// types/collection.ts

export type Condition = 'FACTORY_SEALED' | 'CUSTOM_SEALED' | 'MINT' | 'NEAR_MINT' | 'PLAYED';

export const CONDITIONS: Record<Condition, string> = {
  FACTORY_SEALED: 'Scellé Usine',
  CUSTOM_SEALED: 'Scellé Custom',
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  PLAYED: 'Joué'
};

// Mettre à jour l'interface Product pour inclure les stats et la catégorie
export interface Product {
  id: string;
  name: string;
  image_url: string;
  msrp?: number;
  category?: {
    id: string;
    name: string;
  };
  product_stats?: {
    avg_price_7d?: number;
    avg_price_24h?: number;
    trend_24h?: number;
  }[];
}

export interface CollectionItem {
  id: string;
  quantity: number;
  condition: Condition;
  purchase_price: number;
  products: Product;
  notes?: string;
  created_at: string;
  updated_at?: string;
  current_value?: number;
  trend?: number;
}