// app/scan/page.tsx
import React from 'react';
import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Scanner de codes-barres</h1>
        <BarcodeScanner />
      </div>
    </div>
  );
}