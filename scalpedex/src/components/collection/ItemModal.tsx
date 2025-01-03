// components/collection/ItemModal.tsx
'use client'

import { CollectionItem, CONDITIONS } from '@/types/collection';
import { SmartImage } from './SmartImage';
import { X } from 'lucide-react';

interface ItemModalProps {
  item: CollectionItem;
  onClose: () => void;
}

export function ItemModal({ item, onClose }: ItemModalProps) {
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
              src={item.products.image_url}
              alt={item.products.name}
              className="w-full aspect-square rounded-lg"
            />
          </div>

          {/* Informations */}
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-bold text-white mb-4">
              {item.products.name}
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-violet-300">État</p>
                <p className="text-white font-medium">{CONDITIONS[item.condition]}</p>
              </div>

              <div>
                <p className="text-violet-300">Quantité</p>
                <p className="text-white font-medium">{item.quantity}</p>
              </div>

              <div>
                <p className="text-violet-300">Prix d'achat</p>
                <p className="text-white font-medium">
                  {Number(item.purchase_price).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
              </div>

              {/* Vous pouvez ajouter d'autres informations ici */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}