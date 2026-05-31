import { cn } from '@/lib/utils'
import { CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react'

export type StatusType = 'COMPLIANT' | 'FLAGGED' | 'PENDING' | 'REJECTED' | 'PROCEED' | 'HOLD' | 'NO-GO'

interface StatusBadgeProps {
  status: StatusType
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig: Record<StatusType, { color: string; icon: typeof CheckCircle }> = {
  COMPLIANT: { color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle },
  PROCEED: { color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle },
  FLAGGED: { color: 'text-warm-amber border-warm-amber/30 bg-warm-amber/10', icon: AlertTriangle },
  HOLD: { color: 'text-warm-amber border-warm-amber/30 bg-warm-amber/10', icon: Clock },
  PENDING: { color: 'text-sky-400 border-sky-400/30 bg-sky-400/10', icon: Clock },
  REJECTED: { color: 'text-red-400 border-red-400/30 bg-red-400/10', icon: XCircle },
  'NO-GO': { color: 'text-red-400 border-red-400/30 bg-red-400/10', icon: XCircle },
}

export default function StatusBadge({ status, label, size = 'sm', className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-1.5',
  }
  const iconSizes = { sm: 10, md: 12, lg: 14 }

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-medium rounded border transition-all duration-200',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      <Icon size={iconSizes[size]} />
      {label ?? status}
    </span>
  )
}
