import { createBrowserClient } from '@supabase/ssr'

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
        }
    }
}

export function createClientBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Identifiants Supabase manquants')
  }

  return createBrowserClient<Database>(url, key)
}