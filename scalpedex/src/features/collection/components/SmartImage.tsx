// src/features/collection/components/SmartImage.tsx
'use client';

import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SmartImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function SmartImage({ src, alt, className = '' }: SmartImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fallback quand pas d'image ou erreur
  if (error || !src) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-violet-900/30 rounded`}
      >
        <div className="text-center p-2">
          <ImageOff className="w-6 h-6 mx-auto text-violet-300 mb-1" />
          <span className="text-xs text-violet-300">
            {alt.length > 10 ? `${alt.slice(0, 10)}...` : alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-violet-900/30 rounded w-full h-full max-h-[100px] overflow-hidden`}>
      {loading && (
        <div className="w-full h-full animate-pulse bg-violet-800/30" />
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ maxHeight: '100px' }}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}