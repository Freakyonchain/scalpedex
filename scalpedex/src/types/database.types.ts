// types/database.types.ts
export type Database = {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string
            email: string
            username: string | null
            created_at: string
          }
        }
        products: {
          Row: {
            id: string
            name: string
            barcode: string | null
            category: string
            msrp: number | null
            image_url: string | null
            is_active: boolean
            created_at: string
          }
          Insert: {
            id?: string
            name: string
            barcode?: string | null
            category?: string
            msrp?: number | null
            image_url?: string | null
            is_active?: boolean
            created_at?: string
          }
        }
        user_collection: {
          Row: {
            id: string
            user_id: string
            product_id: string
            condition: string
            purchase_price: number
            quantity: number
            purchase_date: string
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            product_id: string
            condition: string
            purchase_price: number
            quantity: number
            purchase_date: string
            created_at?: string
          }
        }
      }
    }
  }