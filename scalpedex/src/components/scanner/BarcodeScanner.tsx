// components/scanner/BarcodeScanner.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Check, ShoppingBag, ListPlus } from 'lucide-react';
import { toast } from 'sonner';
import { ScalpingScore } from './ScalpingScore';
import { QuickAddForm } from './QuickAddForm';

interface ScanResult {
  barcode: string;
  retailPrice?: number;
  marketPrice?: number;
}

interface CameraProps {
  onScan: (barcode: string) => void;
  onError: (error: string) => void;
  isActive: boolean;
}

// Composant séparé pour la partie caméra
const CameraScanner: React.FC<CameraProps> = ({ onScan, onError, isActive }) => {
  return (
    <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-black">
      <div id="reader" className="w-full h-full" />
      
      {isActive && (
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
        </div>
      )}
    </div>
  );
};

// Composant pour l'entrée manuelle
const ManualEntry: React.FC<{ onSubmit: (barcode: string) => void }> = ({ onSubmit }) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const isValidBarcode = (code: string) => /^\d{8,13}$/.test(code);

  const handleSubmit = () => {
    if (isValidBarcode(manualBarcode)) {
      onSubmit(manualBarcode);
      setManualBarcode('');
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-sm">
      <div className="flex-1">
        <input 
          type="text"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="Entrez le code-barres"
          className={`w-full px-4 py-3 bg-violet-900/20 backdrop-blur-sm rounded-lg border
                    ${!manualBarcode || isValidBarcode(manualBarcode) 
                      ? 'border-violet-800/50 focus:border-violet-600' 
                      : 'border-red-500/50 focus:border-red-500'} 
                    text-white placeholder-violet-400 transition-colors`}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!isValidBarcode(manualBarcode)}
        className={`px-4 py-3 rounded-lg font-medium transition-colors
                  ${isValidBarcode(manualBarcode)
                    ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                    : 'bg-violet-900/20 text-violet-400 cursor-not-allowed'}`}
      >
        Valider
      </button>
    </div>
  );
};

export const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'scalping' | 'collection' | null>(null);
  const [retailPrice, setRetailPrice] = useState<string>('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.warn);
      }
    };
  }, []);

  const handleBarcodeDetected = (barcode: string) => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    setScanResult({
      barcode,
      marketPrice: 64.99 // Simulé pour le POC
    });

    if (isScanning) {
      stopScanning();
    }
  };

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        handleBarcodeDetected,
        () => {}
      );

      setIsScanning(true);
      setError(null);
    } catch (err) {
      setError('Erreur d\'accès à la caméra. Vérifiez vos permissions.');
      setIsScanning(false);
    }
  };

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

  const resetScan = async () => {
    await stopScanning();
    setScanResult(null);
    setMode(null);
    setRetailPrice('');
    setShowQuickAdd(false);
    setError(null);
  };

  const handleQuickAdd = async (data: any) => {
    try {
      // Simuler l'ajout à la DB
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(
        data.quantity > 1 
          ? `${data.quantity} items ajoutés à la collection`
          : 'Item ajouté à la collection'
      );

      resetScan();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout à la collection');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <CameraScanner 
        onScan={handleBarcodeDetected}
        onError={setError}
        isActive={isScanning}
      />

{/* Actions post-scan */}
{scanResult && !mode && !showQuickAdd && (
  <div className="w-full max-w-md space-y-4 animate-fadeIn">
    {/* Affichage du code-barres */}
    <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
      <div className="flex items-center gap-2">
        <span className="text-violet-400 text-sm">Code-barres détecté :</span>
        <code className="flex-1 font-mono text-white bg-black/20 px-3 py-1.5 rounded">
          {scanResult.barcode}
        </code>
      </div>
    </div>

    {/* Boutons d'action existants */}
    <button
      onClick={() => setMode('scalping')}
      className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 
               flex items-center gap-3 hover:bg-violet-800/20 transition-colors"
    >
      <ShoppingBag className="text-violet-400" size={24} />
      <div>
        <h3 className="text-white font-medium">Scalping Check</h3>
        <p className="text-sm text-violet-300">Analyse rapide du potentiel</p>
      </div>
    </button>

    <button
      onClick={() => setShowQuickAdd(true)}
      className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 
               flex items-center gap-3 hover:bg-violet-800/20 transition-colors"
    >
      <ListPlus className="text-violet-400" size={24} />
      <div>
        <h3 className="text-white font-medium">Quick Add</h3>
        <p className="text-sm text-violet-300">Ajout rapide à la collection</p>
      </div>
    </button>
  </div>
)}

      {/* Formulaires modaux */}
      {showQuickAdd && scanResult && (
        <QuickAddForm
          barcode={scanResult.barcode}
          onClose={resetScan}
          onSave={handleQuickAdd}
          onDetailedEdit={() => {
            setShowQuickAdd(false);
            setMode('collection');
          }}
        />
      )}

      {mode === 'scalping' && scanResult && (
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
              onClick={() => {
                if (retailPrice) {
                  setScanResult(prev => ({
                    ...prev!,
                    retailPrice: parseFloat(retailPrice)
                  }));
                }
              }}
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

      {/* Contrôles principaux */}
      <div className="fixed bottom-20 left-0 right-0 p-4 flex flex-col items-center gap-4 bg-gradient-to-t from-black to-transparent">
        {!scanResult ? (
          <>
            <button
              onClick={isScanning ? stopScanning : startScanning}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors
                       ${isScanning 
                         ? 'bg-red-600 hover:bg-red-700' 
                         : 'bg-violet-600 hover:bg-violet-700'} text-white`}
            >
              <Camera size={20} />
              {isScanning ? 'Arrêter' : 'Démarrer le scan'}
            </button>
            
            <ManualEntry onSubmit={handleBarcodeDetected} />
          </>
        ) : (
          <button
            onClick={resetScan}
            className="px-6 py-3 bg-violet-900/50 text-white rounded-lg hover:bg-violet-800/50 transition-colors"
          >
            Nouveau scan
          </button>
        )}
      </div>
    </div>
  );
};