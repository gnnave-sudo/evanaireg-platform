import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export interface DiffBlock {
  id: string
  type: 'insert' | 'delete' | 'modify' | 'unchanged'
  oldText?: string
  newText?: string
  lineStart: number
  lineEnd: number
  label?: string
}

interface DiffViewerProps {
  blocks: DiffBlock[]
  showUnchanged?: boolean
  className?: string
  onBlockClick?: (block: DiffBlock) => void
  selectedBlockId?: string
}

const typeConfig = {
  insert: { bg: 'bg-emerald-500/10', border: 'border-l-emerald-500', text: 'text-emerald-400', label: 'INSERTED' },
  delete: { bg: 'bg-red-500/10', border: 'border-l-red-500', text: 'text-red-400', label: 'DELETED' },
  modify: { bg: 'bg-warm-amber/10', border: 'border-l-warm-amber', text: 'text-warm-amber', label: 'MODIFIED' },
  unchanged: { bg: 'bg-transparent', border: 'border-l-transparent', text: 'text-muted-sand', label: 'UNCHANGED' },
}

export default function DiffViewer({
  blocks,
  showUnchanged = false,
  className,
  onBlockClick,
  selectedBlockId,
}: DiffViewerProps) {
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())

  const toggleBlock = (id: string) => {
    setCollapsedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = showUnchanged ? blocks : blocks.filter((b) => b.type !== 'unchanged')

  return (
    <div className={cn('flex flex-col gap-1 overflow-auto', className)}>
      {filtered.map((block) => {
        const config = typeConfig[block.type]
        const isCollapsed = collapsedBlocks.has(block.id)
        const isSelected = selectedBlockId === block.id

        return (
          <div
            key={block.id}
            className={cn(
              'group border-l-2 rounded-r-lg transition-all duration-200',
              config.bg,
              config.border,
              isSelected && 'ring-1 ring-warm-amber/50',
              onBlockClick && 'cursor-pointer hover:bg-opacity-20'
            )}
            onClick={() => onBlockClick?.(block)}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 px-3 py-1.5"
              onClick={(e) => {
                e.stopPropagation()
                toggleBlock(block.id)
              }}
            >
              {block.type !== 'unchanged' && (
                <button className="flex-shrink-0 text-muted-sand hover:text-soft-cream transition-colors">
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
              <span className={cn('font-mono text-[10px] font-medium px-1.5 py-0.5 rounded', config.text, config.bg)}>
                {block.label ?? config.label}
              </span>
              <span className="font-mono text-[10px] text-muted-sand ml-auto">
                L{block.lineStart}{block.lineEnd > block.lineStart ? `–L${block.lineEnd}` : ''}
              </span>
            </div>

            {/* Content */}
            {!isCollapsed && (
              <div className="px-3 pb-2">
                {block.type === 'modify' && (
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-[10px] text-red-400 flex-shrink-0 mt-0.5">−</span>
                      <p className="font-body text-[13px] text-red-400/80 line-through">{block.oldText}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-[10px] text-emerald-400 flex-shrink-0 mt-0.5">+</span>
                      <p className="font-body text-[13px] text-emerald-400/80">{block.newText}</p>
                    </div>
                  </div>
                )}
                {block.type === 'insert' && (
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[10px] text-emerald-400 flex-shrink-0 mt-0.5">+</span>
                    <p className="font-body text-[13px] text-emerald-400/80">{block.newText}</p>
                  </div>
                )}
                {block.type === 'delete' && (
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[10px] text-red-400 flex-shrink-0 mt-0.5">−</span>
                    <p className="font-body text-[13px] text-red-400/80 line-through">{block.oldText}</p>
                  </div>
                )}
                {block.type === 'unchanged' && (
                  <p className="font-body text-[13px] text-muted-sand/60">{block.oldText}</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
