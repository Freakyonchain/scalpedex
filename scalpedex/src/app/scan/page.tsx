'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Search,
  Zap,
  Camera,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  X,
  Plus,
  Check,
  Target,
  DollarSign,
  Loader2,
  Clock
} from 'lucide-react';
import { useScanner } from '@/hooks/useScanner';
import { useProductData } from '@/hooks/useProductData';
import { logScan, getRecentScans } from '@/app/actions/scan-actions';
import { addToCollection } from '@/app/actions/collection-actions';
import type { ProductWithPrice } from '@/app/actions/scan-actions';
import { toast } from 'sonner';

// ============================================
// TYPES
// ============================================
type Condition = 'FACTORY_SEALED' | 'CUSTOM_SEALED' | 'MINT' | 'NEAR_MINT' | 'PLAYED';

const CONDITIONS: Record<Condition, string> = {
  FACTORY_SEALED: 'Scelle Usine',
  CUSTOM_SEALED: 'Scelle Custom',
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  PLAYED: 'Joue'
};

interface ScalpScore {
  score: number;
  profit: number;
  profitPercent: number;
  recommendation: string;
  color: string;
}

// ============================================
// SCANNER INTERFACE (Camera)
// ============================================
function ScannerInterface({ onBarcodeDetected }: { onBarcodeDetected: (barcode: string) => void }) {
  const { scanStatus, error, startScanning, stopScanning } = useScanner({
    onScanSuccess: (result) => {
      onBarcodeDetected(result.barcode);
    },
    elementId: 'reader'
  });

  const isActive = scanStatus === 'scanning';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Scanner Frame */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Camera reader container */}
        <div
          id="reader"
          className={`w-full ${isActive ? 'min-h-[300px]' : 'hidden'}`}
        />

        {/* Inactive State - show camera button */}
        {!isActive && (
          <div className="aspect-square w-full">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-profit/5" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
            </div>

            <motion.button
              onClick={startScanning}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="relative"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-profit/30 blur-3xl rounded-full scale-150" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-profit/20 to-profit/5 border-2 border-profit/30 flex items-center justify-center group-hover:border-profit/50 transition-all">
                  <Camera size={48} strokeWidth={1.5} className="text-profit" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border border-profit/30"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-profit/30"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>

              <div className="text-center relative z-10">
                <p className="text-white font-semibold text-lg mb-1">Activer la camera</p>
                <p className="text-zinc-500 text-sm">Scannez un code-barres Pokemon</p>
              </div>
            </motion.button>
          </div>
        )}

        {/* Active Controls */}
        {isActive && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={stopScanning}
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-zinc-300 text-sm font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
            >
              <X size={16} />
              Annuler
            </motion.button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-loss/20 border border-loss/30 backdrop-blur-sm rounded-xl"
        >
          <p className="text-loss text-sm text-center flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {error}
          </p>
        </motion.div>
      )}

      {/* HUD Corners */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-lg pointer-events-none" />
    </motion.div>
  );
}

// ============================================
// MANUAL ENTRY
// ============================================
function ManualEntry({ onSubmit }: { onSubmit: (barcode: string) => void }) {
  const [barcode, setBarcode] = useState('');
  const isValid = /^\d{8,13}$/.test(barcode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(barcode);
      setBarcode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ''))}
          placeholder="Entrez le code-barres..."
          className="w-full h-12 pl-11 pr-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>
      <motion.button
        type="submit"
        disabled={!isValid}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-violet-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Zap size={20} className="text-white" />
      </motion.button>
    </form>
  );
}

