'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Check, ShoppingBag, ListPlus, Info, AlertCircle } from 'lucide-react';
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

// Composant pour l'overlay d'informations
const InfoOverlay = () => (
  <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
    <div className="flex items-center gap-2 text-violet-300 text-sm">
      <Info size={16} />
      <p>Placez le code-barres dans le cadre</p>
    </div>
  </div>
);

//Quand le scanner est inactif
const InactiveScannerState = ({ onStart }: { onStart: () => void }) => (
  <button 
    onClick={onStart}
    className="absolute inset-0 flex flex-col items-center justify-center gap-4 
               bg-violet-900/10 backdrop-blur-sm group
               hover:bg-violet-900/20 transition-all"
  >
    <div className="w-24 h-24 rounded-full bg-violet-900/20 flex items-center justify-center 
                  border border-violet-800/50 group-hover:bg-violet-800/50 
                  group-hover:scale-105 transition-all">
      <Camera size={40} className="text-violet-400 group-hover:text-violet-300" />
    </div>
    <p className="text-violet-300 text-center px-6 group-hover:text-violet-200">
      Scanner un code barre
    </p>
  </button>
);

// Composant pour le scanner de caméra
const CameraScanner: React.FC<CameraProps> = ({ onScan, onError, isActive }) => {
  return (
    <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-violet-950/50 to-black/50 border border-violet-800/30">
      {/* Container du scanner */}
      <div id="reader" className="w-full h-full" />
      
      {/* État inactif */}
      {!isActive && <InactiveScannerState />}
      
      {/* Overlay d'informations pendant le scan */}
      {isActive && (
        <>
          <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2 text-violet-300 text-sm">
              <Info size={16} />
              <p>Placez le code-barres dans le cadre</p>
            </div>
          </div>
          
          {/* Guide visuel de scan */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72">
              {/* Ligne de scan */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500 animate-scan" />
              
              {/* Cadre de scan */}
              <div className="absolute inset-0 border-2 border-violet-500/30 rounded-lg">
                {/* Coins */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-violet-500 rounded-tl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-violet-500 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-violet-500 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-violet-500 rounded-br" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Composant d'entrée manuelle
const ManualEntry = ({ onSubmit }: { onSubmit: (barcode: string) => void }) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const isValidBarcode = (code: string) => /^\d{8,13}$/.test(code);

  const handleSubmit = () => {
    if (isValidBarcode(manualBarcode)) {
      onSubmit(manualBarcode);
      setManualBarcode('');
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-md">
      <div className="flex-1">
        <input 
          type="text"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="Code-barres manuel"
          className={`w-full px-4 py-3 bg-violet-900/20 backdrop-blur-sm rounded-xl 
                     border ${!manualBarcode || isValidBarcode(manualBarcode) 
                       ? 'border-violet-800/50 focus:border-violet-600' 
                       : 'border-red-500/50 focus:border-red-500'} 
                     text-white placeholder-violet-400 transition-colors`}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!isValidBarcode(manualBarcode)}
        className={`px-6 rounded-xl font-medium transition-colors
                   ${isValidBarcode(manualBarcode)
                     ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                     : 'bg-violet-900/20 text-violet-400 cursor-not-allowed'}`}
      >
        Scanner
      </button>
    </div>
  );
};

// Composant d'erreur
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="w-full max-w-md p-4 bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-800/50">
    <div className="flex items-center gap-2 text-red-400">
      <AlertCircle size={20} />
      <p>{message}</p>
    </div>
  </div>
);

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
      marketPrice: 64.99 // Prix simulé pour le POC
    });

    if (isScanning) {
      stopScanning();
    }

    toast.success('Code-barres détecté', {
      description: barcode,
    });
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
      setError("Impossible d'accéder à la caméra. Vérifiez vos permissions.");
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
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(
        data.quantity > 1 
          ? `${data.quantity} items ajoutés à la collection`
          : 'Item ajouté à la collection'
      );
      resetScan();
    } catch (error) {
      toast.error("Erreur lors de l'ajout à la collection");
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto space-y-6 p-4">
        {/* Zone de scan */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden 
                      bg-gradient-to-b from-violet-950/50 to-black/50 
                      border border-violet-800/30">
          <div id="reader" className="w-full h-full" />
          
          {/* État inactif interactif */}
          {!isScanning && !scanResult && (
            <InactiveScannerState onStart={startScanning} />
          )}
          
          {/* Overlay actif et guides de scan */}
          {isScanning && (
            <>
              <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-2 text-violet-300 text-sm">
                  <Info size={16} />
                  <p>Placez le code-barres dans le cadre</p>
                </div>
              </div>
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500 animate-scan" />
                  <div className="absolute inset-0 border-2 border-violet-500/30 rounded-lg">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-violet-500 rounded-tl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-violet-500 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-violet-500 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-violet-500 rounded-br" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Affichage des résultats et actions */}
        {scanResult && !mode && !showQuickAdd && (
          <div className="space-y-4">
            {/* Code détecté */}
            <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
              <div className="flex items-center gap-2">
                <span className="text-violet-400 text-sm">Code-barres détecté :</span>
                <code className="flex-1 font-mono text-white bg-black/20 px-3 py-1.5 rounded-lg">
                  {scanResult.barcode}
                </code>
              </div>
            </div>

            {/* Actions */}
            <div className="grid gap-3">
              <button
                onClick={() => setMode('scalping')}
                className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl 
                         border border-violet-800/50 flex items-center gap-3 
                         hover:bg-violet-800/20 transition-colors group"
              >
                <ShoppingBag className="text-violet-400 group-hover:text-violet-300" size={24} />
                <div>
                  <h3 className="text-white font-medium">Scalping Check</h3>
                  <p className="text-sm text-violet-300">Analyse rapide du potentiel</p>
                </div>
              </button>

              <button
                onClick={() => setShowQuickAdd(true)}
                className="w-full p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl 
                         border border-violet-800/50 flex items-center gap-3 
                         hover:bg-violet-800/20 transition-colors group"
              >
                <ListPlus className="text-violet-400 group-hover:text-violet-300" size={24} />
                <div>
                  <h3 className="text-white font-medium">Quick Add</h3>
                  <p className="text-sm text-violet-300">Ajout rapide à la collection</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Affichage des erreurs */}
        {error && <ErrorDisplay message={error} />}

        {/* Autres composants modaux et conditionnels */}
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
          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                placeholder="Prix en magasin"
                className="w-full px-4 py-3 bg-violet-900/20 backdrop-blur-sm rounded-xl 
                         border border-violet-800/50 text-white placeholder-violet-400 
                         appearance-none"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 
                         bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
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

        {/* Bouton de reset */}
        {scanResult && (
          <button
            onClick={resetScan}
            className="w-full py-3 px-6 bg-violet-900/50 text-white rounded-xl 
                     hover:bg-violet-800/50 transition-colors"
          >
            Nouveau scan
          </button>
        )}
      </div>
    </div>
  );
};