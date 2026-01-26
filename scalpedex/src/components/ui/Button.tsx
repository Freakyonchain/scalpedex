'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'profit' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: `
    bg-gradient-to-r from-primary to-primary/80
    text-white font-semibold
    shadow-btn-primary hover:shadow-btn-primary-hover
    border-0
  `,
  profit: `
    bg-gradient-to-r from-profit to-profit-dark
    text-black font-bold
    shadow-btn-profit hover:shadow-btn-profit-hover
    border-0
  `,
  ghost: `
    bg-transparent hover:bg-white/5
    text-zinc-400 hover:text-white
    border border-white/10 hover:border-white/20
  `,
  outline: `
    bg-transparent hover:bg-primary/10
    text-primary hover:text-primary
    border border-primary/30 hover:border-primary/50
  `,
  danger: `
    bg-gradient-to-r from-loss to-loss-dark
    text-white font-semibold
    shadow-glow-loss hover:shadow-glow-loss
    border-0
  `,
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
  xl: 'h-14 px-8 text-lg gap-3 rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ duration: 0.15 }}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-black',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          // Variant
          variants[variant],
          // Size
          sizes[size],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'xl' ? 22 : 18} />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';