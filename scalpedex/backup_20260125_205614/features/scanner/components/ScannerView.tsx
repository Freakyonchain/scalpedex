// Ce composant est un Server Component qui agit comme le point d'entrée de la feature
import React from 'react';
import { Suspense } from 'react';
import { ClientScannerView } from './ClientScannerView';

export default function ScannerView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 to-black p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Scanner</h1>
        <p className="text-violet-300 text-center mb-8">
          Scannez vos cartes pour analyser leur potentiel ou enrichir votre collection ✨
        </p>
        
        <Suspense fallback={<ScannerSkeleton />}>
          <ClientScannerView />
        </Suspense>
      </div>
    </div>
  );
}

function ScannerSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="w-full aspect-square rounded-xl bg-violet-900/20"></div>
      <div className="h-10 bg-violet-900/20 rounded-lg"></div>
    </div>
  );
}