// components/product/ProductCard.tsx
'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProductCardProps {
  barcode: string;
  isLoading?: boolean;
}

interface ProductData {
  name: string;
  currentPrice: number;
  lastPrice: number;
  imageUrl: string;
  priceHistory: Array<{date: string; price: number}>;
}

export const ProductCard = ({ barcode, isLoading = false }: ProductCardProps) => {
  const [productData, setProductData] = React.useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulation de la récupération des données
  // À remplacer par un vrai appel API plus tard
  React.useEffect(() => {
    if (!barcode) return;

    const fetchData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données de test
        setProductData({
          name: "Pokémon Elite Trainer Box Paradox Rift",
          currentPrice: 59.99,
          lastPrice: 54.99,
          imageUrl: "/api/placeholder/200/200",  // Placeholder pour le moment
          priceHistory: [
            {date: "2024-01", price: 54.99},
            {date: "2024-02", price: 56.99},
            {date: "2024-03", price: 59.99}
          ]
        });
      } catch (err) {
        setError("Impossible de charger les informations du produit");
        console.error(err);
      }
    };

    fetchData();
  }, [barcode]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md p-6 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 animate-pulse">
        <div className="h-4 bg-violet-600/50 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-violet-600/50 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-violet-600/50 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-6 bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-800/50">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!productData) return null;

  const priceChange = productData.currentPrice - productData.lastPrice;
  const priceChangePercent = (priceChange / productData.lastPrice) * 100;

  return (
    <div className="w-full max-w-md p-6 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
      <div className="flex gap-4 items-start">
        <img 
          src={productData.imageUrl} 
          alt={productData.name}
          className="w-20 h-20 rounded-lg object-cover bg-violet-800/30"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            {productData.name}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-white">
              ${productData.currentPrice.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(priceChangePercent).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-sm text-violet-300">
            Prix précédent: ${productData.lastPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};