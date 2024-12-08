// components/scanner/BarcodeScanner.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Initialiser le scanner
    scannerRef.current = new Html5Qrcode("reader");

    // Cleanup
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
          aspectRatio: 1.0,
        },
        (decodedText) => {
          console.log("Code détecté !", decodedText);
          setScannedCode(decodedText);
          // Option : arrêter le scan après détection
          // stopScanning();
        },
        (errorMessage) => {
          // Ignorer les erreurs de scan en cours
          // console.error("Erreur de scan:", errorMessage);
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

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Zone de scan */}
      <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-black">
        <div 
          id="reader"
          className="w-full h-full"
        />
        
        {/* Overlay d'état */}
        {scannedCode && (
          <div className="absolute bottom-0 left-0 right-0 bg-violet-600 text-white p-4 text-center">
            <p className="font-medium">Code détecté :</p>
            <p className="font-mono">{scannedCode}</p>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm text-white p-4 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex gap-4">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium flex items-center gap-2"
          >
            <span>Démarrer le scan</span>
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <span>Arrêter</span>
          </button>
        )}
      </div>

      {/* Instructions */}
      {isScanning && !scannedCode && (
        <p className="text-violet-300 text-center">
          Placez un code-barres dans le cadre pour le scanner
        </p>
      )}
    </div>
  );
};