'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from './auth-actions';

// ============================================================================
// TYPES
// ============================================================================

export type ItemCondition = 
  | 'FACTORY_SEALED'
  | 'CUSTOM_SEALED'
  | 'MINT'
  | 'NEAR_MINT'
  | 'PLAYED';

export interface CollectionItem {
  id: string;
  product_id: string;
  product_name: string;
  product_type: string;
  product_image: string | null;
  quantity: number;
  condition: ItemCondition;
  purchase_price: number;
  purchase_date: string | null;
  current_market_price: number | null;
  unrealized_profit: number | null;
  unrealized_roi: number | null;
}

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalProfit: number;
  totalItems: number;
  sealedCount: number;
  avgRoi: number;
  bestRoiItem: string | null;
  bestRoiPercent: number | null;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const addToCollectionSchema = z.object({
  productId: z.string().uuid('ID produit invalide'),
  purchasePrice: z.number().positive('Le prix doit être positif'),
  quantity: z.number().int().min(1).max(99).default(1),
  condition: z.enum([
    'FACTORY_SEALED',
    'CUSTOM_SEALED',
    'MINT',
    'NEAR_MINT',
    'PLAYED',
  ]).default('FACTORY_SEALED'),
  purchaseDate: z.string().optional(),
  notes: z.string().max(500).optional(),
});

const recordSaleSchema = z.object({
  collectionItemId: z.string().uuid('ID invalide'),
  soldPrice: z.number().positive('Le prix de vente doit être positif'),
  soldDate: z.string().optional(),
});

