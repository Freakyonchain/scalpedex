// /src/shared/server/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const createMiddleware = () => {
  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    
    // Définir les routes qui nécessitent une authentification
    const protectedRoutes = [
      '/collection',
      '/scan',
      '/market',
      '/profile',
      '/settings',
    ];
    
    // Définir les routes accessibles uniquement aux utilisateurs non authentifiés
    const authRoutes = [
      '/auth/sign-in',
      '/auth/sign-up',
      '/auth/forgot-password',
    ];
    
    // Si la route est publique, continuer sans vérification
    if (!protectedRoutes.some(route => pathname.startsWith(route)) && 
        !authRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }
    
    // Créer le client Supabase pour vérifier la session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
        },
      }
    );
    
    // Récupérer la session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = !!session;
    
    // Rediriger les utilisateurs authentifiés loin des routes d'authentification
    if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/collection', request.url));
    }
    
    // Rediriger les utilisateurs non authentifiés vers la connexion
    if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    
    // Continuer pour les autres routes
    return NextResponse.next();
  }
};