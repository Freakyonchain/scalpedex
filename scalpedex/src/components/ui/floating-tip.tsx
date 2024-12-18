// components/ui/floating-tip.tsx
'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface FloatingTipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

export const FloatingTip = ({
  icon,
  title,
  description,
  currentStep,
  totalSteps,
  onNext,
  onSkip
}: FloatingTipProps) => {
  return (
    <div className="bg-violet-900/90 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 shadow-xl mx-auto max-w-md">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-violet-800/50 flex items-center justify-center shrink-0">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-medium text-white">{title}</h3>
            <button 
              onClick={onSkip}
              className="text-violet-400 hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-violet-200 leading-relaxed">
            {description}
          </p>

          {/* Progress and Action */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-violet-800/50">
            {/* Progress dots */}
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentStep - 1 
                      ? 'bg-violet-400' 
                      : 'bg-violet-800/50'
                  }`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={onNext}
              className="text-sm font-medium text-violet-300 hover:text-white transition-colors"
            >
              {currentStep === totalSteps ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};