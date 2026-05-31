import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Upload, FileText, X, GripVertical, Database } from 'lucide-react'

export interface DocumentItem {
  id: string
  name: string
  size: string
  type: string
  source: 'upload' | 'entity'
  dateUploaded: string
}

interface DocumentSelectorProps {
  title: string
  selectedId?: string
  onSelect: (doc: DocumentItem) => void
  onUpload?: (file: File) => void
  onRemove?: (id: string) => void
  documents: DocumentItem[]
  className?: string
}

export default function DocumentSelector({
  title,
  selectedId,
  onSelect,
  onUpload,
  onRemove,
  documents,
  className,
}: DocumentSelectorProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0 && onUpload) {
        onUpload(files[0])
      }
    },
    [onUpload]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUpload) {
      onUpload(file)
    }
  }

  const entityDocs = documents.filter((d) => d.source === 'entity')
  const uploadedDocs = documents.filter((d) => d.source === 'upload')

  return (
    <div className={cn('flex flex-col bg-surface-dark border border-subtle-line rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-subtle-line bg-surface-mid/50">
        <FileText size={16} className="text-warm-amber" />
        <span className="font-body font-medium text-[13px] text-soft-cream">{title}</span>
        <span className="font-mono text-[10px] text-muted-sand ml-auto">{documents.length} docs</span>
      </div>

      {/* Upload Area */}
      {onUpload && (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center gap-2 p-4 m-3 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer',
            isDragOver
              ? 'border-warm-amber/50 bg-warm-amber/5'
              : 'border-subtle-line bg-obsidian/50 hover:border-muted-sand/30'
          )}
        >
          <Upload size={20} className={isDragOver ? 'text-warm-amber' : 'text-muted-sand'} />
          <div className="text-center">
            <p className="font-body text-[12px] text-muted-sand">
              <span className="text-soft-cream">Click to upload</span> or drag and drop
            </p>
            <p className="font-mono text-[10px] text-muted-sand/60 mt-0.5">PDF, DOCX, TXT up to 50MB</p>
          </div>
          <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileInput} />
        </label>
      )}

      {/* Document Lists */}
      <div className="flex-1 overflow-auto px-3 pb-3">
        {/* Entity Documents */}
        {entityDocs.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 px-1 mb-1.5">
              <Database size={10} className="text-muted-sand/60" />
              <span className="font-mono text-[10px] text-muted-sand uppercase tracking-wider">Entity Library</span>
            </div>
            <div className="space-y-1">
              {entityDocs.map((doc) => (
                <DocRow
                  key={doc.id}
                  doc={doc}
                  isSelected={selectedId === doc.id}
                  onSelect={() => onSelect(doc)}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Documents */}
        {uploadedDocs.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-1 mb-1.5">
              <Upload size={10} className="text-muted-sand/60" />
              <span className="font-mono text-[10px] text-muted-sand uppercase tracking-wider">Uploaded</span>
            </div>
            <div className="space-y-1">
              {uploadedDocs.map((doc) => (
                <DocRow
                  key={doc.id}
                  doc={doc}
                  isSelected={selectedId === doc.id}
                  onSelect={() => onSelect(doc)}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>
        )}

        {documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <FileText size={24} className="text-muted-sand/20 mb-2" />
            <p className="font-mono text-[11px] text-muted-sand/40">No documents yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DocRow({
  doc,
  isSelected,
  onSelect,
  onRemove,
}: {
  doc: DocumentItem
  isSelected: boolean
  onSelect: () => void
  onRemove?: (id: string) => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 group',
        isSelected
          ? 'bg-warm-amber/10 border border-warm-amber/20'
          : 'bg-obsidian/30 border border-transparent hover:border-subtle-line'
      )}
    >
      <GripVertical size={12} className="text-muted-sand/30 flex-shrink-0" />
      <FileText size={14} className={isSelected ? 'text-warm-amber' : 'text-muted-sand/60'} />
      <div className="flex-1 min-w-0">
        <p className={cn('font-body text-[12px] truncate', isSelected ? 'text-soft-cream' : 'text-muted-sand')}>
          {doc.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-muted-sand/50">{doc.size}</span>
          <span className="font-mono text-[9px] text-muted-sand/50 uppercase">{doc.type}</span>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(doc.id)
          }}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-muted-sand hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <X size={12} />
        </button>
      )}
    </button>
  )
}
