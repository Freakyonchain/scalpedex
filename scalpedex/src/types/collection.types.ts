// /src/features/collection/types/collection.types.ts

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
  imageUrl?: string;
  category?: string;
  msrp?: number;
  barcode?: string;
}

export interface CollectionItem {
  id: string;
  product: Product;
  quantity: number;
  condition: Condition;
  purchasePrice: number;
  purchaseDate?: string;
  notes?: string;
  createdAt?: string;
  soldPrice?: number;
  soldDate?: string;
}

export interface CollectionStats {
  totalValue: number;
  totalItems: number;
  sealedCount: number;
  bestRoi?: {
    itemId: string;
    productName: string;
    percentage: number;
  };
}

export interface CollectionFiltersState {
  search: string;
  condition: Condition | '';
  sortBy: 'date' | 'price' | 'name';
  sortOrder: 'asc' | 'desc';
  page: number;
}

export interface CollectionQueryParams {
  search?: string;
  condition?: string;
  page?: number;
  limit?: number;
}

export interface CollectionResponse {
  items: CollectionItem[];
  total: number;
  page: number;
  limit: number;
  status: 'success' | 'error';
  error?: string;
}