// ============================================
// SCALP CALCULATOR
// ============================================
function ScalpCalculator({ marketPrice, retailPrice, onChange }: {
  marketPrice: number;
  retailPrice: string;
  onChange: (value: string) => void;
}) {
  const calculateScore = useCallback((): ScalpScore | null => {
    const price = parseFloat(retailPrice);
    if (isNaN(price) || price <= 0) return null;

    const profit = marketPrice - price;
    const profitPercent = (profit / price) * 100;

    let score: number;
    let recommendation: string;
    let color: string;

    if (profitPercent >= 50) {
      score = 90 + Math.min(10, (profitPercent - 50) / 5);
      recommendation = 'ACHETER IMMEDIATEMENT';
      color = 'profit';
    } else if (profitPercent >= 25) {
      score = 70 + ((profitPercent - 25) / 25) * 20;
      recommendation = 'Excellente opportunite';
      color = 'profit';
    } else if (profitPercent >= 10) {
      score = 50 + ((profitPercent - 10) / 15) * 20;
      recommendation = 'Profit modere';
      color = 'warning';
    } else if (profitPercent > 0) {
      score = 30 + (profitPercent / 10) * 20;
      recommendation = 'Marge faible';
      color = 'warning';
    } else {
      score = Math.max(0, 30 + profitPercent);
      recommendation = 'Non rentable';
      color = 'loss';
    }

    return { score: Math.round(score), profit, profitPercent, recommendation, color };
  }, [marketPrice, retailPrice]);

  const score = calculateScore();

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
          Prix en magasin
        </label>
        <div className="relative">
          <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="number"
            placeholder="0.00"
            value={retailPrice}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-12 pl-11 pr-12 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-primary/50 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">EUR</span>
        </div>
      </div>

      {/* Score Display */}
      {score && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4"
        >
          {/* Score Circle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Score Scalp</p>
              <p className={`text-3xl font-bold font-mono ${
                score.color === 'profit' ? 'text-profit' :
                score.color === 'warning' ? 'text-warning' : 'text-loss'
              }`}>
                {score.score}
              </p>
            </div>

            {/* Score Ring */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-white/10" />
                <motion.circle
                  cx="32" cy="32" r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  className={score.color === 'profit' ? 'text-profit' : score.color === 'warning' ? 'text-warning' : 'text-loss'}
                  initial={{ strokeDasharray: '0 176' }}
                  animate={{ strokeDasharray: `${(score.score / 100) * 176} 176` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </svg>
            </div>
          </div>

          {/* Profit Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Profit</p>
              <p className={`text-lg font-bold font-mono ${score.profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {score.profit >= 0 ? '+' : ''}{score.profit.toFixed(2)}EUR
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">ROI</p>
              <p className={`text-lg font-bold font-mono ${score.profitPercent >= 0 ? 'text-profit' : 'text-loss'}`}>
                {score.profitPercent >= 0 ? '+' : ''}{score.profitPercent.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-3 rounded-lg text-center font-semibold ${
            score.color === 'profit' ? 'bg-profit/10 text-profit' :
            score.color === 'warning' ? 'bg-warning/10 text-warning' : 'bg-loss/10 text-loss'
          }`}>
            {score.recommendation}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// PRODUCT RESULT
// ============================================
function ProductResult({
  product,
  onReset,
  scannedBarcode
}: {
  product: ProductWithPrice;
  onReset: () => void;
  scannedBarcode: string;
}) {
  const [retailPrice, setRetailPrice] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<Condition>('FACTORY_SEALED');
  const [quantity, setQuantity] = useState(1);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const marketPrice = product.current_price ?? product.msrp ?? 0;

  // Log the scan when the product is first shown
  useEffect(() => {
    logScan({
      barcode: scannedBarcode,
      productId: product.id,
    }).catch(console.error);
  }, [scannedBarcode, product.id]);

  const handleAddToCollection = async () => {
    const price = parseFloat(retailPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Entrez un prix d\'achat valide');
      return;
    }

    setIsAdding(true);
    try {
      const result = await addToCollection({
        productId: product.id,
        purchasePrice: price,
        condition: selectedCondition,
        quantity,
      });

      if (result.success) {
        toast.success('Produit ajoute a la collection!');
        setShowAddPanel(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Product Info Card */}
      <div className="relative p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50 rounded-tl" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50 rounded-tr" />

        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package size={32} className="text-zinc-600" strokeWidth={1} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-primary/20 text-primary">
                {product.type}
              </span>
              {product.trend === 'up' && (
                <span className="flex items-center gap-0.5 text-[9px] font-semibold text-profit">
                  <TrendingUp size={10} /> Hausse
                </span>
              )}
              {product.trend === 'down' && (
                <span className="flex items-center gap-0.5 text-[9px] font-semibold text-loss">
                  <TrendingDown size={10} /> Baisse
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
              {product.name}
            </h3>
            {product.set_name && (
              <p className="text-xs text-zinc-400 mb-1">{product.set_name}</p>
            )}
            <p className="text-xs text-zinc-500 font-mono">{product.ean || scannedBarcode}</p>
          </div>
        </div>

        {/* Price Info */}
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">MSRP</p>
            <p className="text-sm font-semibold text-zinc-400 font-mono">
              {product.msrp ? `${product.msrp.toFixed(2)}EUR` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Prix Marche</p>
            <p className="text-lg font-bold text-profit font-mono">
              {product.current_price ? `${product.current_price.toFixed(2)}EUR` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Volume 24h</p>
            <p className="text-sm font-semibold text-white font-mono">
              {product.volume_24h ?? 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Scalp Calculator */}
      {marketPrice > 0 && (
        <div className="p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-md bg-profit/10">
              <Target size={16} className="text-profit" />
            </div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Calculateur</h3>
          </div>

          <ScalpCalculator
            marketPrice={marketPrice}
            retailPrice={retailPrice}
            onChange={setRetailPrice}
          />
        </div>
      )}

      {/* Quick Add Panel */}
      <AnimatePresence>
        {showAddPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/5 space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Plus size={16} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Ajouter a ma collection</h3>
            </div>

            {/* Purchase price (required for collection) */}
            {!retailPrice && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Prix d&apos;achat</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(e.target.value)}
                    className="w-full h-12 pl-11 pr-12 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">EUR</span>
                </div>
              </div>
            )}

            {/* Condition */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Condition</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CONDITIONS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setSelectedCondition(value as Condition)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCondition === value
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Quantite</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-bold text-white font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Confirm */}
            <button
              onClick={handleAddToCollection}
              disabled={isAdding || !retailPrice}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-profit to-emerald-400 text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAdding ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {isAdding ? 'Ajout...' : `Ajouter (${quantity}x)`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-semibold hover:bg-white/10 transition-colors"
        >
          Nouveau scan
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddPanel(!showAddPanel)}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-profit to-emerald-400 text-black font-semibold flex items-center justify-center gap-2"
        >
          <Package size={18} />
          {showAddPanel ? 'Masquer' : 'Ajouter'}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// RECENT SCANS
// ============================================
function RecentScans({ onSelect }: { onSelect: (barcode: string) => void }) {
  const [scans, setScans] = useState<Array<{
    id: string;
    barcode: string;
    product_name: string | null;
    calculated_score: number | null;
    created_at: string;
  }>>([]);

  useEffect(() => {
    async function loadScans() {
      const result = await getRecentScans(5);
      if (result.success && result.data) {
        setScans(result.data.scans);
      }
    }
    loadScans();
  }, []);

  if (scans.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Clock size={12} className="text-zinc-500" />
        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Scans recents</p>
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {scans.map((scan) => (
          <button
            key={scan.id}
            onClick={() => onSelect(scan.barcode)}
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors group"
          >
            <p className="text-xs font-medium text-white group-hover:text-primary transition-colors truncate max-w-[120px]">
              {scan.product_name || scan.barcode}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">{scan.barcode.slice(-6)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// LOADING PRODUCT
// ============================================
function LoadingProduct() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={32} className="text-primary" />
      </motion.div>
      <p className="text-zinc-400 text-sm">Recherche du produit...</p>
    </motion.div>
  );
}

// ============================================
// PRODUCT NOT FOUND
// ============================================
function ProductNotFound({ barcode, onReset }: { barcode: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/5 text-center space-y-4"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-warning/10 flex items-center justify-center">
        <AlertCircle size={32} className="text-warning" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Produit non reconnu</h3>
        <p className="text-zinc-500 text-sm">
          Le code-barres <span className="font-mono text-zinc-400">{barcode}</span> n&apos;est pas encore dans notre base de donnees.
        </p>
      </div>
      <button
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-semibold hover:bg-white/10 transition-colors"
      >
        Nouveau scan
      </button>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function ScanPage() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const { product, loading, error } = useProductData(scannedBarcode);

  const handleBarcodeDetected = (barcode: string) => {
    setScannedBarcode(barcode);
  };

  const handleReset = () => {
    setScannedBarcode(null);
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-32">
      <div className="max-w-md mx-auto space-y-6">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
            <Scan size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Scanner</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {product ? 'Produit detecte' : loading ? 'Recherche en cours...' : 'Analysez vos trouvailles'}
          </h1>
          <p className="text-zinc-500 text-sm">
            {product ? 'Calculez le potentiel de profit' : loading ? 'Interrogation de la base de donnees' : 'Scannez ou entrez un code-barres'}
          </p>
        </motion.header>

        {/* Content */}
        {loading ? (
          <LoadingProduct />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-loss/10 border border-loss/20 text-center"
          >
            <p className="text-loss text-sm">{error}</p>
            <button
              onClick={handleReset}
              className="mt-3 px-4 py-2 rounded-lg bg-white/5 text-zinc-400 text-sm hover:bg-white/10 transition-colors"
            >
              Reessayer
            </button>
          </motion.div>
        ) : product ? (
          <ProductResult product={product} onReset={handleReset} scannedBarcode={scannedBarcode!} />
        ) : scannedBarcode ? (
          <ProductNotFound barcode={scannedBarcode} onReset={handleReset} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Manual Entry */}
            <div className="p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-md bg-white/5">
                  <Search size={14} className="text-zinc-400" />
                </div>
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Entree manuelle</span>
              </div>
              <ManualEntry onSubmit={handleBarcodeDetected} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-xs text-zinc-600 uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Camera Scanner */}
            <ScannerInterface onBarcodeDetected={handleBarcodeDetected} />

            {/* Recent Scans */}
            <RecentScans onSelect={handleBarcodeDetected} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
