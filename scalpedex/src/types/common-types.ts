// /src/shared/types/common-types.ts

export type SortOrder = 'asc' | 'desc';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type Theme = 'dark' | 'light' | 'system';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'CAD';

export type Language = 'fr' | 'en' | 'es' | 'de';

export type Condition = 'FACTORY_SEALED' | 'CUSTOM_SEALED' | 'MINT' | 'NEAR_MINT' | 'PLAYED';

export type ConditionLabel = {
  [key in Condition]: string;
};

export const CONDITIONS: ConditionLabel = {
  FACTORY_SEALED: 'Scellé Usine',
  CUSTOM_SEALED: 'Scellé Custom',
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  PLAYED: 'Joué'
};

export interface SelectOption {
  value: string;
  label: string;
}