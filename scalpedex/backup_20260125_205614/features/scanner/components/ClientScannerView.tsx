'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';
import { ProductResult } from './ProductResult';
import { useProductData } from '../hooks/useProductData';
import { ManualEntry } from './ManualEntry';

export function ClientScannerView() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const { product, loading, error } = useProductData(scannedBarcode);

  const handleBarcodeDetected = (barcode: string) => {
    setScannedBarcode(barcode);
  };

  const resetScan = () => {
    setScannedBarcode(null);
  };

  return (
    <div className="space-y-6">
      {scannedBarcode ? (
        // Afficher les résultats quand un code-barres est scanné
        <div className="space-y-6">
          {loading ? (
            <div className="w-full p-6 flex justify-center">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-violet-500 rounded-full"></div>
            </div>
          ) : (
            <ProductResult 
              barcode={scannedBarcode} 
              product={product} 
              onReset={resetScan} 
            />
          )}
        </div>
      ) : (
        // Afficher l'interface de scan
        <div className="space-y-6">
          {/* Zone d'entrée manuelle */}
          <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/30 p-4">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-violet-300">
                <Search size={16} />
                <span>Pas de caméra ? Entrez le code manuellement</span>
              </label>
              <ManualEntry onSubmit={handleBarcodeDetected} />
            </div>
          </div>

          {/* Séparateur visuel */}
          <div className="flex flex-col items-center">
            <div className="text-violet-400/60 text-sm">ou</div>
          </div>

          {/* Scanner */}
          <BarcodeScanner onScanSuccess={handleBarcodeDetected} />
        </div>
      )}
    </div>
  );
}