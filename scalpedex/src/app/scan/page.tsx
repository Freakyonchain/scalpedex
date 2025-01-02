// app/scan/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Search, Sparkles, HelpCircle, ArrowDown, ShoppingBag, ListPlus } from 'lucide-react';
import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';
import { ManualEntry } from '@/components/scanner/ManualEntry';
import { FloatingTip } from '@/components/ui/floating-tip';
import { QuickAddForm } from '@/components/scanner/QuickAddForm';
import { toast } from 'sonner';

interface ScanResult {
  barcode: string;
  marketPrice?: number;
}

export default function ScanPage() {
  // États
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTips, setShowTips] = useState(true); // Valeur par défaut simple
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [mode, setMode] = useState<'scalping' | 'collection' | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Effet pour vérifier localStorage après le montage
  useEffect(() => {
    const hasSeenTips = localStorage.getItem('hasSeenScanTips');
    if (hasSeenTips) {
      setShowTips(false);
    }
  }, []);
  
  // Tips data
  const tips = [
    {
      icon: <Scan className="text-violet-400" size={20} />,
      title: "Scanner rapidement",
      description: "Pointez votre caméra vers le code-barres pour analyser instantanément le produit.",
    },
    {
      icon: <Search className="text-violet-400" size={20} />,
      title: "Vérifier le potentiel",
      description: "Comparez directement avec les prix du marché pour évaluer la rentabilité.",
    },
    {
      icon: <Sparkles className="text-violet-400" size={20} />,
      title: "Gérer sa collection",
      description: "Ajoutez facilement vos achats à votre collection pour suivre leur évolution.",
    }
  ];

  // Handlers
  const handleBarcodeDetected = useCallback((barcode: string) => {
    if (isScanning) {
      setIsScanning(false);
    }
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    toast.success('Code-barres détecté !', {
      description: barcode,
    });
    
    setScanResult({
      barcode,
      marketPrice: 64.99
    });
  }, [isScanning]);

  const handleTipComplete = useCallback(() => {
    setShowTips(false);
    localStorage.setItem('hasSeenScanTips', 'true');
  }, []);

  const handleTipNext = useCallback(() => {
    setCurrentTipIndex(prev => {
      if (prev === tips.length - 1) {
        handleTipComplete();
        return prev;
      }
      return prev + 1;
    });
  }, [tips.length, handleTipComplete]);

  return (
    <div className="relative min-h-screen bg-grid-violet/5">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-black/50 to-black pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />
      
      <div className="container relative mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Scanner</h1>
          <p className="text-violet-300 max-w-md mx-auto">
            Scannez vos cartes pour analyser leur potentiel ou enrichir votre collection ✨
          </p>
          
          <button
            onClick={() => setShowTips(true)}
            className="absolute -right-8 top-0 p-2 text-violet-400 hover:text-violet-300 transition-colors rounded-full hover:bg-violet-500/10"
            title="Voir le guide"
          >
            <HelpCircle size={20} />
          </button>
        </motion.div>

        {/* Zone principale: Résultat ou Interface de scan */}
        <AnimatePresence mode="wait">
          {scanResult && !mode && !showQuickAdd ? (
            // Résultat du scan
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md space-y-4"
            >
              {/* Code détecté avec effet de succès */}
              <div className="relative overflow-hidden bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-6">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-violet-300 text-sm">Code-barres détecté</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-400 text-sm">Succès</span>
                    </div>
                  </div>
                  <div className="font-mono text-xl text-white bg-black/20 px-4 py-3 rounded-lg text-center mb-4">
                    {scanResult.barcode}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMode('scalping')}
                      className="relative group overflow-hidden rounded-xl bg-violet-600 p-4 transition-all hover:bg-violet-500"
                    >
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <ShoppingBag className="text-white" size={24} />
                        <span className="text-white font-medium">Scalping Check</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-violet-400/0 via-violet-400/10 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={() => setShowQuickAdd(true)}
                      className="relative group overflow-hidden rounded-xl bg-violet-900/50 p-4 transition-all hover:bg-violet-800/50"
                    >
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <ListPlus className="text-violet-300 group-hover:text-white" size={24} />
                        <span className="text-violet-300 group-hover:text-white font-medium">Quick Add</span>
                      </div>
                    </button>
                  </div>
                </div>
                {/* Effet de glow en arrière-plan */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/20 rounded-full blur-3xl" />
              </div>

              {/* Bouton pour recommencer */}
              <button
                onClick={() => setScanResult(null)}
                className="w-full py-3 text-violet-400 hover:text-white transition-colors text-sm"
              >
                Scanner un autre produit
              </button>
            </motion.div>
          ) : (
            // Interface de scan normale
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-6"
            >
              {/* Zone d'entrée manuelle */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-sm"
              >
                <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/30 p-4">
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 text-sm text-violet-300">
                      <Search size={16} />
                      <span>Pas de caméra ? Entrez le code manuellement</span>
                    </label>
                    <ManualEntry onSubmit={handleBarcodeDetected} />
                  </div>
                </div>
              </motion.div>

              {/* Transition visuelle */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="text-violet-400/60 text-sm">ou</div>
                <ArrowDown className="text-violet-400/60 w-4 h-4 animate-bounce" />
              </motion.div>

              {/* Scanner */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  width: isScanning ? '100%' : '85%'
                }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-full max-w-md relative"
              >
                <BarcodeScanner 
                  onScanningChange={setIsScanning} 
                  onBarcodeDetected={handleBarcodeDetected}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenu selon le mode (Scalping ou Quick Add) */}
        <AnimatePresence>
          {mode === 'scalping' && scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md">
                <ScalpingScore retailPrice={0} marketPrice={scanResult.marketPrice || 0} />
                <button
                  onClick={() => setMode(null)}
                  className="w-full mt-4 py-3 bg-violet-900/50 text-white rounded-xl hover:bg-violet-800/50 transition-colors"
                >
                  Retour
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

{/* Quick Add Modal */}
<AnimatePresence>
  {showQuickAdd && scanResult && (
    <QuickAddForm
      barcode={scanResult.barcode}
      onClose={() => {
        setShowQuickAdd(false);
        setScanResult(null);
      }}
      onSave={async (data) => {
        try {
          const response = await fetch('/api/collection', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de l\'ajout à la collection');
          }

          await response.json();
          toast.success('Ajouté à la collection !');
          setShowQuickAdd(false);
          setScanResult(null);
        } catch (error: any) {
          console.error('Error saving to collection:', error);
          toast.error(error.message || 'Erreur lors de l\'ajout à la collection');
          throw error; // On propage l'erreur pour que QuickAddForm puisse la gérer
        }
      }}
      onDetailedEdit={() => {
        setShowQuickAdd(false);
        setMode('collection');
      }}
    />
  )}
</AnimatePresence>

        {/* Tips flottants */}
        <AnimatePresence>
          {showTips && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 left-4 right-4 z-50"
            >
              <FloatingTip
                icon={tips[currentTipIndex].icon}
                title={tips[currentTipIndex].title}
                description={tips[currentTipIndex].description}
                currentStep={currentTipIndex + 1}
                totalSteps={tips.length}
                onNext={handleTipNext}
                onSkip={handleTipComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}