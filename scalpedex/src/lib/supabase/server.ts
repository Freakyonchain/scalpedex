import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: any) {
          try {
            // Le set doit être await aussi
            await cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Gérer les erreurs potentielles
            console.error('Erreur lors de la définition du cookie:', error)
          }
        },
        async remove(name: string, options: any) {
          try {
            // Le set pour la suppression doit être await
            await cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Gérer les erreurs potentielles
            console.error('Erreur lors de la suppression du cookie:', error)
          }
        },
      },
    }
  )
}