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
  item_type_id: z.string().min(1, "L'ID du type d'item est requis"),
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

    // Utilisation de la bonne table 'user_collection'
    const { data, error } = await supabase
      .from('user_collection')
      .select('purchase_price, condition, quantity')
      .eq('user_id', user.id)
      .is('sold_date', null) // Ne compter que les items non vendus

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message || 'Erreur inconnue'}`)
    }

    const stats = {
      totalValue: data.reduce((sum, item) => {
        const price = typeof item.purchase_price === 'string' 
          ? parseFloat(item.purchase_price) 
          : item.purchase_price
        return sum + (isNaN(price) ? 0 : price) * (item.quantity || 1)
      }, 0),
      totalItems: data.reduce((sum, item) => sum + (item.quantity || 1), 0),
      sealedCount: data.reduce((sum, item) => {
        if (item.condition === 'FACTORY_SEALED' || item.condition === 'CUSTOM_SEALED') {
          return sum + (item.quantity || 1)
        }
        return sum
      }, 0)
    }

    return stats

  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur dans getCollectionStats:', error.message)
    } else {
      console.error('Erreur inconnue dans getCollectionStats')
    }
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

    // Construction de la requête avec les bonnes tables
    let query = supabase
      .from('user_collection')
      .select(`
        *,
        products (
          name,
          image_url,
          category
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .is('sold_date', null) // Ne montrer que les items non vendus

    // Filtres
    if (condition) {
      const conditions = condition.split(',')
      query = query.in('condition', conditions)
    }

    if (search) {
      query = query.or(`products.name.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message || 'Erreur inconnue'}`)
    }

    return { 
      items: data || [],
      total: count || 0,
      page,
      limit,
      status: 'success'
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur dans getCollectionItems:', error.message)
    } else {
      console.error('Erreur inconnue dans getCollectionItems')
    }
    
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
    const supabase = createClient()
    
    // Récupération de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    // Validation des données
    const validatedData = AddItemSchema.parse(rawData)

    // Vérification du type d'item
    const { data: itemType, error: itemTypeError } = await supabase
      .from('item_types')
      .select('*')
      .eq('id', validatedData.item_type_id)
      .single()

    if (itemTypeError || !itemType) {
      throw new Error("Type d'item invalide")
    }

    // Recherche d'un item existant
    const { data: existingItem, error: existingItemError } = await supabase
      .from('items')
      .select('*')
      .eq('barcode', validatedData.barcode)
      .eq('user_id', user.id)
      .single()

    if (existingItemError && existingItemError.code !== 'PGRST116') {
      throw existingItemError
    }

    let result;
    if (existingItem) {
      // Mise à jour de l'item existant
      const { data: updatedItem, error: updateError } = await supabase
        .from('items')
        .update({ 
          quantity: existingItem.quantity + (validatedData.quantity || 1),
          purchase_price: validatedData.purchase_price
        })
        .eq('id', existingItem.id)
        .eq('user_id', user.id)
        .select('*, item_types(name)')
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
        .from('items')
        .insert({
          ...validatedData,
          user_id: user.id
        })
        .select('*, item_types(name)')
        .single()

      if (insertError) throw insertError

      result = { 
        success: true, 
        message: 'Item ajouté avec succès', 
        item: newItem 
      }
    }

    // Invalider le cache pour mettre à jour l'affichage
    revalidatePath('/collection')

    return result

  } catch (error) {
    // Gestion des erreurs de validation
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Erreur de validation', 
        errors: error.errors 
      }
    }

    // Gestion des autres erreurs
    return handleSupabaseError(error)
  }
}

export async function deleteItem(itemId: string) {
  try {
    const supabase = createClient()
    
    // Récupération de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    // Suppression de l'item
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (error) throw error

    // Invalider le cache
    revalidatePath('/collection')

    return { 
      success: true, 
      message: 'Item supprimé avec succès' 
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}