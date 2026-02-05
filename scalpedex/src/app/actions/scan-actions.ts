'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './auth-actions';

// ============================================================================
// TYPES
// ============================================================================

export interface ProductWithPrice {
  id: string;
  ean: string | null;
  name: string;
  type: string;
  set_name: string | null;
  msrp: number | null;
  image_url: string | null;
  language: string;
  // From price cache
  current_price: number | null;
  change_24h: number | null;
  change_7d: number | null;
  trend: 'up' | 'down' | 'stable' | null;
  volume_24h: number | null;
}

export interface ScanResult {
  product: ProductWithPrice | null;
  scalpScore: number | null;
  recommendation: string;
  profit: number | null;
  profitPercent: number | null;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const eanSchema = z
  .string()
  .regex(/^\d{8,13}$/, 'Code-barres invalide (8-13 chiffres)');

const logScanSchema = z.object({
  barcode: eanSchema,
  productId: z.string().uuid().optional(),
  retailPrice: z.number().positive().optional(),
  retailer: z.string().max(100).optional(),
  locationHint: z.string().max(100).optional(),
  calculatedScore: z.number().min(0).max(100).optional(),
});

// ============================================================================
// HELPERS
// ============================================================================

function calculateScalpScore(retailPrice: number, marketPrice: number): {
  score: number;
  recommendation: string;
  profit: number;
  profitPercent: number;
} {
  const profit = marketPrice - retailPrice;
  const profitPercent = (profit / retailPrice) * 100;
  
  let score: number;
  let recommendation: string;
  
  if (profitPercent >= 50) {
    score = Math.min(100, 90 + (profitPercent - 50) / 5);
    recommendation = '🔥 ACHETER IMMÉDIATEMENT';
  } else if (profitPercent >= 25) {
    score = 70 + ((profitPercent - 25) / 25) * 20;
    recommendation = '✅ Excellente opportunité';
  } else if (profitPercent >= 10) {
    score = 50 + ((profitPercent - 10) / 15) * 20;
    recommendation = '⚠️ Profit modéré';
  } else if (profitPercent > 0) {
    score = 30 + (profitPercent / 10) * 20;
    recommendation = '😐 Marge faible';
  } else {
    score = Math.max(0, 30 + profitPercent);
    recommendation = '❌ Non rentable';
  }
  
  return {
    score: Math.round(score),
    recommendation,
    profit,
    profitPercent,
  };
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Get product by EAN with price cache data
 * Returns null if product not found
 */
export async function getProductByEAN(ean: string): Promise<ActionResult<ScanResult>> {
  // Validate input
  const validation = eanSchema.safeParse(ean);
  
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message,
    };
  }

  try {
    const supabase = await createClient();

    // Query product with price cache join
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id,
        ean,
        name,
        type,
        set_name,
        msrp,
        image_url,
        language,
        product_price_cache (
          current_price,
          change_24h,
          change_7d,
          trend,
          volume_24h
        )
      `)
      .eq('ean', ean)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - product not found
        return {
          success: true,
          data: {
            product: null,
            scalpScore: null,
            recommendation: 'Produit non reconnu',
            profit: null,
            profitPercent: null,
          },
        };
      }
      
      console.error('[getProductByEAN] Error:', error.message);
      return { success: false, message: 'Erreur lors de la recherche du produit' };
    }

    // Flatten the response
    const priceCache = Array.isArray(product.product_price_cache) 
      ? product.product_price_cache[0] 
      : product.product_price_cache;

    const productWithPrice: ProductWithPrice = {
      id: product.id,
      ean: product.ean,
      name: product.name,
      type: product.type,
      set_name: product.set_name,
      msrp: product.msrp,
      image_url: product.image_url,
      language: product.language,
      current_price: priceCache?.current_price ?? null,
      change_24h: priceCache?.change_24h ?? null,
      change_7d: priceCache?.change_7d ?? null,
      trend: priceCache?.trend ?? null,
      volume_24h: priceCache?.volume_24h ?? null,
    };

    // Calculate scalp score if we have both MSRP and market price
    let scanResult: ScanResult;
    
    if (productWithPrice.msrp && productWithPrice.current_price) {
      const scoreData = calculateScalpScore(
        productWithPrice.msrp, 
        productWithPrice.current_price
      );
      
      scanResult = {
        product: productWithPrice,
        scalpScore: scoreData.score,
        recommendation: scoreData.recommendation,
        profit: scoreData.profit,
        profitPercent: scoreData.profitPercent,
      };
    } else {
      scanResult = {
        product: productWithPrice,
        scalpScore: null,
        recommendation: 'Données de prix insuffisantes',
        profit: null,
        profitPercent: null,
      };
    }

    return {
      success: true,
      data: scanResult,
    };

  } catch (error) {
    console.error('[getProductByEAN] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Log a scan in the user's history
 * Updates stats and checks achievements
 */
export async function logScan(input: {
  barcode: string;
  productId?: string;
  retailPrice?: number;
  retailer?: string;
  locationHint?: string;
  calculatedScore?: number;
}): Promise<ActionResult<{ scanId: string }>> {
  // Validate input
  const validation = logScanSchema.safeParse(input);
  
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

    // Insert scan record
    const { data: scan, error } = await supabase
      .from('scan_history')
      .insert({
        user_id: user.id,
        barcode: data.barcode,
        product_id: data.productId || null,
        retail_price: data.retailPrice || null,
        retailer: data.retailer || null,
        location_hint: data.locationHint || null,
        calculated_score: data.calculatedScore || null,
        added_to_collection: false,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[logScan] Insert error:', error.message);
      return { success: false, message: 'Erreur lors de l\'enregistrement du scan' };
    }

    // Note: Profile stats and achievements are updated via DB triggers

    return {
      success: true,
      data: { scanId: scan.id },
      message: 'Scan enregistré',
    };

  } catch (error) {
    console.error('[logScan] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Get recent scans for the current user
 */
export async function getRecentScans(limit: number = 10): Promise<ActionResult<{
  scans: Array<{
    id: string;
    barcode: string;
    product_name: string | null;
    calculated_score: number | null;
    created_at: string;
  }>;
}>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: 'Non authentifié' };
    }

    const { data: scans, error } = await supabase
      .from('scan_history')
      .select(`
        id,
        barcode,
        calculated_score,
        created_at,
        products (
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getRecentScans] Error:', error.message);
      return { success: false, message: 'Erreur lors de la récupération des scans' };
    }

    const formattedScans = scans.map(scan => ({
      id: scan.id,
      barcode: scan.barcode,
      product_name: (scan.products as unknown as { name: string } | null)?.name ?? null,
      calculated_score: scan.calculated_score,
      created_at: scan.created_at,
    }));

    return {
      success: true,
      data: { scans: formattedScans },
    };

  } catch (error) {
    console.error('[getRecentScans] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Calculate scalp score for a given retail price and product
 * Client helper - doesn't touch DB
 */
export async function calculateScalpScoreAction(
  retailPrice: number,
  marketPrice: number
): Promise<ActionResult<{
  score: number;
  recommendation: string;
  profit: number;
  profitPercent: number;
}>> {
  if (retailPrice <= 0 || marketPrice <= 0) {
    return { success: false, message: 'Prix invalides' };
  }

  const result = calculateScalpScore(retailPrice, marketPrice);
  
  return {
    success: true,
    data: result,
  };
}