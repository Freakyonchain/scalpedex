// /src/shared/server/supabase.ts
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
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Gérer les erreurs liées aux cookies en mode lecture seule
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Gérer les erreurs liées aux cookies en mode lecture seule
          }
        },
      },
    }
  );
}

export async function getUserSession() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
      return { user: null };
    }
    
    return { user: data.session?.user || null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { user: null };
  }
}