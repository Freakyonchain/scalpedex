export interface ScanResult {
    barcode: string;
    timestamp: number;
  }
  
  export interface Product {
    id: string;
    name: string;
    barcode: string;
    category?: string;
    msrp?: number;
    marketPrice?: number;
    imageUrl?: string;
  }
  
  export interface ScalpingScore {
    score: number;
    profit: number;
    profitPercentage: number;
    recommendation: string;
  }
  
  export type ScanStatus = 'idle' | 'scanning' | 'detected' | 'error';
  export type ProductView = 'scalping' | 'collection' | null;
  
  export interface QuickAddData {
    productId: string;
    purchasePrice: number;
    condition: string;
    quantity: number;
  }