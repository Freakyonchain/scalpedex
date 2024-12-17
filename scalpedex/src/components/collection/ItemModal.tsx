'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'
import { createItem } from '@/lib/actions/items'

// Define the condition type to match your Supabase enum
export type Condition = 'FACTORY_SEALED' | 'NEW' | 'USED' | 'DAMAGED'

// Interface for the form data
interface ItemFormData {
  barcode: string
  itemTypeId: string
  condition: Condition
  quantity: number
  purchasePrice: number
  notes: string
}

export function AddItemModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<ItemFormData>({
    barcode: '',
    itemTypeId: '',
    condition: 'FACTORY_SEALED',
    quantity: 1,
    purchasePrice: 0,
    notes: ''
  })

  const CONDITIONS: Condition[] = [
    'FACTORY_SEALED',
    'NEW',
    'USED',
    'DAMAGED'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await createItem(formData)
      
      if (result.success) {
        toast.success('Item ajouté avec succès')
        setIsOpen(false)
        // Reset form
        setFormData({
          barcode: '',
          itemTypeId: '',
          condition: 'FACTORY_SEALED',
          quantity: 1,
          purchasePrice: 0,
          notes: ''
        })
      } else {
        toast.error(result.error || 'Erreur lors de l\'ajout')
      }
    } catch (error) {
      toast.error('Erreur inattendue')
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        title="Ajouter un item"
      >
        <PlusCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-violet-900 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Ajouter un Nouvel Item
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Code-barres"
                value={formData.barcode}
                onChange={(e) => setFormData(prev => ({...prev, barcode: e.target.value}))}
                className="w-full p-2 bg-violet-800 text-white rounded-lg"
                required
              />
              
              <input
                type="text"
                placeholder="ID Type d'Item"
                value={formData.itemTypeId}
                onChange={(e) => setFormData(prev => ({...prev, itemTypeId: e.target.value}))}
                className="w-full p-2 bg-violet-800 text-white rounded-lg"
              />
              
              <select
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({...prev, condition: e.target.value as Condition}))}
                className="w-full p-2 bg-violet-800 text-white rounded-lg"
              >
                {CONDITIONS.map(condition => (
                  <option key={condition} value={condition}>
                    {condition.replace('_', ' ')}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                placeholder="Quantité"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({...prev, quantity: parseInt(e.target.value)}))}
                className="w-full p-2 bg-violet-800 text-white rounded-lg"
                min="1"
              />
              
              <input
                type="number"
                placeholder="Prix d'achat"
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({...prev, purchasePrice: parseFloat(e.target.value)}))}
                className="w-full p-2 bg-violet-800 text-white rounded-lg"
                step="0.01"
                min="0"
              />
              
              <textarea
                placeholder="Notes (optionnel)"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                className="w-full p-2 bg-violet-800 text-white rounded-lg h-24"
              />
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-violet-800 text-white rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}