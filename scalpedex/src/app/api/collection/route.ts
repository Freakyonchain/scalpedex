// app/api/collection/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Créer le client serveur Supabase avec les cookies
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Récupérer la session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.log('No session found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      product_id,
      purchase_price,
      condition,
      quantity,
      purchase_date,
    } = await req.json();

    const { data, error } = await supabase
      .from('user_collection')
      .insert([
        {
          user_id: session.user.id,
          product_id,
          condition,
          purchase_price,
          quantity,
          purchase_date,
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Route error:', error);
    return NextResponse.json(
      { message: error.message || 'Error adding to collection' },
      { status: 500 }
    );
  }
}