import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  message?: string
  subMessage?: string
  className?: string
}

export default function LoadingOverlay({ message = 'Processing...', subMessage, className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex flex-col items-center justify-center bg-obsidian/80 backdrop-blur-sm rounded-xl',
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 size={40} className="text-warm-amber animate-spin" />
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-warm-amber" />
        </div>
        <div className="text-center">
          <p className="font-body text-sm text-soft-cream">{message}</p>
          {subMessage && (
            <p className="font-mono text-xs text-muted-sand mt-1">{subMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}
