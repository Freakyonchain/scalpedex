'use client';

import React from 'react';
import { Camera, Info } from 'lucide-react';
import { useScanner } from '@/hooks/useScanner';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
}

export function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const { scanStatus, error, startScanning, stopScanning, lastResult } = useScanner({
    onScanSuccess: (result) => onScanSuccess(result.barcode)
  });
  
  const isActive = scanStatus === 'scanning';

  // Si un scan a été réalisé avec succès, ne plus afficher le scanner
  if (scanStatus === 'detected' && lastResult) {
    return null;
  }

  return (
    <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-violet-950/50 to-black/50 border border-violet-800/30">
      {/* Container du scanner */}
      <div id="reader" className="w-full h-full" />
      
      {/* État inactif */}
      {!isActive && (
        <button 
          onClick={startScanning}
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
      )}
      
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

          {/* Bouton stop */}
          <button
            onClick={stopScanning}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-violet-600 rounded-lg text-white"
          >
            Annuler
          </button>
        </>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <Info size={16} />
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}