'use client';

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { QuickAddData, Product } from '../types/scanner-types';
import { addToCollection } from '../server-actions/collection-actions';
import { toast } from 'sonner';

interface QuickAddPanelProps {
  barcode: string;
  product: Product;
  onClose: () => void;
}

// Constantes
const CONDITIONS = [
  { id: 'FACTORY_SEALED', label: '🎁 Sealed' },
  { id: 'MINT', label: '✨ Mint' },
  { id: 'NEAR_MINT', label: '👌 Near Mint' },
  { id: 'PLAYED', label: '👍 Played' },
] as const;

export function QuickAddPanel({ barcode, product, onClose }: QuickAddPanelProps) {
  const [formData, setFormData] = useState<{
    price: string;
    quantity: number;
    condition: string;
  }>({
    price: '',
    quantity: 1,
    condition: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const isValid = Boolean(
    formData.price &&
    formData.condition
  );

  // Handlers
  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handleSubmit = async () => {
    if (!isValid || !product.id) return;
    
    setIsSubmitting(true);
    
    try {
      const data: QuickAddData = {
        productId: product.id,
        purchasePrice: parseFloat(formData.price),
        condition: formData.condition,
        quantity: formData.quantity
      };
      
      const result = await addToCollection(data);
      
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
      console.error('Error adding to collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium">Ajout Rapide</h3>
          <button
            onClick={onClose}
            className="p-1 text-violet-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Prix */}
          <div>
            <label className="block text-sm text-violet-300 mb-2">
              Prix d'achat
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={e => updateField('price', e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 bg-black/20 border border-violet-800/50 rounded-lg text-white appearance-none"
              required
            />
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm text-violet-300 mb-2">
              Quantité
            </label>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={formData.quantity <= 1}
                className="px-3 py-1 bg-violet-900/30 rounded-l-lg text-violet-300 disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                value={formData.quantity}
                onChange={e => updateField('quantity', parseInt(e.target.value) || 1)}
                className="w-16 px-3 py-1 bg-black/20 border-y border-violet-800/50 text-center text-white appearance-none"
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 bg-violet-900/30 rounded-r-lg text-violet-300"
              >
                +
              </button>
            </div>
          </div>

          {/* État */}
          <div>
            <label className="block text-sm text-violet-300 mb-2">
              État
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateField('condition', c.id)}
                  className={`p-3 rounded-lg text-white font-medium border transition-all ${
                    formData.condition === c.id
                      ? 'border-violet-500 bg-violet-900/50'
                      : 'border-violet-800/50 bg-black/20 hover:bg-violet-900/20'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-violet-900/30 rounded-lg text-violet-300"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="py-2 px-4 bg-violet-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isSubmitting ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}