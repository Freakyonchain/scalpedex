'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Type pour la création/modification d'items
interface ItemData {
  barcode: string
  item_type_id?: string
  condition: 'FACTORY_SEALED' | 'CUSTOM_SEALED' | 'MINT' | 'NEAR_MINT' | 'PLAYED'
  purchase_price: number
  quantity: number
  notes?: string
}

// Fonction pour créer un nouvel item
export async function createItem(data: ItemData) {
  try {
    // Récupération de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    // Si pas d'item_type_id fourni, créer un type générique
    if (!data.item_type_id) {
      const { data: genericType, error: typeError } = await supabase
        .from('item_types')
        .select('*')
        .eq('name', 'Non catégorisé')
        .single()

      if (typeError || !genericType) {
        const { data: newType, error: createError } = await supabase
          .from('item_types')
          .insert({ name: 'Non catégorisé', msrp: 0 })
          .select()
          .single()

        if (createError) throw createError
        data.item_type_id = newType.id
      } else {
        data.item_type_id = genericType.id
      }
    }

    // Création de l'item
    const { data: item, error } = await supabase
      .from('items')
      .insert({
        ...data,
        user_id: user.id,
      })
      .select('*, item_types(name)')
      .single()

    if (error) throw error

    revalidatePath('/collection')
    return { success: true, item }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }
  }
}

// Fonction pour mettre à jour un item
export async function updateItem(id: string, data: Partial<ItemData>) {
  try {
    // Récupération de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    // Vérifier que l'item appartient bien à l'utilisateur
    const { data: existingItem, error: findError } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (findError || !existingItem) {
      throw new Error('Item non trouvé ou accès non autorisé')
    }

    // Mise à jour de l'item
    const { data: updatedItem, error } = await supabase
      .from('items')
      .update(data)
      .eq('id', id)
      .select('*, item_types(name)')
      .single()

    if (error) throw error

    revalidatePath('/collection')
    return { success: true, item: updatedItem }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }
  }
}

// Fonction pour supprimer un item
export async function deleteItem(id: string) {
  try {
    // Récupération de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    // Vérifier que l'item appartient bien à l'utilisateur
    const { data: existingItem, error: findError } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (findError || !existingItem) {
      throw new Error('Item non trouvé ou accès non autorisé')
    }

    // Suppression de l'item
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/collection')
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }
  }
}

// Fonction pour récupérer un item spécifique
export async function getItem(id: string) {
  try {
    // Récupération de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    // Récupération de l'item
    const { data: item, error } = await supabase
      .from('items')
      .select('*, item_types(name)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !item) {
      throw new Error('Item non trouvé')
    }

    return { success: true, item }
  } catch (error) {
    console.error('Erreur lors de la récupération:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }
  }
}