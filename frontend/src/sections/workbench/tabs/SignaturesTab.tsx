import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Upload,
  FileSignature,
  Users,
  NotepadText,
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  ZoomIn,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import LoadingOverlay from '@/sections/workbench/shared/LoadingOverlay'
import ExportBar from '@/sections/workbench/shared/ExportBar'
import { useSignatureExtract, useSignaturePacket } from '@/hooks/useJamieAPI'

gsap.registerPlugin(ScrollTrigger)

export default function SignaturesTab() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [collapsedParties, setCollapsedParties] = useState<Set<string>>(new Set())
  const { extract, loading: extracting, result } = useSignatureExtract()
  const { packet, generate: generatePacket } = useSignaturePacket()

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const items = sectionRef.current!.querySelectorAll('.animate-in')
      gsap.set(items, { opacity: 0, y: 20 })
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }),
        once: true,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setUploadedFile(files[0].name)
      handleExtract(files[0].name)
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
      handleExtract(file.name)
    }
  }, [])

  const handleExtract = useCallback(async (fileName: string) => {
    const res = await extract(fileName)
    if (res) {
      await generatePacket(fileName)
    }
  }, [extract, generatePacket])

  const toggleParty = useCallback((id: string) => {
    setCollapsedParties((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleExport = useCallback((format: string) => {
    // eslint-disable-next-line no-console
    console.log(`[Signatures] Export as ${format}`)
  }, [])

  const completenessColor = result
    ? result.completeness >= 90
      ? 'text-emerald-400'
      : result.completeness >= 60
        ? 'text-warm-amber'
        : 'text-red-400'
    : 'text-muted-sand'

  return (
    <div ref={sectionRef} className="space-y-4">
      {/* Upload Area */}
      <div className="animate-in">
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer',
            isDragOver
              ? 'border-warm-amber/50 bg-warm-amber/5'
              : uploadedFile
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-subtle-line bg-surface-dark hover:border-muted-sand/30'
          )}
        >
          {uploadedFile ? (
            <>
              <CheckCircle size={32} className="text-emerald-400" />
              <div className="text-center">
                <p className="font-body text-[14px] text-soft-cream mb-0.5">{uploadedFile}</p>
                <p className="font-mono text-[11px] text-muted-sand">Click or drag to replace</p>
              </div>
            </>
          ) : (
            <>
              <Upload size={32} className={isDragOver ? 'text-warm-amber' : 'text-muted-sand'} />
              <div className="text-center">
                <p className="font-body text-[14px] text-muted-sand mb-0.5">
                  <span className="text-soft-cream">Upload executed document</span> or drag and drop
                </p>
                <p className="font-mono text-[11px] text-muted-sand/60">PDF up to 100MB — multi-party signing analysis</p>
              </div>
            </>
          )}
          <input type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
        </label>
      </div>

      {/* Extraction Status */}
      {result && (
        <div className="animate-in grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-surface-dark border border-subtle-line rounded-xl p-4 text-center">
            <ZoomIn size={18} className="text-warm-amber mx-auto mb-1.5" />
            <div className="font-mono text-xl font-bold text-soft-cream">{result.pagesAnalyzed}</div>
            <div className="font-mono text-[10px] text-muted-sand uppercase">Pages Analyzed</div>
          </div>
          <div className="bg-surface-dark border border-subtle-line rounded-xl p-4 text-center">
            <FileSignature size={18} className="text-warm-amber mx-auto mb-1.5" />
            <div className="font-mono text-xl font-bold text-soft-cream">{result.sigPagesFound}</div>
            <div className="font-mono text-[10px] text-muted-sand uppercase">Signature Pages</div>
          </div>
          <div className="bg-surface-dark border border-subtle-line rounded-xl p-4 text-center">
            <Users size={18} className="text-warm-amber mx-auto mb-1.5" />
            <div className="font-mono text-xl font-bold text-soft-cream">{result.parties.length}</div>
            <div className="font-mono text-[10px] text-muted-sand uppercase">Parties Found</div>
          </div>
          <div className="bg-surface-dark border border-subtle-line rounded-xl p-4 text-center">
            <div className="mx-auto mb-1.5">
              <span className={cn('font-mono text-xl font-bold', completenessColor)}>
                {result.completeness}%
              </span>
            </div>
            <div className="font-mono text-[10px] text-muted-sand uppercase">Completeness</div>
          </div>
        </div>
      )}

      {/* Party Cards */}
      <div className="relative">
        {extracting && <LoadingOverlay message="Analyzing signature blocks..." subMessage="Detecting signatures, initials, and notary stamps" />}

        {result ? (
          <div className="animate-in space-y-3">
            {result.parties.map((party) => {
              const isCollapsed = collapsedParties.has(party.id)
              return (
                <div
                  key={party.id}
                  className="bg-surface-dark border border-subtle-line rounded-xl overflow-hidden transition-all duration-200 hover:border-warm-amber/20"
                >
                  <button
                    onClick={() => toggleParty(party.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left"
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      party.status === 'complete' ? 'bg-emerald-500/10' : 'bg-warm-amber/10'
                    )}>
                      {party.status === 'complete' ? (
                        <CheckCircle size={16} className="text-emerald-400" />
                      ) : (
                        <AlertTriangle size={16} className="text-warm-amber" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body font-semibold text-[13px] text-soft-cream truncate">{party.name}</h4>
                      <p className="font-mono text-[10px] text-muted-sand">
                        {party.signatureBlocks.length} block{party.signatureBlocks.length !== 1 ? 's' : ''} on {party.pages.length} page{party.pages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className={cn(
                      'font-mono text-[10px] px-2 py-0.5 rounded border',
                      party.status === 'complete'
                        ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                        : 'text-warm-amber border-warm-amber/30 bg-warm-amber/10'
                    )}>
                      {party.status.toUpperCase()}
                    </span>
                    {isCollapsed ? <ChevronDown size={16} className="text-muted-sand" /> : <ChevronUp size={16} className="text-muted-sand" />}
                  </button>

                  {!isCollapsed && (
                    <div className="px-5 pb-4 border-t border-subtle-line pt-3">
                      <div className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-2">Signature Blocks</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {party.signatureBlocks.map((block, i) => (
                          <div key={i} className="flex items-center gap-2.5 p-2.5 bg-obsidian/50 rounded-lg border border-subtle-line/50">
                            <FileSignature size={14} className="text-warm-amber flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-[12px] text-soft-cream truncate">{block.type}</p>
                              <p className="font-mono text-[10px] text-muted-sand">Page {block.page}</p>
                            </div>
                            <button className="flex-shrink-0 text-muted-sand hover:text-warm-amber transition-colors">
                              <Eye size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Notary & Witness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.notaryBlocks.length > 0 && (
                <div className="bg-surface-dark border border-subtle-line rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <NotepadText size={16} className="text-warm-amber" />
                    <h4 className="font-body font-semibold text-[13px] text-soft-cream">Notary / Acknowledgments</h4>
                  </div>
                  <div className="space-y-1.5">
                    {result.notaryBlocks.map((nb, i) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-muted-sand">
                        <span className="w-1.5 h-1.5 rounded-full bg-warm-amber flex-shrink-0" />
                        {nb.type} — Page {nb.page}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.witnessBlocks.length > 0 && (
                <div className="bg-surface-dark border border-subtle-line rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye size={16} className="text-warm-amber" />
                    <h4 className="font-body font-semibold text-[13px] text-soft-cream">Witness Signatures</h4>
                  </div>
                  <div className="space-y-1.5">
                    {result.witnessBlocks.map((wb, i) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-muted-sand">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                        {wb.type} — Page {wb.page}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Completeness Badge + Export */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface-dark border border-subtle-line rounded-xl">
              <div className="flex items-center gap-3">
                {result.completeness >= 90 ? (
                  <CheckCircle size={20} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={20} className={cn(completenessColor)} />
                )}
                <div>
                  <span className="font-body text-[13px] text-soft-cream">
                    Completeness Verification
                  </span>
                  <span className={cn('font-mono text-[13px] font-bold ml-3', completenessColor)}>
                    {result.completeness}%
                  </span>
                  <p className="font-mono text-[10px] text-muted-sand">
                    {result.completeness >= 90
                      ? 'All required signatures detected — ready to finalize'
                      : `${result.parties.filter((p) => p.status !== 'complete').length} party(s) have incomplete signatures`}
                  </p>
                </div>
              </div>
              <ExportBar formats={['zip', 'pdf']} onExport={handleExport} label="Export Packet" />
            </div>

            {/* Signing Instructions */}
            {packet && packet.instructions.length > 0 && (
              <div className="bg-surface-dark border border-subtle-line rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList size={16} className="text-warm-amber" />
                  <h4 className="font-body font-semibold text-[13px] text-soft-cream">Signing Instructions</h4>
                </div>
                <div className="space-y-2">
                  {packet.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 bg-obsidian/50 rounded-lg">
                      <span className="font-mono text-[10px] text-warm-amber font-bold mt-0.5">{i + 1}</span>
                      <p className="font-body text-[12px] text-muted-sand">{inst}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface-dark border border-subtle-line rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[240px]">
            <FileSignature size={48} className="text-muted-sand/15 mb-3" />
            <p className="font-body text-[14px] text-muted-sand/60 mb-1">Upload a document to analyze signatures</p>
            <p className="font-mono text-[11px] text-muted-sand/40">AI will detect signature blocks, parties, notary, and witness sections</p>
          </div>
        )}
      </div>
    </div>
  )
}
