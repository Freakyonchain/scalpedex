'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'profit' | 'loss' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
}

const variants = {
  default: 'bg-white/10 text-zinc-300 border-white/10',
  profit: 'bg-profit/10 text-profit border-profit/20',
  loss: 'bg-loss/10 text-loss border-loss/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  outline: 'bg-transparent text-zinc-400 border-white/20',
};

const sizes = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wider',
        'rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'profit' && 'bg-profit',
            variant === 'loss' && 'bg-loss',
            variant === 'warning' && 'bg-warning',
            variant === 'info' && 'bg-primary',
            variant === 'default' && 'bg-zinc-400',
            variant === 'outline' && 'bg-zinc-500',
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
}

// Percentage Change Badge
export interface PercentBadgeProps extends Omit<BadgeProps, 'variant'> {
  value: number;
  showIcon?: boolean;
}

export function PercentBadge({
  value,
  showIcon = true,
  className,
  ...props
}: PercentBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const variant = isNeutral ? 'default' : isPositive ? 'profit' : 'loss';
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <Badge variant={variant} className={cn('font-mono', className)} {...props}>
      {showIcon && <Icon size={12} strokeWidth={2} />}
      {isPositive && '+'}
      {value.toFixed(1)}%
    </Badge>
  );
}

// Status Indicator
export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'online' | 'offline' | 'warning' | 'loading';
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusIndicator({
  status,
  label,
  size = 'md',
  className,
  ...props
}: StatusIndicatorProps) {
  const statusStyles = {
    online: 'bg-profit shadow-[0_0_8px_rgba(0,255,163,0.5)]',
    offline: 'bg-zinc-600',
    warning: 'bg-warning shadow-[0_0_8px_rgba(255,170,0,0.5)]',
    loading: 'bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)] animate-pulse',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)} {...props}>
      <span className={cn('rounded-full', dotSizes[size], statusStyles[status])} />
      {label && (
        <span className={cn('text-zinc-400 font-medium', textSizes[size])}>
          {label}
        </span>
      )}
    </div>
  );
}

// Price Tag
export interface PriceTagProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'profit' | 'muted';
}

export function PriceTag({
  price,
  currency = '€',
  size = 'md',
  variant = 'default',
  className,
  ...props
}: PriceTagProps) {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const decimalSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const textColors = {
    default: 'text-white',
    profit: 'text-profit',
    muted: 'text-zinc-400',
  };

  const [whole, decimal] = price.toFixed(2).split('.');

  return (
    <div className={cn('font-mono font-bold', textColors[variant], className)} {...props}>
      <span className={textSizes[size]}>
        {currency}{whole}
      </span>
      <span className={cn('text-zinc-500', decimalSizes[size])}>
        .{decimal}
      </span>
    </div>
  );
}