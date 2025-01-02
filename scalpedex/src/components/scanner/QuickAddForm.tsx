'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Minus, FileText, Save, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Types
interface Product {
  id: string;
  name: string;
  barcode: string;
}

interface QuickAddFormProps {
  barcode: string;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  onDetailedEdit: () => void;
}

interface FormState {
  name: string;
  price: string;
  quantity: number;
  condition: string;
  category: string;
}

// Constantes
const CATEGORIES = [
  { id: 'BOOSTER_PACK', label: '📦 Booster Pack' },
  { id: 'ELITE_TRAINER_BOX', label: '🎯 Elite Trainer Box' },
  { id: 'BOOSTER_BUNDLE', label: '📚 Booster Bundle' },
  { id: 'COLLECTION_BOX', label: '🗃️ Collection Box' },
  { id: 'SPECIAL_SET', label: '✨ Special Set' },
  { id: 'PROMO_CARD', label: '⭐ Promo Card' },
  { id: 'OTHER', label: '📎 Autre' },
] as const;

const CONDITIONS = [
  { id: 'FACTORY_SEALED', label: '🎁 Sealed' },
  { id: 'MINT', label: '✨ Mint' },
  { id: 'NEAR_MINT', label: '👌 Near Mint' },
  { id: 'PLAYED', label: '👍 Played' },
] as const;

export const QuickAddForm = ({
  barcode,
  onClose,
  onSave,
  onDetailedEdit,
}: QuickAddFormProps) => {
  // États du formulaire
  const [formState, setFormState] = useState<FormState>({
    name: '',
    price: '',
    quantity: 1,
    condition: '',
  });
  
  // États de l'UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  // Gestionnaires d'état du formulaire
  const updateFormField = useCallback(<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleQuantityChange = useCallback((delta: number) => {
    setFormState(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  }, []);

  // Validation du formulaire
  const isValid = Boolean(
    formState.name.trim() &&
    formState.price &&
    formState.condition
  );

  // Recherche du produit existant
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Recherche du produit:', barcode);
        
        const response = await fetch(`/api/products/${barcode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const product = await response.json();
          if (product) {
            console.log('✅ Produit trouvé:', product);
            setExistingProduct(product);
            updateFormField('name', product.name);
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
        toast.error('Erreur lors de la recherche du produit');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  // Création/Mise à jour du produit
  const handleSubmit = async () => {
    if (!isValid) return;
    
    setIsSaving(true);
    try {
      let productId = existingProduct?.id;
      
      // Création du produit si nécessaire
      if (!existingProduct) {
        // D'abord vérifier si le produit existe avec ce code-barres
        const checkResponse = await fetch(`/api/products/${barcode}`);
        const existingProductData = await checkResponse.json();
      
        if (existingProductData) {
          // Si le produit existe déjà, utiliser son ID
          productId = existingProductData.id;
          console.log('✅ Produit existant trouvé:', existingProductData);
        } else {
          // Si le produit n'existe pas, le créer
          console.log('📝 Création du produit:', { 
            name: formState.name, 
            barcode,
            category: formState.category
          });
          
          const productResponse = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formState.name.trim(),
              barcode,
              category: formState.category,
              is_active: true
            }),
          });
      
          if (!productResponse.ok) {
            const errorData = await productResponse.json().catch(() => ({}));
            console.error('❌ Échec de la création:', {
              status: productResponse.status,
              errorData
            });
            throw new Error(errorData.message || 'Erreur lors de la création du produit');
          }
      
          const newProduct = await productResponse.json();
          console.log('✅ Nouveau produit créé:', newProduct);
          productId = newProduct.id;
        }
      } else {
        productId = existingProduct.id;
      }

      if (!productId) {
        throw new Error('ID du produit manquant');
      }

      // Sauvegarde dans la collection
      const collectionData = {
        product_id: productId,
        purchase_price: parseFloat(formState.price),
        condition: formState.condition,
        quantity: formState.quantity,
        purchase_date: new Date().toISOString(),
      };

      console.log('💾 Sauvegarde dans la collection:', collectionData);
      await onSave(collectionData);
      
      toast.success('Produit ajouté avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-violet-950 to-black rounded-t-2xl sm:rounded-2xl border border-violet-800/50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-violet-800/50">
          <h3 className="font-medium text-white">Ajout Rapide</h3>
          <button
            onClick={onClose}
            className="text-violet-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-violet-400" />
              <span className="text-violet-300">Chargement...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Formulaire */}
            <div className="p-6 space-y-6">
              {/* Nom et Code barre */}
              <div className="space-y-4 border-b border-violet-800/50 pb-6">
                <div>
                  <label className="block text-sm text-violet-300 mb-2">
                    Nom du produit
                  </label>
                  <Input
                    value={formState.name}
                    onChange={e => updateFormField('name', e.target.value)}
                    className="bg-black/20 border-violet-800/50 text-white"
                    placeholder="Nom du produit"
                  />
                  {existingProduct && (
                    <p className="mt-2 text-sm text-green-400">
                      ✓ Produit existant dans la base
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-violet-300 mb-2">
                    Code-barres
                  </label>
                  <input
                    type="text"
                    value={barcode}
                    readOnly
                    className="w-full bg-black/20 px-3 py-1.5 rounded border border-violet-800/50 text-white font-mono text-sm"
                  />
                </div>
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm text-violet-300 mb-2">
                  Prix d'achat
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formState.price}
                    onChange={e => updateFormField('price', e.target.value)}
                    className="w-full text-2xl font-bold text-white bg-black/20 border border-violet-800/50 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-600"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-violet-400">
                    €
                  </span>
                </div>
              </div>

              {/* Quantité */}
              <div>
                <label className="block text-sm text-violet-300 mb-2">
                  Quantité
                </label>
                <div className="flex items-center gap-4 bg-black/20 rounded-lg border border-violet-800/50 p-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 text-violet-400 hover:text-white disabled:opacity-50 transition-colors"
                    disabled={formState.quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="flex-1 text-center text-2xl font-bold text-white">
                    {formState.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 text-violet-400 hover:text-white transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm text-violet-300 mb-2">
                  Catégorie
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateFormField('category', c.id)}
                      className={`p-3 rounded-lg text-white font-medium border transition-all ${
                        formState.category === c.id
                          ? 'border-violet-500 bg-violet-900/50'
                          : 'border-violet-800/50 bg-black/20 hover:bg-violet-900/20'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
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
                      onClick={() => updateFormField('condition', c.id)}
                      className={`p-3 rounded-lg text-white font-medium border transition-all ${
                        formState.condition === c.id
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
                disabled={!isValid || isSaving}
                className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-700 transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Ajouter {formState.quantity > 1 ? `(${formState.quantity})` : ''}
                  </>
                )}
              </button>

              <button
                onClick={onDetailedEdit}
                className="w-full py-3 text-violet-400 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                Plus de détails
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};