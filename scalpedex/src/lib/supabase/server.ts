// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? '';
        },
        set(name: string, value: string, options: unknown) {
          try {
            cookieStore.set({ name, value, ...(options as Record<string, unknown>) });
          } catch {
            // Handle errors silently in server components
          }
        },
        remove(name: string, options: unknown) {
          try {
            cookieStore.delete({ name, ...(options as Record<string, unknown>) });
          } catch {
            // Handle errors silently in server components
          }
        },
      },
    }
  );
}

export async function getUserSession() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error.message);
      return { user: null };
    }
    
    return { user: data.user };
  } catch (error) {
    console.error('Error getting user session:', error);
    return { user: null };
  }
}