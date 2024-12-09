// components/scanner/BarcodeScanner.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ShoppingBag, ListPlus, Check, X, Camera } from 'lucide-react';
import { ScalpingScore } from './ScalpingScore';
import { QuickAddForm } from './QuickAddForm';
import { toast } from 'sonner'; // Pour les notifications

interface ScanResult {
  barcode: string;
  retailPrice?: number;
  marketPrice?: number;
}

interface QuickAddData {
  barcode: string;
  purchasePrice: number;
  condition: string;
  quantity: number;
  purchaseDate: Date;
}

export const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'scalping' | 'collection' | null>(null);
  const [retailPrice, setRetailPrice] = useState<string>('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
 
  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.warn('Erreur lors de l\'arrêt du scanner:', err);
      }
      setIsScanning(false);
    }
  };
 
  const startScanning = async () => {
    if (!scannerRef.current) return;
 
    try {
      await stopScanning();
      await new Promise(resolve => setTimeout(resolve, 100));
 
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        },
        (decodedText) => {
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
 
          setScanResult({
            barcode: decodedText,
            marketPrice: 64.99
          });
          
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
      setIsScanning(false);
    }
  };
 
  const handleQuickAdd = async (data: QuickAddData) => {
    try {
      console.log(`Ajout de ${data.quantity} item(s) à la collection:`, {
        barcode: data.barcode,
        purchasePrice: data.purchasePrice,
        condition: data.condition,
        purchaseDate: data.purchaseDate
      });
 
      await new Promise(resolve => setTimeout(resolve, 500));
 
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
 
      toast.success(
        data.quantity > 1 
          ? `${data.quantity} items ajoutés à la collection`
          : 'Item ajouté à la collection'
      );
 
      setShowQuickAdd(false);
      await resetScan();
      await new Promise(resolve => setTimeout(resolve, 500));
      startScanning();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout à la collection');
    }
  };
 
  const handleScalpingCheck = () => {
    if (!retailPrice) return;
    setScanResult(prev => ({
      ...prev!,
      retailPrice: parseFloat(retailPrice)
    }));
  };
 
  const resetScan = async () => {
    await stopScanning();
    setScanResult(null);
    setMode(null);
    setRetailPrice('');
    setShowQuickAdd(false);
    setError(null);
  };
 
  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.warn);
      }
    };
  }, []);
 
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-black">
        <div id="reader" className="w-full h-full" />
        
        {isScanning && !scanResult && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500 animate-scan" />
              
              <div className="absolute inset-0 border-2 border-violet-500/20 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-violet-500 rounded-tl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-violet-500 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-violet-500 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-violet-500 rounded-br" />
              </div>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-violet-300 text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
                Centrez le code-barres
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm text-white p-4 text-center">
            <div className="bg-black/50 p-4 rounded-lg">
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={resetScan}
                className="px-4 py-2 bg-red-600 rounded-lg text-sm"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}
      </div>
 
      {scanResult && !mode && !showQuickAdd && (
        <div className="w-full max-w-md space-y-4 animate-fadeIn">
          <button
            onClick={() => setMode('scalping')}
            className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 
                     flex items-center justify-between hover:bg-violet-800/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-violet-400" size={24} />
              <div className="text-left">
                <h3 className="text-white font-medium">Scalping Check</h3>
                <p className="text-sm text-violet-300">Analyse rapide du potentiel</p>
              </div>
            </div>
          </button>
 
          <button
            onClick={() => setShowQuickAdd(true)}
            className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 
                     flex items-center justify-between hover:bg-violet-800/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ListPlus className="text-violet-400" size={24} />
              <div className="text-left">
                <h3 className="text-white font-medium">Quick Add</h3>
                <p className="text-sm text-violet-300">Ajout rapide à la collection</p>
              </div>
            </div>
          </button>
        </div>
      )}
 
      {showQuickAdd && scanResult && (
        <QuickAddForm
          barcode={scanResult.barcode}
          onClose={() => {
            setShowQuickAdd(false);
            resetScan();
          }}
          onSave={handleQuickAdd}
          onDetailedEdit={() => {
            setShowQuickAdd(false);
            setMode('collection');
          }}
        />
      )}
 
      {mode === 'scalping' && (
        <div className="w-full max-w-md space-y-4 animate-fadeIn">
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
 
      <div className="fixed bottom-20 left-0 right-0 p-4 flex justify-center gap-4 bg-gradient-to-t from-black to-transparent">
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
                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium flex items-center gap-2"
              >
                <Camera size={20} />
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
    </div>
  );
 };