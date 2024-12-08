// app/scan/page.tsx
import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';

export default function ScanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8 text-center">Scanner</h1>
      <BarcodeScanner />
    </div>
  );
}