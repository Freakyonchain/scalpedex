'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// Définition des interfaces et schémas
interface CollectionFilters {
  search?: string;
  condition?: string;
  page?: number;
  limit?: number;
}

const AddItemSchema = z.object({
  barcode: z.string().min(1, "Le code-barres est requis"),
  product_id: z.string().min(1, "L'ID du produit est requis"),
  condition: z.enum(['FACTORY_SEALED', 'CUSTOM_SEALED', 'MINT', 'NEAR_MINT', 'PLAYED'])
    .optional()
    .default('FACTORY_SEALED'),
  purchase_price: z.number().positive("Le prix doit être positif"),
  purchase_date: z.date().optional().default(() => new Date()),
  quantity: z.number().int().positive().optional().default(1),
  notes: z.string().optional()
})

// Fonction utilitaire pour gérer les erreurs
function handleSupabaseError(error: any) {
  console.error('Erreur Supabase:', error)
  return {
    success: false,
    message: error instanceof Error ? error.message : 'Erreur inconnue'
  }
}

export async function getCollectionStats() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      throw new Error('Impossible d\'initialiser le client Supabase')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error(`Échec de l'authentification: ${authError?.message || 'Aucun utilisateur'}`)
    }

    const { data, error } = await supabase
      .from('user_collection')
      .select(`
        *,
        products:product_id (
          product_stats (
            avg_price_7d
          )
        )
      `)
      .eq('user_id', user.id)
      .is('sold_date', null)

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message || 'Erreur inconnue'}`)
    }

    const stats = data.reduce((acc, item) => {
      const currentValue = item.products?.product_stats?.[0]?.avg_price_7d || item.purchase_price;
      const price = typeof currentValue === 'string' 
        ? parseFloat(currentValue) 
        : currentValue;
        
      return {
        totalValue: acc.totalValue + (isNaN(price) ? 0 : price) * (item.quantity || 1),
        totalItems: acc.totalItems + (item.quantity || 1),
        sealedCount: acc.sealedCount + (
          (item.condition === 'FACTORY_SEALED' || item.condition === 'CUSTOM_SEALED') 
            ? (item.quantity || 1) 
            : 0
        )
      };
    }, {
      totalValue: 0,
      totalItems: 0,
      sealedCount: 0
    });

    return stats;

  } catch (error) {
    console.error('Erreur dans getCollectionStats:', error)
    return {
      totalValue: 0,
      totalItems: 0,
      sealedCount: 0
    }
  }
}

export async function getCollectionItems({
  search = '',
  condition = '',
  page = 1,
  limit = 12
}: CollectionFilters = {}) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      throw new Error('Impossible d\'initialiser le client Supabase')
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error(`Échec de l'authentification: ${authError?.message || 'Aucun utilisateur'}`)
    }

    // Construction de la requête de base avec les bonnes relations
    let query = supabase
      .from('user_collection')
      .select(`
        *,
        products:product_id (
          id,
          name,
          image_url,
          msrp,
          barcode,
          release_date,
          category:category_id (
            id,
            name
          ),
          product_stats!inner (
            avg_price_7d,
            avg_price_24h,
            trend_24h
          )
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .is('sold_date', null)

    // Filtres conditions
    if (condition) {
      const conditions = condition.split(',')
      query = query.in('condition', conditions)
    }

    // Recherche textuelle
    if (search && search.trim()) {
      query = query.textSearch('products.name', search.trim(), {
        type: 'websearch',
        config: 'english'
      })
    }

    // Exécution de la requête avec pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message || 'Erreur inconnue'}`)
    }

    // Transformation des données pour le frontend
    const items = data?.map(item => ({
      ...item,
      product: {
        ...item.products,
        category_name: item.products?.category?.name || 'Non catégorisé',
        current_value: item.products?.product_stats?.[0]?.avg_price_7d || item.products?.msrp || 0,
        trend: item.products?.product_stats?.[0]?.trend_24h || 0
      }
    })) || [];

    return { 
      items,
      total: count || 0,
      page,
      limit,
      status: 'success'
    }

  } catch (error) {
    console.error('Erreur dans getCollectionItems:', error)
    return { 
      items: [], 
      total: 0, 
      page, 
      limit,
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}

export async function addItem(rawData: unknown) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const validatedData = AddItemSchema.parse(rawData)

    // Vérification que le produit existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', validatedData.product_id)
      .single()

    if (productError || !product) {
      throw new Error("Produit invalide")
    }

    // Recherche d'un item existant
    const { data: existingItem, error: existingItemError } = await supabase
      .from('user_collection')
      .select('*')
      .eq('product_id', validatedData.product_id)
      .eq('user_id', user.id)
      .eq('condition', validatedData.condition)
      .is('sold_date', null)
      .single()

    if (existingItemError && existingItemError.code !== 'PGRST116') {
      throw existingItemError
    }

    let result;
    if (existingItem) {
      // Mise à jour de l'item existant
      const { data: updatedItem, error: updateError } = await supabase
        .from('user_collection')
        .update({ 
          quantity: existingItem.quantity + (validatedData.quantity || 1)
        })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (updateError) throw updateError

      result = { 
        success: true, 
        message: 'Item mis à jour', 
        item: updatedItem 
      }
    } else {
      // Création d'un nouvel item
      const { data: newItem, error: insertError } = await supabase
        .from('user_collection')
        .insert({
          user_id: user.id,
          product_id: validatedData.product_id,
          condition: validatedData.condition,
          purchase_price: validatedData.purchase_price,
          purchase_date: validatedData.purchase_date,
          quantity: validatedData.quantity,
          notes: validatedData.notes
        })
        .select()
        .single()

      if (insertError) throw insertError

      result = { 
        success: true, 
        message: 'Item ajouté avec succès', 
        item: newItem 
      }
    }

    revalidatePath('/collection')
    return result

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Erreur de validation', 
        errors: error.errors 
      }
    }

    return handleSupabaseError(error)
  }
}

export async function deleteItem(itemId: string) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { error } = await supabase
      .from('user_collection')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/collection')

    return { 
      success: true, 
      message: 'Item supprimé avec succès' 
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}