// /src/features/collection/components/SmartImage.tsx
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

  // Génère une couleur de fond cohérente basée sur le texte
  const generateBackgroundColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 20%)`;
  };

  // Fallback quand pas d'image ou erreur
  if (error || !src) {
    return (
      <div 
        className={`${className} flex items-center justify-center rounded-lg`}
        style={{ backgroundColor: generateBackgroundColor(alt) }}
      >
        <div className="text-center p-4">
          <ImageOff className="w-12 h-12 mx-auto text-violet-300/50 mb-2" />
          <span className="text-sm text-violet-300/70 font-medium">
            {alt.length > 15 ? `${alt.slice(0, 15)}...` : alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg bg-violet-900/20`}>
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-violet-800/30" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}