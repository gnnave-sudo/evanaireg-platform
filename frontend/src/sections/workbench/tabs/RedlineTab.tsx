import { useState, useCallback, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FileText, GitCompare, Sparkles, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import DocumentSelector, { type DocumentItem } from '@/sections/workbench/shared/DocumentSelector'
import DiffViewer, { type DiffBlock } from '@/sections/workbench/shared/DiffViewer'
import ChatPanel from '@/sections/workbench/shared/ChatPanel'
import ExportBar from '@/sections/workbench/shared/ExportBar'
import LoadingOverlay from '@/sections/workbench/shared/LoadingOverlay'
import { useRedlineCompare, useRedlineChat } from '@/hooks/useJamieAPI'

gsap.registerPlugin(ScrollTrigger)

const mockDocuments: DocumentItem[] = [
  { id: 'msa-v1', name: 'MSA_Vortex_Crimson_v1.2.docx', size: '2.4 MB', type: 'DOCX', source: 'entity', dateUploaded: '2026-01-15' },
  { id: 'msa-v2', name: 'MSA_Vortex_Crimson_v1.3_Review.docx', size: '2.6 MB', type: 'DOCX', source: 'entity', dateUploaded: '2026-03-22' },
  { id: 'nda-2025', name: 'NDA_Template_2025.docx', size: '340 KB', type: 'DOCX', source: 'entity', dateUploaded: '2025-11-01' },
  { id: 'sow-001', name: 'SOW_001_Implementation.docx', size: '1.1 MB', type: 'DOCX', source: 'entity', dateUploaded: '2026-02-10' },
  { id: 'dpa-schedule', name: 'DPA_Schedule_D.docx', size: '890 KB', type: 'DOCX', source: 'upload', dateUploaded: '2026-03-25' },
]

export default function RedlineTab() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [docA, setDocA] = useState<DocumentItem | null>(null)
  const [docB, setDocB] = useState<DocumentItem | null>(null)
  const [selectedDiffId, setSelectedDiffId] = useState<string | undefined>()
  const { compare, loading: comparing, data: session } = useRedlineCompare()
  const { messages, loading: chatLoading, send } = useRedlineChat(session?.id ?? '')

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

  const handleCompare = useCallback(async () => {
    if (!docA || !docB) return
    await compare(docA.id, docB.id)
  }, [docA, docB, compare])

  const handleDiffClick = useCallback((block: DiffBlock) => {
    setSelectedDiffId(block.id)
  }, [])

  const handleExport = useCallback((format: string) => {
    // eslint-disable-next-line no-console
    console.log(`[Redline] Export as ${format}`)
  }, [])

  const stats = session?.stats ?? { inserts: 0, deletes: 0, modifies: 0 }

  return (
    <div ref={sectionRef} className="space-y-4">
      {/* Top Row: Document Selectors + Compare Button */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Doc A */}
        <div className="animate-in">
          <DocumentSelector
            title="Document A (Original)"
            documents={mockDocuments}
            selectedId={docA?.id}
            onSelect={setDocA}
            className="h-[280px]"
          />
        </div>

        {/* Doc B */}
        <div className="animate-in">
          <DocumentSelector
            title="Document B (Revised)"
            documents={mockDocuments}
            selectedId={docB?.id}
            onSelect={setDocB}
            className="h-[280px]"
          />
        </div>

        {/* Stats Panel */}
        <div className="animate-in bg-surface-dark border border-subtle-line rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-warm-amber" />
            <span className="font-body font-medium text-[13px] text-soft-cream">Change Statistics</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
              <div className="font-mono text-2xl font-bold text-emerald-400">{stats.inserts}</div>
              <div className="font-mono text-[10px] text-emerald-400/70 uppercase mt-0.5">Inserted</div>
            </div>
            <div className="text-center p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
              <div className="font-mono text-2xl font-bold text-red-400">{stats.deletes}</div>
              <div className="font-mono text-[10px] text-red-400/70 uppercase mt-0.5">Deleted</div>
            </div>
            <div className="text-center p-3 bg-warm-amber/5 border border-warm-amber/20 rounded-lg">
              <div className="font-mono text-2xl font-bold text-warm-amber">{stats.modifies}</div>
              <div className="font-mono text-[10px] text-warm-amber/70 uppercase mt-0.5">Modified</div>
            </div>
          </div>

          {/* AI Analysis Summary */}
          {session && (
            <div className="flex-1 p-3 bg-surface-mid/50 rounded-lg border border-subtle-line">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-warm-amber" />
                <span className="font-mono text-[10px] text-warm-amber uppercase">AI Analysis</span>
              </div>
              <p className="font-body text-[12px] text-muted-sand leading-relaxed">
                {stats.inserts + stats.deletes + stats.modifies} total changes detected. The revisions
                reduce liability exposure while adding regulatory compliance. Net impact is favorable
                to the Company with moderate risk in termination provisions.
              </p>
            </div>
          )}

          {/* Compare Button */}
          <button
            onClick={handleCompare}
            disabled={!docA || !docB || comparing}
            className={cn(
              'mt-auto w-full flex items-center justify-center gap-2 font-body font-semibold text-sm py-2.5 rounded-lg transition-all duration-200',
              docA && docB && !comparing
                ? 'bg-warm-amber text-obsidian hover:scale-[1.02]'
                : 'bg-surface-mid text-muted-sand cursor-not-allowed'
            )}
          >
            <GitCompare size={16} />
            {comparing ? 'Comparing...' : 'Compare Documents'}
          </button>
        </div>
      </div>

      {/* Middle Row: Diff Viewer */}
      <div className="animate-in relative bg-surface-dark border border-subtle-line rounded-xl p-4 min-h-[320px]">
        {comparing && <LoadingOverlay message="Analyzing document differences..." subMessage="Running redline comparison across 47 pages" />}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-warm-amber" />
            <span className="font-body font-medium text-[13px] text-soft-cream">Diff Viewer</span>
            {session && (
              <span className="font-mono text-[10px] text-muted-sand ml-2">
                {docA?.name} → {docB?.name}
              </span>
            )}
          </div>
          {session && (
            <ExportBar
              formats={['docx', 'pdf', 'json']}
              onExport={handleExport}
            />
          )}
        </div>
        {session ? (
          <DiffViewer
            blocks={session.diffs}
            onBlockClick={handleDiffClick}
            selectedBlockId={selectedDiffId}
            className="max-h-[400px] pr-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px] text-center">
            <GitCompare size={48} className="text-muted-sand/15 mb-3" />
            <p className="font-body text-[14px] text-muted-sand/60 mb-1">Select two documents and click Compare</p>
            <p className="font-mono text-[11px] text-muted-sand/40">AI-powered redline analysis with clause-level classification</p>
          </div>
        )}
      </div>

      {/* Bottom Row: Chat */}
      <div className="animate-in">
        <ChatPanel
          title="Redline Assistant"
          placeholder="Ask about the changes between these documents..."
          messages={messages.map((m) => ({
            ...m,
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(),
          }))}
          onSendMessage={send}
          isLoading={chatLoading}
          className="h-[340px]"
        />
      </div>
    </div>
  )
}
