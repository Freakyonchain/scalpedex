'use client'

import { cn } from '@/lib/utils/cn'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export type AlertVariant = 'default' | 'destructive' | 'success' | 'info'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  children: React.ReactNode
}

export function Alert({ variant = 'default', children, className, ...props }: AlertProps) {
  const baseStyles = 'w-full p-4 rounded-lg text-sm flex items-start gap-3'
  const variants: Record<AlertVariant, string> = {
    default: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700'
  }

  const icons: Record<AlertVariant, JSX.Element> = {
    default: <AlertCircle size={20} />,
    destructive: <AlertCircle size={20} />,
    success: <CheckCircle size={20} />,
    info: <Info size={20} />
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      <div className="pt-1">{icons[variant]}</div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
