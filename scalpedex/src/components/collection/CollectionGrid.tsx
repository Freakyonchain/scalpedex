// src/components/collection/CollectionGrid.tsx
'use client'

import { useState } from 'react'
import { ItemModal } from './ItemModal' // Nous allons créer ce composant ensuite

export function CollectionGrid({ items }: { items: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 hover:border-violet-600/50 transition-colors cursor-pointer"
          >
            <img 
              src="/api/placeholder/200/200" 
              alt={item.itemType.name}
              className="w-full aspect-square object-cover rounded-lg mb-3 bg-violet-800/30"
            />
            <h3 className="font-medium text-white">{item.itemType.name}</h3>
            <p className="text-violet-300 text-sm mt-1">
              {item.condition.replace('_', ' ')} • Qté: {item.quantity}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-white font-medium">
                {item.purchasePrice.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <ItemModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </>
  )
}