const updateCollectionItemSchema = z.object({
  collectionItemId: z.string().uuid('ID invalide'),
  quantity: z.number().int().min(1).max(99).optional(),
  condition: z.enum([
    'FACTORY_SEALED',
    'CUSTOM_SEALED',
    'MINT',
    'NEAR_MINT',
    'PLAYED',
  ]).optional(),
  purchasePrice: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Add a product to user's collection
 */
export async function addToCollection(input: {
  productId: string;
  purchasePrice: number;
  quantity?: number;
  condition?: ItemCondition;
  purchaseDate?: string;
  notes?: string;
}): Promise<ActionResult<{ collectionItemId: string }>> {
  // Validate input
  const validation = addToCollectionSchema.safeParse(input);
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Données invalides',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = validation.data;

  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: 'Non authentifié' };
    }

    // Verify product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', data.productId)
      .single();

    if (productError || !product) {
      return { success: false, message: 'Produit introuvable' };
    }

    // Insert collection item
    const { data: item, error } = await supabase
      .from('user_collection')
      .insert({
        user_id: user.id,
        product_id: data.productId,
        purchase_price: data.purchasePrice,
        quantity: data.quantity,
        condition: data.condition,
        purchase_date: data.purchaseDate || new Date().toISOString(),
        notes: data.notes || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[addToCollection] Insert error:', error.message);
      
      // Handle RLS errors
      if (error.code === '42501') {
        return { success: false, message: 'Accès non autorisé' };
      }
      
      return { success: false, message: 'Erreur lors de l\'ajout' };
    }

    revalidatePath('/collection');
    
    return {
      success: true,
      data: { collectionItemId: item.id },
      message: 'Produit ajouté à la collection!',
    };

  } catch (error) {
    console.error('[addToCollection] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Get portfolio statistics (optimized single query)
 */
export async function getPortfolioStats(): Promise<ActionResult<PortfolioStats>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: 'Non authentifié' };
    }

    // Single optimized query with aggregations
    const { data: items, error } = await supabase
      .from('user_collection')
      .select(`
        id,
        quantity,
        condition,
        purchase_price,
        sold_date,
        sold_price,
        products!inner (
          id,
          name,
          product_price_cache (
            current_price
          )
        )
      `)
      .eq('user_id', user.id)
      .is('sold_date', null); // Only unsold items

    if (error) {
      console.error('[getPortfolioStats] Error:', error.message);
      return { success: false, message: 'Erreur lors du calcul des stats' };
    }

    if (!items || items.length === 0) {
      return {
        success: true,
        data: {
          totalValue: 0,
          totalCost: 0,
          totalProfit: 0,
          totalItems: 0,
          sealedCount: 0,
          avgRoi: 0,
          bestRoiItem: null,
          bestRoiPercent: null,
        },
      };
    }

    // Calculate stats in memory
    let totalValue = 0;
    let totalCost = 0;
    let totalItems = 0;
    let sealedCount = 0;
    let bestRoiItem: string | null = null;
    let bestRoiPercent = -Infinity;

    for (const item of items) {
      const product = item.products as unknown as { name: string; product_price_cache: { current_price: number | null } | { current_price: number | null }[] | null };
      const priceCache = Array.isArray(product.product_price_cache)
        ? product.product_price_cache[0]
        : product.product_price_cache;

      const marketPrice = priceCache?.current_price ?? item.purchase_price;
      const itemValue = marketPrice * item.quantity;
      const itemCost = item.purchase_price * item.quantity;
      const roi = ((marketPrice - item.purchase_price) / item.purchase_price) * 100;

      totalValue += itemValue;
      totalCost += itemCost;
      totalItems += item.quantity;

      if (item.condition === 'FACTORY_SEALED' || item.condition === 'CUSTOM_SEALED') {
        sealedCount += item.quantity;
      }

      if (roi > bestRoiPercent) {
        bestRoiPercent = roi;
        bestRoiItem = product.name;
      }
    }

    const totalProfit = totalValue - totalCost;
    const avgRoi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return {
      success: true,
      data: {
        totalValue: Math.round(totalValue * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        totalProfit: Math.round(totalProfit * 100) / 100,
        totalItems,
        sealedCount,
        avgRoi: Math.round(avgRoi * 10) / 10,
        bestRoiItem,
        bestRoiPercent: bestRoiPercent > -Infinity 
          ? Math.round(bestRoiPercent * 10) / 10 
          : null,
      },
    };

  } catch (error) {
    console.error('[getPortfolioStats] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Get user's collection items
 */
export async function getCollectionItems(options?: {
  condition?: ItemCondition;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<{ items: CollectionItem[]; total: number }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: 'Non authentifié' };
    }

    let query = supabase
      .from('user_collection')
      .select(`
        id,
        product_id,
        quantity,
        condition,
        purchase_price,
        purchase_date,
        products!inner (
          name,
          type,
          image_url,
          product_price_cache (
            current_price
          )
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .is('sold_date', null)
      .order('created_at', { ascending: false });

    // Apply filters
    if (options?.condition) {
      query = query.eq('condition', options.condition);
    }

    if (options?.search) {
      query = query.ilike('products.name', `%${options.search}%`);
    }

    // Pagination
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;
    query = query.range(offset, offset + limit - 1);

    const { data: items, error, count } = await query;

    if (error) {
      console.error('[getCollectionItems] Error:', error.message);
      return { success: false, message: 'Erreur lors de la récupération' };
    }

    // Format items
    const formattedItems: CollectionItem[] = (items || []).map(item => {
      const product = item.products as unknown as { name: string; type: string; image_url: string | null; product_price_cache: { current_price: number | null } | { current_price: number | null }[] | null };
      const priceCache = Array.isArray(product.product_price_cache)
        ? product.product_price_cache[0]
        : product.product_price_cache;
      
      const marketPrice = priceCache?.current_price ?? null;
      const profit = marketPrice ? (marketPrice - item.purchase_price) * item.quantity : null;
      const roi = marketPrice && item.purchase_price > 0
        ? ((marketPrice - item.purchase_price) / item.purchase_price) * 100
        : null;

      return {
        id: item.id,
        product_id: item.product_id,
        product_name: product.name,
        product_type: product.type,
        product_image: product.image_url,
        quantity: item.quantity,
        condition: item.condition as ItemCondition,
        purchase_price: item.purchase_price,
        purchase_date: item.purchase_date,
        current_market_price: marketPrice,
        unrealized_profit: profit,
        unrealized_roi: roi,
      };
    });

    return {
      success: true,
      data: {
        items: formattedItems,
        total: count ?? 0,
      },
    };

  } catch (error) {
    console.error('[getCollectionItems] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Record a sale for a collection item
 */
export async function recordSale(input: {
  collectionItemId: string;
  soldPrice: number;
  soldDate?: string;
}): Promise<ActionResult<{ profit: number }>> {
  const validation = recordSaleSchema.safeParse(input);
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Données invalides',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = validation.data;

  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: 'Non authentifié' };
    }

    // Get the item to calculate profit
    const { data: item, error: fetchError } = await supabase
      .from('user_collection')
      .select('purchase_price, quantity')
      .eq('id', data.collectionItemId)
      .eq('user_id', user.id)
      .is('sold_date', null)
      .single();

    if (fetchError || !item) {
      return { success: false, message: 'Item introuvable ou déjà vendu' };
    }

    // Update with sale data
    const { error: updateError } = await supabase
      .from('user_collection')
      .update({
        sold_date: data.soldDate || new Date().toISOString(),
        sold_price: data.soldPrice,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.collectionItemId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[recordSale] Update error:', updateError.message);
      return { success: false, message: 'Erreur lors de l\'enregistrement de la vente' };
    }

    const profit = (data.soldPrice - item.purchase_price) * item.quantity;

    revalidatePath('/collection');
    
    return {
      success: true,
      data: { profit },
      message: profit >= 0 
        ? `🎉 Vente enregistrée! Profit: +${profit.toFixed(2)}€`
        : `Vente enregistrée. Perte: ${profit.toFixed(2)}€`,
    };

  } catch (error) {
    console.error('[recordSale] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Remove an item from collection (permanent delete)
 */
export async function removeFromCollection(
  collectionItemId: string
): Promise<ActionResult> {
  if (!collectionItemId || typeof collectionItemId !== 'string') {
    return { success: false, message: 'ID invalide' };
  }

  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: 'Non authentifié' };
    }

    const { error } = await supabase
      .from('user_collection')
      .delete()
      .eq('id', collectionItemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[removeFromCollection] Error:', error.message);
      return { success: false, message: 'Erreur lors de la suppression' };
    }

    revalidatePath('/collection');
    
    return {
      success: true,
      message: 'Item supprimé de la collection',
    };

  } catch (error) {
    console.error('[removeFromCollection] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Update a collection item
 */
export async function updateCollectionItem(input: {
  collectionItemId: string;
  quantity?: number;
  condition?: ItemCondition;
  purchasePrice?: number;
  notes?: string;
}): Promise<ActionResult> {
  const validation = updateCollectionItemSchema.safeParse(input);
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Données invalides',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { collectionItemId, ...updates } = validation.data;

  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: 'Non authentifié' };
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.condition !== undefined) updateData.condition = updates.condition;
    if (updates.purchasePrice !== undefined) updateData.purchase_price = updates.purchasePrice;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { error } = await supabase
      .from('user_collection')
      .update(updateData)
      .eq('id', collectionItemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[updateCollectionItem] Error:', error.message);
      return { success: false, message: 'Erreur lors de la mise à jour' };
    }

    revalidatePath('/collection');
    
    return {
      success: true,
      message: 'Item mis à jour',
    };

  } catch (error) {
    console.error('[updateCollectionItem] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}