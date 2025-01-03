// types/collection.ts

export type Condition = 'FACTORY_SEALED' | 'CUSTOM_SEALED' | 'MINT' | 'NEAR_MINT' | 'PLAYED';

export const CONDITIONS: Record<Condition, string> = {
  FACTORY_SEALED: 'Scellé Usine',
  CUSTOM_SEALED: 'Scellé Custom',
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  PLAYED: 'Joué'
};

export interface Product {
  id: string;
  name: string;
  image_url: string;
  category?: string;
}

export interface CollectionItem {
  id: string;
  quantity: number;
  condition: Condition;
  purchase_price: number;
  products: Product;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}