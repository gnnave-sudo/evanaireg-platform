import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Download, FileText, FileSpreadsheet, Code, Image, Mail, FileArchive } from 'lucide-react'

export type ExportFormat = 'docx' | 'pdf' | 'json' | 'csv' | 'excel' | 'svg' | 'png' | 'zip' | 'msg'

interface ExportBarProps {
  formats: ExportFormat[]
  onExport: (format: ExportFormat) => void
  className?: string
  label?: string
}

const formatConfig: Record<ExportFormat, { label: string; icon: typeof FileText; ext: string }> = {
  docx: { label: 'DOCX', icon: FileText, ext: '.docx' },
  pdf: { label: 'PDF', icon: FileText, ext: '.pdf' },
  json: { label: 'JSON', icon: Code, ext: '.json' },
  csv: { label: 'CSV', icon: FileSpreadsheet, ext: '.csv' },
  excel: { label: 'Excel', icon: FileSpreadsheet, ext: '.xlsx' },
  svg: { label: 'SVG', icon: Image, ext: '.svg' },
  png: { label: 'PNG', icon: Image, ext: '.png' },
  zip: { label: 'ZIP', icon: FileArchive, ext: '.zip' },
  msg: { label: 'Outlook', icon: Mail, ext: '.msg' },
}

export default function ExportBar({ formats, onExport, className, label = 'Export' }: ExportBarProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="font-mono text-[11px] text-muted-sand mr-1">{label}:</span>
      {formats.map((format) => {
        const config = formatConfig[format]
        const Icon = config.icon
        return (
          <button
            key={format}
            onMouseEnter={() => setHovered(format)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onExport(format)}
            className={cn(
              'flex items-center gap-1.5 font-mono text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all duration-200',
              hovered === format
                ? 'bg-warm-amber/10 border-warm-amber/30 text-warm-amber'
                : 'bg-surface-dark border-subtle-line text-muted-sand hover:text-soft-cream'
            )}
          >
            <Icon size={13} />
            {config.label}
          </button>
        )
      })}
      <button
        onClick={() => onExport(formats[0])}
        className="flex items-center gap-1.5 font-body text-[11px] font-medium bg-warm-amber text-obsidian px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-[1.03]"
      >
        <Download size={13} />
        Download
      </button>
    </div>
  )
}
