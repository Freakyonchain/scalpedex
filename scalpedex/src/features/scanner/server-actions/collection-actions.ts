'use server';

import { createClient } from '@server/supabase'
import { QuickAddData } from '../types/scanner-types';
import { revalidatePath } from 'next/cache';

export async function addToCollection(data: QuickAddData): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour ajouter à votre collection'
      };
    }

    // Ajouter à la collection
    const { data: collectionData, error } = await supabase
      .from('user_collection')
      .insert([{
        user_id: user.id,
        product_id: data.productId,
        condition: data.condition,
        purchase_price: data.purchasePrice,
        quantity: data.quantity,
        purchase_date: new Date().toISOString(),
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Error adding to collection:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'ajout à la collection'
      };
    }

    // Revalider la page de collection pour qu'elle affiche les nouveaux items
    revalidatePath('/collection');

    return {
      success: true,
      message: 'Produit ajouté à votre collection',
      id: collectionData.id
    };
  } catch (error: any) {
    console.error('Error adding to collection:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue'
    };
  }
}