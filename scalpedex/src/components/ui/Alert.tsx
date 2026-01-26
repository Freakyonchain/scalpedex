'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  X
} from 'lucide-react';

export type AlertVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles = {
  default: {
    container: 'bg-surface border-white/10',
    icon: 'text-zinc-400',
    title: 'text-white',
    description: 'text-zinc-400',
  },
  success: {
    container: 'bg-profit/10 border-profit/20',
    icon: 'text-profit',
    title: 'text-profit',
    description: 'text-profit/80',
  },
  error: {
    container: 'bg-loss/10 border-loss/20',
    icon: 'text-loss',
    title: 'text-loss',
    description: 'text-loss/80',
  },
  warning: {
    container: 'bg-warning/10 border-warning/20',
    icon: 'text-warning',
    title: 'text-warning',
    description: 'text-warning/80',
  },
  info: {
    container: 'bg-primary/10 border-primary/20',
    icon: 'text-primary',
    title: 'text-primary',
    description: 'text-primary/80',
  },
};

const defaultIcons = {
  default: AlertCircle,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Alert({
  variant = 'default',
  title,
  dismissible = false,
  onDismiss,
  icon,
  className,
  children,
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const styles = variantStyles[variant];
  const IconComponent = defaultIcons[variant];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'relative flex gap-3 p-4 rounded-xl border backdrop-blur-sm',
            styles.container,
            className
          )}
          role="alert"
        >
          {/* Icon */}
          <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
            {icon || <IconComponent size={18} strokeWidth={1.5} />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h5 className={cn('font-semibold text-sm mb-1', styles.title)}>
                {title}
              </h5>
            )}
            <div className={cn('text-sm', styles.description)}>
              {children}
            </div>
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} className="text-zinc-500" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}