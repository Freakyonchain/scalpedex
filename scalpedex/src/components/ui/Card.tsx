'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps {
  variant?: 'glass' | 'glass-elevated' | 'solid' | 'outline';
  interactive?: boolean;
  hud?: boolean;
  glow?: 'none' | 'primary' | 'profit';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const variants = {
  glass: `
    bg-glass-bg backdrop-blur-xl
    border border-glass-border
  `,
  'glass-elevated': `
    bg-surface-elevated/80 backdrop-blur-2xl
    border border-white/10
    shadow-glass-lg
  `,
  solid: `
    bg-surface
    border border-white/5
  `,
  outline: `
    bg-transparent
    border border-white/10
  `,
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const glows = {
  none: '',
  primary: 'shadow-glow-primary-sm',
  profit: 'shadow-glow-profit-sm',
};

export function Card({
  className,
  variant = 'glass',
  interactive = false,
  hud = false,
  glow = 'none',
  padding = 'md',
  children,
  onClick,
}: CardProps) {
  const baseClasses = cn(
    'relative rounded-xl overflow-hidden',
    variants[variant],
    paddings[padding],
    glows[glow],
    interactive && 'cursor-pointer hover:border-primary/30 transition-colors',
    className
  );

  const content = (
    <>
      {hud && (
        <>
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
        </>
      )}
      {children}
    </>
  );

  if (interactive) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {content}
    </div>
  );
}

// Card Header
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

export function CardHeader({ icon, title, action, className, ...props }: CardHeaderProps) {
  return (
    <div 
      className={cn('flex items-center justify-between mb-4', className)} 
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {title}
        </span>
      </div>
      {action}
    </div>
  );
}

// Card Content
export function CardContent({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  );
}

// Card Footer
export function CardFooter({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('mt-4 pt-4 border-t border-white/5', className)} 
      {...props}
    >
      {children}
    </div>
  );
}