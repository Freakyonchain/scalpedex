'use client';

import React, { useState } from 'react';
import type { CollectionItem } from '@/app/actions/collection-actions';
import { SmartImage } from './SmartImage';
import { X, Trash, DollarSign } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import { toast } from 'sonner';

const CONDITION_LABELS: Record<string, string> = {
  FACTORY_SEALED: 'Scelle Usine',
  CUSTOM_SEALED: 'Scelle Custom',
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  PLAYED: 'Joue',
};

interface ItemModalProps {
  item: CollectionItem;
  onClose: () => void;
}

export function ItemModal({ item, onClose }: ItemModalProps) {
  const [showSellPanel, setShowSellPanel] = useState(false);
  const [soldPrice, setSoldPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { removeItem, sellItem } = useCollection();

  const handleRemove = async () => {
    if (window.confirm('Etes-vous sur de vouloir supprimer cet item ?')) {
      setIsDeleting(true);
      const success = await removeItem(item.id);
      if (success) {
        onClose();
      }
      setIsDeleting(false);
    }
  };

  const handleSell = async () => {
    if (!soldPrice || isNaN(parseFloat(soldPrice))) {
      toast.error('Veuillez entrer un prix de vente valide');
      return;
    }

    setIsSubmitting(true);
    const success = await sellItem({
      itemId: item.id,
      soldPrice: parseFloat(soldPrice)
    });

    if (success) {
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-violet-900/95 p-6 rounded-xl w-full max-w-lg relative">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-violet-300 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <SmartImage
              src={item.product_image}
              alt={item.product_name}
              className="w-full aspect-square rounded-lg"
            />
          </div>

          {/* Informations */}
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-bold text-white mb-4">
              {item.product_name}
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-violet-300">Etat</p>
                <p className="text-white font-medium">{CONDITION_LABELS[item.condition] || item.condition}</p>
              </div>

              <div>
                <p className="text-violet-300">Quantite</p>
                <p className="text-white font-medium">{item.quantity}</p>
              </div>

              <div>
                <p className="text-violet-300">Prix d&apos;achat</p>
                <p className="text-white font-medium">
                  {item.purchase_price.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
              </div>

              {item.purchase_date && (
                <div>
                  <p className="text-violet-300">Date d&apos;achat</p>
                  <p className="text-white font-medium">
                    {new Date(item.purchase_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              {!showSellPanel ? (
                <>
                  <button
                    onClick={() => setShowSellPanel(true)}
                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <DollarSign size={18} />
                    Marquer comme vendu
                  </button>

                  <button
                    onClick={handleRemove}
                    disabled={isDeleting}
                    className="py-2 px-4 bg-red-900/50 hover:bg-red-900/70 text-red-300 hover:text-red-100 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isDeleting ? 'Suppression...' : <Trash size={18} />}
                  </button>
                </>
              ) : (
                <div className="w-full space-y-3">
                  <div>
                    <label className="block text-sm text-violet-300 mb-1">
                      Prix de vente
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={soldPrice}
                        onChange={(e) => setSoldPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-2 bg-black/20 border border-violet-800/50 rounded-lg text-white appearance-none"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400">EUR</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSellPanel(false)}
                      className="flex-1 py-2 px-4 bg-violet-900/50 text-violet-300 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>

                    <button
                      onClick={handleSell}
                      disabled={isSubmitting || !soldPrice}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-900/50 text-white disabled:text-green-300 rounded-lg transition-colors"
                    >
                      {isSubmitting ? 'Enregistrement...' : 'Confirmer la vente'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
