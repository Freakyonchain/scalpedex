// src/shared/server/supabase.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../types/database.types';

export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Ne pas utiliser cookieStore.get directement
          // Utiliser une approche compatible avec Next.js 15
          return cookieStore.get(name)?.value ?? '';
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Gérer les erreurs
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete({ name, ...options });
          } catch (error) {
            // Gérer les erreurs
          }
        },
      },
    }
  );
}

// Fonction modifiée pour utiliser getUser au lieu de getSession
export async function getUserSession() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error.message);
      return { user: null };
    }
    
    // Retourner directement l'utilisateur
    return { user: data.user };
  } catch (error) {
    console.error('Error getting user session:', error);
    return { user: null };
  }
}