'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'ghost';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      variant = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();

    const variantStyles = {
      default: `
        bg-black/40 backdrop-blur-sm
        border border-white/10 
        focus:border-primary/50 focus:ring-2 focus:ring-primary/20
        hover:border-white/20
      `,
      ghost: `
        bg-transparent
        border border-transparent
        focus:border-white/10 focus:ring-1 focus:ring-white/10
        hover:bg-white/5
      `,
    };

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-zinc-400 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full h-11 px-4 rounded-xl',
              'text-sm text-white placeholder:text-zinc-600',
              'transition-all duration-200',
              'outline-none',
              // Font
              type === 'number' && 'font-mono',
              // Variant
              variantStyles[variant],
              // Error state
              error && 'border-loss/50 focus:border-loss focus:ring-loss/20',
              // Disabled
              disabled && 'opacity-50 cursor-not-allowed',
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-loss font-medium">{error}</p>
        )}
        
        {hint && !error && (
          <p className="text-xs text-zinc-600">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';