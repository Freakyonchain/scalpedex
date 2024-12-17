// components/scanner/QuickAddForm.tsx
'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, FileText, Save } from 'lucide-react';

interface QuickAddFormProps {
  barcode: string;
  onClose: () => void;
  onSave: (data: any) => void;
  onDetailedEdit: () => void;
}

export const QuickAddForm = ({ barcode, onClose, onSave, onDetailedEdit }: QuickAddFormProps) => {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<string>('');

  const conditions = [
    { id: 'sealed', label: '🎁 Sealed' },
    { id: 'mint', label: '✨ Mint' },
    { id: 'near_mint', label: '👌 Near Mint' },
    { id: 'played', label: '👍 Played' },
  ];

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleSubmit = () => {
    if (!price || !condition) return;

    onSave({
      barcode,
      purchasePrice: parseFloat(price),
      condition,
      quantity,
      purchaseDate: new Date(),
    });
  };

  const isValid = price !== '' && condition !== '';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-violet-950 to-black rounded-t-2xl sm:rounded-2xl border border-violet-800/50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-violet-800/50">
          <h3 className="font-medium text-white">Ajout Rapide</h3>
          <button onClick={onClose} className="text-violet-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-6 space-y-6">
                  {/* Code barre */}

        <div className="border-b border-violet-800/50 mb-6">
  <div className="flex items-center gap-2 mb-4">
    <label className="text-sm text-violet-300">Code-barres</label>
    <input
      type="text"
      value={barcode}
      readOnly
      className="flex-1 bg-black/20 px-3 py-1.5 rounded border border-violet-800/50 text-white font-mono text-sm"
    />
  </div>
</div>
          {/* Prix */}
          <div>
            <label className="block text-sm text-violet-300 mb-2">Prix d'achat</label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-2xl font-bold text-white bg-black/20 border border-violet-800/50 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-600"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-violet-400">€</span>
            </div>
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm text-violet-300 mb-2">Quantité</label>
            <div className="flex items-center gap-4 bg-black/20 rounded-lg border border-violet-800/50 p-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 text-violet-400 hover:text-white disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={20} />
              </button>
              <span className="flex-1 text-center text-2xl font-bold text-white">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 text-violet-400 hover:text-white"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* État */}
          <div>
            <label className="block text-sm text-violet-300 mb-2">État</label>
            <div className="grid grid-cols-2 gap-2">
              {conditions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCondition(c.id)}
                  className={`p-3 rounded-lg text-white font-medium border transition-all ${
                    condition === c.id
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
        <div className="p-4 border-t border-violet-800/50 space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-700 transition-colors"
          >
            <Save size={20} />
            Ajouter {quantity > 1 ? `(${quantity})` : ''}
          </button>

          <button
            onClick={onDetailedEdit}
            className="w-full py-3 text-violet-400 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={20} />
            Plus de détails
          </button>
        </div>
      </div>
    </div>
  );
};