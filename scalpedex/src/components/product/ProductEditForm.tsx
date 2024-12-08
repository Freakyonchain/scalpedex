// components/product/ProductEditForm.tsx
'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ProductEditFormProps {
  barcode: string;
  onClose: () => void;
  onSave: (data: ProductEditData) => void;
}

export interface ProductEditData {
  name: string;
  condition: 'sealed' | 'mint' | 'near_mint' | 'played' | 'heavily_played';
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
}

const CONDITIONS = {
  sealed: 'Scellé',
  mint: 'Mint',
  near_mint: 'Near Mint',
  played: 'Played',
  heavily_played: 'Heavily Played',
};

export const ProductEditForm = ({ barcode, onClose, onSave }: ProductEditFormProps) => {
  const [formData, setFormData] = useState<ProductEditData>({
    name: '',
    condition: 'sealed',
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-violet-950 to-black rounded-xl border border-violet-800/50 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Éditer le produit</h3>
            <button 
              onClick={onClose}
              className="text-violet-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-1">
                Nom du produit
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-violet-900/30 border border-violet-800/50 rounded-lg 
                          text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="ETB Paradox Rift..."
                required
              />
            </div>

            {/* État */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-1">
                État
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(CONDITIONS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, condition: value as any }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${formData.condition === value 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-violet-900/30 text-violet-300 hover:bg-violet-800/30'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prix d'achat */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-1">
                Prix d'achat
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) }))}
                  className="w-full pl-8 pr-3 py-2 bg-violet-900/30 border border-violet-800/50 rounded-lg 
                            text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
                  required
                />
              </div>
            </div>

            {/* Date d'achat */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-1">
                Date d'achat
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                className="w-full px-3 py-2 bg-violet-900/30 border border-violet-800/50 rounded-lg 
                          text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-violet-900/30 border border-violet-800/50 rounded-lg 
                          text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
                rows={3}
                placeholder="Informations supplémentaires..."
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg 
                          hover:bg-violet-800/50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg 
                          hover:bg-violet-700 transition-colors font-medium"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};