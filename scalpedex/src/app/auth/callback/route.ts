// /src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const supabase = await createClient();

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(`${requestUrl.origin}/collection`);
    } catch (error) {
      console.error('Erreur lors de l\'échange du code:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=auth_callback_error`);
    }
  }

  // Si pas de code, redirection vers la page de connexion
  return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in`);
}