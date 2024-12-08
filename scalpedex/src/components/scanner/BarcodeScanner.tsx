// components/scanner/BarcodeScanner.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ShoppingBag, ListPlus, Check, X } from 'lucide-react';
import { ScalpingScore } from './ScalpingScore';
import { ProductEditForm } from '../product/ProductEditForm';

interface ScanResult {
  barcode: string;
  retailPrice?: number;
  marketPrice?: number;
}

interface ProductEditData {
  name: string;
  condition: 'sealed' | 'mint' | 'near_mint' | 'played' | 'heavily_played';
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
}

export const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'scalping' | 'collection' | null>(null);
  const [retailPrice, setRetailPrice] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          setScanResult({
            barcode: decodedText,
            marketPrice: 64.99 // Prix simulé pour le POC
          });
          
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
          stopScanning();
        },
        (errorMessage) => {
          // Ignorer les erreurs de scan en cours
        }
      );

      setIsScanning(true);
      setError(null);
    } catch (err) {
      setError('Erreur d\'accès à la caméra. Vérifiez vos permissions.');
      console.error('Erreur de caméra:', err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const handleScalpingCheck = () => {
    if (!retailPrice) return;
    
    setScanResult(prev => ({
      ...prev!,
      retailPrice: parseFloat(retailPrice)
    }));
  };

  const resetScan = () => {
    setScanResult(null);
    setMode(null);
    setRetailPrice('');
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Scanner */}
      <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-black">
        <div id="reader" className="w-full h-full" />
        
        {isScanning && !scanResult && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-violet-500 rounded-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-violet-500 rounded-tl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-violet-500 rounded-tr"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-violet-500 rounded-bl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-violet-500 rounded-br"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm text-white p-4 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Sélection du mode après scan */}
      {scanResult && !mode && (
        <div className="w-full max-w-md space-y-4">
          <button
            onClick={() => setMode('scalping')}
            className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 
                     flex items-center justify-between hover:bg-violet-800/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-violet-400" size={24} />
              <div className="text-left">
                <h3 className="text-white font-medium">Vérifier le potentiel</h3>
                <p className="text-sm text-violet-300">Analyse rapide pour scalping</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode('collection')}
            className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 
                     flex items-center justify-between hover:bg-violet-800/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ListPlus className="text-violet-400" size={24} />
              <div className="text-left">
                <h3 className="text-white font-medium">Ajouter à ma collection</h3>
                <p className="text-sm text-violet-300">Enregistrer avec détails</p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Mode Scalping */}
      {mode === 'scalping' && (
        <div className="w-full max-w-md space-y-4">
          <div className="relative">
            <input
              type="number"
              value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
              placeholder="Prix en magasin"
              className="w-full px-4 py-3 bg-violet-900/20 backdrop-blur-sm rounded-lg border border-violet-800/50 
                       text-white placeholder-violet-400 appearance-none"
            />
            <button
              onClick={handleScalpingCheck}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 rounded-lg"
            >
              <Check size={20} className="text-white" />
            </button>
          </div>

          {retailPrice && scanResult.retailPrice && (
            <ScalpingScore
              retailPrice={scanResult.retailPrice}
              marketPrice={scanResult.marketPrice || 0}
            />
          )}
        </div>
      )}

      {/* Mode Collection */}
      {mode === 'collection' && (
        <div className="w-full max-w-md">
          <ProductEditForm
            barcode={scanResult.barcode}
            onClose={() => setMode(null)}
            onSave={(data: ProductEditData) => {
              console.log('Saving to collection:', data);
              // Logique de sauvegarde
              setMode(null);
            }}
          />
        </div>
      )}

      {/* Boutons de contrôle */}
      <div className="flex gap-4">
        {scanResult ? (
          <button
            onClick={resetScan}
            className="px-6 py-3 bg-violet-900/50 text-white rounded-lg hover:bg-violet-800/50 transition-colors"
          >
            Nouveau scan
          </button>
        ) : (
          <>
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
              >
                Démarrer le scan
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Arrêter
              </button>
            )}
          </>
        )}
      </div>

      {/* Instructions */}
      {isScanning && !scanResult && (
        <p className="text-violet-300 text-center">
          Placez le code-barres dans le cadre
        </p>
      )}
    </div>
  );
};