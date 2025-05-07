// src/shared/client/supabase.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/shared/types/database.types'

/**
 * Crée une instance Supabase pour le navigateur.
 * À utiliser uniquement dans les composants client.
 */
export const createClientBrowser = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
