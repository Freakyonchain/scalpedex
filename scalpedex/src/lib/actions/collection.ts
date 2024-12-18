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
    const supabase = createClient()
    
    // Récupération de l'authentification de manière robuste
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    // Gestion explicite des scénarios d'authentification
    if (authError || !authData.user) {
      console.warn('Authentification incomplète:', { 
        error: authError, 
        userExists: !!authData.user 
      })
      
      return {
        totalValue: 0,
        totalItems: 0,
        sealedCount: 0,
        status: 'unauthenticated'
      }
    }

    // Récupération des items de l'utilisateur avec sélection optimisée
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('purchase_price, quantity, condition')
      .eq('user_id', authData.user.id)

    // Gestion des erreurs de récupération des items
    if (itemsError) {
      return {
        totalValue: 0,
        totalItems: 0,
        sealedCount: 0,
        status: 'error'
      }
    }

    // Calcul sécurisé des statistiques
    const stats = {
      totalValue: items.reduce((sum, item) => 
        sum + (Number(item.purchase_price) * Number(item.quantity)), 0),
      totalItems: items.reduce((sum, item) => 
        sum + Number(item.quantity), 0),
      sealedCount: items.reduce((count, item) => 
        (['FACTORY_SEALED', 'CUSTOM_SEALED'].includes(item.condition)) 
          ? count + Number(item.quantity) 
          : count, 0),
      status: 'success'
    }

    return stats

  } catch (error) {
    // Capture des erreurs inattendues
    console.error('Erreur inattendue lors du chargement des statistiques:', error)
    return {
      totalValue: 0,
      totalItems: 0,
      sealedCount: 0,
      status: 'error'
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
    const supabase = createClient()
    
    // Récupération de l'authentification de manière robuste
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    // Gestion explicite des scénarios d'authentification
    if (authError || !authData.user) {
      console.warn('Authentification incomplète:', { 
        error: authError, 
        userExists: !!authData.user 
      })
      
      return { 
        items: [], 
        total: 0, 
        page, 
        limit,
        status: 'unauthenticated' 
      }
    }

    // Construction de la requête avec filtres dynamiques
    let query = supabase
      .from('items')
      .select('*, item_types(name)', { count: 'exact' })
      .eq('user_id', authData.user.id)

    // Application des filtres conditionnels
    if (condition) {
      query = query.in('condition', condition.split(','))
    }

    if (search) {
      query = query.or(
        `item_types.name.ilike.%${search}%,notes.ilike.%${search}%`
      )
    }

    // Pagination et tri
    const { data: items, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false })

    // Gestion des erreurs de récupération des items
    if (error) {
      return { 
        items: [], 
        total: 0, 
        page, 
        limit,
        status: 'error' 
      }
    }

    return { 
      items: items || [], 
      total: count || 0,
      page,
      limit,
      status: 'success'
    }
  } catch (error) {
    // Capture des erreurs inattendues
    console.error('Erreur inattendue lors du chargement des items:', error)
    return { 
      items: [], 
      total: 0, 
      page, 
      limit,
      status: 'error' 
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