'use server';

import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types/scanner.types';
import { revalidatePath } from 'next/cache';

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select('id, name, barcode, category, msrp, image_url')
      .eq('barcode', barcode)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      barcode: data.barcode || '',
      category: data.category,
      msrp: data.msrp || undefined,
      imageUrl: data.image_url || undefined,
      marketPrice: 64.99 // Hardcoded for demo - should come from a real market API
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        barcode: product.barcode,
        category: product.category || 'card',
        msrp: product.msrp || null,
        image_url: product.imageUrl || null,
        is_active: true
      }])
      .select('id, name, barcode, category, msrp, image_url')
      .single();

    if (error || !data) {
      console.error('Error creating product:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      barcode: data.barcode || '',
      category: data.category,
      msrp: data.msrp || undefined,
      imageUrl: data.image_url || undefined
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}