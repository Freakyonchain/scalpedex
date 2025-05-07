// app/api/collection/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Types
interface CollectionItemInput {
  product_id: string;
  purchase_price: number;
  condition: string;
  quantity: number;
  purchase_date: string;
  purchase_location?: string;
  notes?: string;
}

// Validation des données
function validateInput(data: CollectionItemInput): string | null {
  if (!data.product_id) return 'Product ID is required';
  if (!data.purchase_price || data.purchase_price < 0) return 'Valid purchase price is required';
  if (!data.condition) return 'Condition is required';
  if (!data.quantity || data.quantity < 1) return 'Valid quantity is required';
  if (!data.purchase_date) return 'Purchase date is required';
  return null;
}

export async function POST(req: Request) {
  try {
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

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const input: CollectionItemInput = await req.json();

    // Valider les données
    const validationError = validateInput(input);
    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    // Vérifier si l'item existe déjà
    const { data: existingItem } = await supabase
      .from('user_collection')
      .select('id, quantity')
      .eq('user_id', session.user.id)
      .eq('product_id', input.product_id)
      .eq('condition', input.condition)
      .eq('purchase_price', input.purchase_price)
      .single();

    if (existingItem) {
      // Mettre à jour la quantité si l'item existe déjà
      const { data, error } = await supabase
        .from('user_collection')
        .update({ quantity: existingItem.quantity + input.quantity })
        .eq('id', existingItem.id)
        .select('id')
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return NextResponse.json(data);
    }

    // Insérer un nouvel item
    const { data, error } = await supabase
      .from('user_collection')
      .insert([
        {
          user_id: session.user.id,
          ...input
        }
      ])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Erreur route:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de l\'ajout à la collection' },
      { status: 500 }
    );
  }
}