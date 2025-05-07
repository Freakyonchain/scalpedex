// /src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/server/supabase';

// Définir les routes qui nécessitent une authentification
const protectedRoutes = [
  '/collection',
  '/scan',
  '/market',
  '/profile',
];

// Définir les routes accessibles uniquement aux utilisateurs non authentifiés
const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Créer le client Supabase pour vérifier la session
  const supabase = createClient();
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

export const config = {
  matcher: [
    // Routes à protéger
    '/collection/:path*',
    '/scan/:path*',
    '/market/:path*',
    '/profile/:path*',
    // Routes d'authentification
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/forgot-password',
  ],
};