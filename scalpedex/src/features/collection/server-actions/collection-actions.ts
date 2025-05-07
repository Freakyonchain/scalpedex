// /src/features/collection/server-actions/collection-actions.ts
'use server';

import { createClient } from '@/shared/server/supabase';
import { 
  CollectionItem, 
  CollectionStats, 
  CollectionQueryParams,
  CollectionResponse 
} from '../types/collection-types';
import { revalidatePath } from 'next/cache';

/**
 * Récupère les statistiques de la collection
 */
export async function getCollectionStats(): Promise<CollectionStats> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error(`Échec de l'authentification: ${authError?.message || 'Aucun utilisateur'}`);
    }

    // Récupérer les données de la collection
    const { data, error } = await supabase
      .from('user_collection')
      .select('purchase_price, condition, quantity, sold_price')
      .eq('user_id', user.id)
      .is('sold_date', null); // Ne compter que les items non vendus

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message || 'Erreur inconnue'}`);
    }

    const stats: CollectionStats = {
      totalValue: data.reduce((sum, item) => {
        const price = typeof item.purchase_price === 'string' 
          ? parseFloat(item.purchase_price) 
          : item.purchase_price;
        return sum + (isNaN(price) ? 0 : price) * (item.quantity || 1);
      }, 0),
      totalItems: data.reduce((sum, item) => sum + (item.quantity || 1), 0),
      sealedCount: data.reduce((sum, item) => {
        if (item.condition === 'FACTORY_SEALED' || item.condition === 'CUSTOM_SEALED') {
          return sum + (item.quantity || 1);
        }
        return sum;
      }, 0)
    };

    // Tentative de récupération du meilleur ROI
    try {
      const { data: soldItems } = await supabase
        .from('user_collection')
        .select(`
          id, 
          purchase_price, 
          sold_price,
          products (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .not('sold_price', 'is', null)
        .not('sold_date', 'is', null)
        .order('sold_price', { ascending: false });

      if (soldItems && soldItems.length > 0) {
        let bestRoi = {
          itemId: '',
          productName: '',
          percentage: 0
        };

        soldItems.forEach(item => {
          const purchasePrice = parseFloat(item.purchase_price.toString());
          const soldPrice = parseFloat(item.sold_price.toString());
          
          if (!isNaN(purchasePrice) && !isNaN(soldPrice) && purchasePrice > 0) {
            const roi = ((soldPrice - purchasePrice) / purchasePrice) * 100;
            
            if (roi > bestRoi.percentage) {
              bestRoi = {
                itemId: item.id,
                productName: item.products?.name || 'Produit inconnu',
                percentage: roi
              };
            }
          }
        });

        if (bestRoi.itemId) {
          stats.bestRoi = bestRoi;
        }
      }
    } catch (roiError) {
      console.error('Erreur lors du calcul du meilleur ROI:', roiError);
      // On continue sans le meilleur ROI
    }

    return stats;
  } catch (error) {
    console.error('Erreur dans getCollectionStats:', error);
    // Retourner des stats par défaut en cas d'erreur
    return {
      totalValue: 0,
      totalItems: 0,
      sealedCount: 0
    };
  }
}

/**
 * Récupère les items de la collection avec filtres
 */
export async function getCollectionItems({
  search = '',
  condition = '',
  page = 1,
  limit = 12
}: CollectionQueryParams = {}): Promise<CollectionResponse> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error(`Échec de l'authentification: ${authError?.message || 'Aucun utilisateur'}`);
    }

    // Construction de la requête de base
    let query = supabase
      .from('user_collection')
      .select(`
        id,
        quantity,
        condition,
        purchase_price,
        purchase_date,
        created_at,
        products (
          id,
          name,
          image_url,
          category
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .is('sold_date', null);

    // Filtres conditions
    if (condition) {
      const conditions = condition.split(',');
      query = query.in('condition', conditions);
    }

    // Recherche textuelle
    if (search && search.trim()) {
      // Utilisation de ilike pour une recherche insensible à la casse
      query = query.ilike('products.name', `%${search.trim()}%`);
    }

    // Exécution de la requête avec pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message || 'Erreur inconnue'}`);
    }

    // Transformer les données pour correspondre à notre modèle
    const items: CollectionItem[] = data.map(item => ({
      id: item.id,
      product: {
        id: item.products.id,
        name: item.products.name,
        imageUrl: item.products.image_url,
        category: item.products.category
      },
      quantity: item.quantity,
      condition: item.condition as Condition,
      purchasePrice: parseFloat(item.purchase_price.toString()),
      purchaseDate: item.purchase_date,
      createdAt: item.created_at
    }));

    return { 
      items,
      total: count || 0,
      page,
      limit,
      status: 'success'
    };
  } catch (error) {
    console.error('Erreur dans getCollectionItems:', error);
    return { 
      items: [], 
      total: 0, 
      page, 
      limit,
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Ajoute un item à la collection
 */
export async function addCollectionItem(data: {
  productId: string;
  condition: string;
  purchasePrice: number;
  quantity: number;
}): Promise<{ success: boolean; message: string; id?: string }> {
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

/**
 * Supprime un item de la collection
 */
export async function removeCollectionItem(itemId: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour supprimer un item de votre collection'
      };
    }

    // Vérifier que l'item appartient à l'utilisateur
    const { data: item, error: fetchError } = await supabase
      .from('user_collection')
      .select('*')
      .eq('id', itemId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !item) {
      return {
        success: false,
        message: 'Item introuvable ou vous n\'avez pas les droits pour le supprimer'
      };
    }

    // Supprimer l'item
    const { error } = await supabase
      .from('user_collection')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la suppression'
      };
    }

    // Revalider la page de collection
    revalidatePath('/collection');

    return {
      success: true,
      message: 'Item supprimé avec succès'
    };
  } catch (error: any) {
    console.error('Error removing collection item:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue'
    };
  }
}

/**
 * Marque un item comme vendu
 */
export async function markItemAsSold(data: {
  itemId: string;
  soldPrice: number;
  soldDate?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour mettre à jour votre collection'
      };
    }

    // Vérifier que l'item appartient à l'utilisateur
    const { data: item, error: fetchError } = await supabase
      .from('user_collection')
      .select('*')
      .eq('id', data.itemId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !item) {
      return {
        success: false,
        message: 'Item introuvable ou vous n\'avez pas les droits pour le modifier'
      };
    }

    // Mettre à jour l'item
    const { error } = await supabase
      .from('user_collection')
      .update({
        sold_price: data.soldPrice,
        sold_date: data.soldDate || new Date().toISOString()
      })
      .eq('id', data.itemId)
      .eq('user_id', user.id);

    if (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la mise à jour'
      };
    }

    // Revalider la page de collection
    revalidatePath('/collection');

    return {
      success: true,
      message: 'Item marqué comme vendu'
    };
  } catch (error: any) {
    console.error('Error marking item as sold:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue'
    };
  }
}