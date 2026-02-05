'use client';

import React, { useState } from 'react';
import { Product, ProductView } from '@/types/scanner.types';
import { ShoppingBag, ListPlus } from 'lucide-react';
import { QuickAddPanel } from './QuickAddPanel';
import { useProductData } from '@/hooks/useProductData';

interface ProductResultProps {
  product: Product | null;
  barcode: string;
  onReset: () => void;
}

export function ProductResult({ product, barcode, onReset }: ProductResultProps) {
  const [view, setView] = useState<ProductView>(null);
  const [retailPrice, setRetailPrice] = useState<string>('');
  useProductData(barcode);
  
  if (!product) return null;

  return (
    <div className="space-y-4 w-full max-w-md">
      {/* Code détecté */}
      <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 text-sm">Code-barres détecté :</span>
          <code className="flex-1 font-mono text-white bg-black/20 px-3 py-1.5 rounded-lg">
            {barcode}
          </code>
        </div>
        
        {product.name && (
          <div className="mt-2">
            <span className="text-violet-400 text-sm">Produit :</span>
            <p className="text-white font-medium mt-1">{product.name}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!view && (
        <div className="grid gap-3">
          <button
            onClick={() => setView('scalping')}
            className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl 
                     border border-violet-800/50 flex items-center gap-3 
                     hover:bg-violet-800/20 transition-colors group"
          >
            <ShoppingBag className="text-violet-400 group-hover:text-violet-300" size={24} />
            <div>
              <h3 className="text-white font-medium">Scalping Check</h3>
              <p className="text-sm text-violet-300">Analyse rapide du potentiel</p>
            </div>
          </button>

          <button
            onClick={() => setView('collection')}
            className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl 
                     border border-violet-800/50 flex items-center gap-3 
                     hover:bg-violet-800/20 transition-colors group"
          >
            <ListPlus className="text-violet-400 group-hover:text-violet-300" size={24} />
            <div>
              <h3 className="text-white font-medium">Quick Add</h3>
              <p className="text-sm text-violet-300">Ajout rapide à la collection</p>
            </div>
          </button>
        </div>
      )}

      {/* Scalping view */}
      {view === 'scalping' && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
              placeholder="Prix en magasin"
              className="w-full px-4 py-3 bg-violet-900/20 backdrop-blur-sm rounded-xl 
                       border border-violet-800/50 text-white placeholder-violet-400 
                       appearance-none"
            />
          </div>

          {retailPrice && product.marketPrice && (
            <div className="mt-4">
              {/* Scalping score will be rendered here using ScalpingScoreDisplay */}
            </div>
          )}

          <button
            onClick={() => setView(null)}
            className="w-full py-2 px-4 bg-violet-900/30 rounded-lg text-violet-300"
          >
            Retour
          </button>
        </div>
      )}

      {/* Collection view */}
      {view === 'collection' && (
        <QuickAddPanel 
          barcode={barcode} 
          product={product}
          onClose={() => setView(null)}
        />
      )}

      {/* Bouton de reset */}
      <button
        onClick={onReset}
        className="w-full py-3 px-6 bg-violet-900/50 text-white rounded-xl 
                 hover:bg-violet-800/50 transition-colors"
      >
        Nouveau scan
      </button>
    </div>
  );
}