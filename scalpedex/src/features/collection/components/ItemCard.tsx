'use client';

import React from 'react';
import { CollectionItem, CONDITIONS } from '../types/collection-types';
import { Sparkles, Zap } from 'lucide-react';

interface ItemCardProps {
  item: CollectionItem;
  onClick: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const { product, condition, quantity, purchasePrice } = item;
  
  // Badge style selon la condition
  const getBadgeStyle = () => {
    switch(condition) {
      case 'FACTORY_SEALED':
        return 'bg-gradient-to-r from-blue-500 to-cyan-400';
      case 'CUSTOM_SEALED':
        return 'bg-gradient-to-r from-purple-500 to-fuchsia-400';
      case 'MINT':
        return 'bg-gradient-to-r from-green-500 to-emerald-400';
      case 'NEAR_MINT':
        return 'bg-gradient-to-r from-amber-500 to-yellow-400';
      default:
        return 'bg-gradient-to-r from-slate-600 to-slate-400';
    }
  };

  return (
    <div 
      onClick={onClick}
      style={{
        width: '160px', 
        height: '220px', 
        maxWidth: '160px', 
        maxHeight: '220px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: '12px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        background: 'linear-gradient(to bottom, rgba(76, 29, 149, 0.8), rgba(49, 46, 129, 1))'
      }}
      className="group hover:shadow-lg hover:shadow-violet-500/20 hover:border-violet-500/50 transition-all duration-300"
    >
      {/* Image avec effet neon glow */}
      <div style={{
        height: '120px', 
        width: '100%', 
        maxHeight: '120px',
        position: 'relative', 
        overflow: 'hidden'
      }}>
        {product.imageUrl ? (
          <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1 }}></div>
            <img 
              src={product.imageUrl} 
              alt={product.name}
              style={{
                height: '100%', 
                width: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.7s',
              }}
              className="group-hover:scale-110"
            />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ) : (
          <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(76, 29, 149, 0.2)'
          }}>
            <Sparkles className="w-8 h-8 text-violet-500/50" />
          </div>
        )}
        
        {/* Condition badge - style cyberpunk */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 20
        }}>
          <div className={`px-2 py-0.5 text-[10px] rounded border border-${condition === 'FACTORY_SEALED' ? 'blue' : 'violet'}-400/50 ${getBadgeStyle()} text-white font-bold shadow-lg flex items-center gap-1`}>
            {condition === 'FACTORY_SEALED' && <Zap size={10} />}
            {CONDITIONS[condition] || '?'}
          </div>
        </div>
      </div>
      
      {/* Info content with neon accents */}
      <div style={{ padding: '12px', position: 'relative', zIndex: 2 }}>
        {/* Title with cyberpunk line clamp */}
        <h3 style={{
          fontWeight: 500,
          color: 'white',
          fontSize: '14px',
          lineHeight: '1.2',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }}>
          {product.name}
        </h3>
        
        {/* Glass panel with price */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-violet-800/30 rounded text-sm">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 font-bold">
              {purchasePrice.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
              })}
            </span>
          </div>
          
          {quantity > 1 && (
            <div className="px-1.5 py-1 rounded text-xs bg-violet-800/70 border border-violet-600/40 text-violet-200 font-bold">
              ×{quantity}
            </div>
          )}
        </div>
      </div>
      
      {/* Hover reveal tooltip */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center
                    translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-[10px] text-violet-200 font-semibold tracking-wider uppercase flex items-center gap-1">
          <Sparkles size={10} className="text-violet-400" />
          Voir détails
        </span>
      </div>
    </div>
  );
}