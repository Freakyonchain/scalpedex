'use client';

import { useState, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanResult, ScanStatus } from '../types/scanner-types';
import { toast } from 'sonner';

interface UseScannerOptions {
  onScanSuccess?: (result: ScanResult) => void;
  elementId?: string;
}

export function useScanner({ onScanSuccess, elementId = 'reader' }: UseScannerOptions = {}) {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialiser le scanner
  useEffect(() => {
    const scannerInstance = new Html5Qrcode(elementId);
    setScanner(scannerInstance);

    // Nettoyer à la fin
    return () => {
      if (scannerInstance && scanStatus === 'scanning') {
        scannerInstance.stop().catch(console.warn);
      }
    };
  }, [elementId]);

  // Callback quand un code-barres est détecté
  const handleScanSuccess = useCallback((decodedText: string) => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    const result: ScanResult = {
      barcode: decodedText,
      timestamp: Date.now()
    };

    setLastResult(result);
    setScanStatus('detected');

    // Notifier l'UI
    toast.success('Code-barres détecté', {
      description: decodedText,
    });

    // Callback externe si fourni
    if (onScanSuccess) {
      onScanSuccess(result);
    }

    // Arrêter le scan
    if (scanner && scanStatus === 'scanning') {
      scanner.stop().catch(console.warn);
    }
  }, [scanner, scanStatus, onScanSuccess]);

  // Démarrer le scan
  const startScanning = useCallback(async () => {
    if (!scanner) return;

    try {
      setError(null);
      setScanStatus('scanning');

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        handleScanSuccess,
        () => {} // Ignorer les erreurs intermédiaires
      );
    } catch (err: any) {
      setError("Impossible d'accéder à la caméra. Vérifiez vos permissions.");
      setScanStatus('error');
      console.error('Scanner error:', err);
    }
  }, [scanner, handleScanSuccess]);

  // Arrêter le scan
  const stopScanning = useCallback(async () => {
    if (scanner && scanStatus === 'scanning') {
      try {
        await scanner.stop();
        setScanStatus('idle');
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
  }, [scanner, scanStatus]);

  // Scan manuel
  const scanManually = useCallback((barcode: string) => {
    handleScanSuccess(barcode);
  }, [handleScanSuccess]);

  // Reset tout
  const resetScan = useCallback(() => {
    stopScanning();
    setLastResult(null);
    setError(null);
    setScanStatus('idle');
  }, [stopScanning]);

  return {
    scanStatus,
    lastResult,
    error,
    startScanning,
    stopScanning,
    scanManually,
    resetScan
  };
}