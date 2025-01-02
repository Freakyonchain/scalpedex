// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          barcode: string | null;
          category: 'card' | string;
          msrp: number | null;
          release_date: string | null;
          contents: Json | null;
          image_url: string | null;
          is_active: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          barcode?: string | null;
          category?: string;
          msrp?: number | null;
          release_date?: string | null;
          contents?: Json | null;
          image_url?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          barcode?: string | null;
          category?: string;
          msrp?: number | null;
          release_date?: string | null;
          contents?: Json | null;
          image_url?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
        };
      };
      user_collection: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          condition: string;
          purchase_price: number;
          purchase_date: string;
          purchase_location: string | null;
          quantity: number;
          sold_price: number | null;
          sold_date: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          condition: string;
          purchase_price: number;
          purchase_date: string;
          purchase_location?: string | null;
          quantity: number;
          sold_price?: number | null;
          sold_date?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          condition?: string;
          purchase_price?: number;
          purchase_date?: string;
          purchase_location?: string | null;
          quantity?: number;
          sold_price?: number | null;
          sold_date?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
}