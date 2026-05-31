import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FileText,
  AlertTriangle,
  Palette,
  Zap,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ExportBar from '@/sections/workbench/shared/ExportBar'
import { useRedlineNowClauses } from '@/hooks/useJamieAPI'
import type { QuickClause } from '@/hooks/useJamieAPI'

gsap.registerPlugin(ScrollTrigger)

function DiffLine({ clause }: { clause: QuickClause }) {
  const colorClasses = {
    substantive: 'border-l-warm-amber bg-warm-amber/5',
    cosmetic: 'border-l-sky-400 bg-sky-400/5',
    critical: 'border-l-red-400 bg-red-400/5',
  }

  const badgeClasses = {
    substantive: 'text-warm-amber border-warm-amber/30 bg-warm-amber/10',
    cosmetic: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
    critical: 'text-red-400 border-red-400/30 bg-red-400/10',
  }

  const labels = {
    substantive: 'Substantive',
    cosmetic: 'Cosmetic',
    critical: 'Critical',
  }

  return (
    <div className={cn('border-l-2 rounded-r-lg p-3 transition-all duration-200 hover:opacity-90', colorClasses[clause.classification])}>
      <div className="flex items-center gap-2 mb-2">
        <span className={cn('font-mono text-[9px] font-medium px-1.5 py-0.5 rounded border', badgeClasses[clause.classification])}>
          {labels[clause.classification]}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="font-mono text-[10px] text-red-400 flex-shrink-0 mt-0.5">−</span>
          <p className="font-body text-[12px] text-red-400/70 line-through">{clause.oldText}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-mono text-[10px] text-emerald-400 flex-shrink-0 mt-0.5">+</span>
          <p className="font-body text-[12px] text-emerald-400/70">{clause.newText}</p>
        </div>
      </div>
      <p className="font-body text-[11px] text-muted-sand mt-2 leading-relaxed">{clause.explanation}</p>
    </div>
  )
}

export default function QuickCompareTab() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [leftText, setLeftText] = useState(
    `Section 4.2 — Payment Terms\nNet 30 days from invoice date. Late payments subject to 1.5% monthly service charge.\n\nSection 8.1 — Limitation of Liability\nThe total liability of either party shall not exceed USD 1,000,000.\n\nSection 12 — Termination\nEither party may terminate with 30 days written notice.`
  )
  const [rightText, setRightText] = useState(
    `Section 4.2 — Payment Terms\nNet 30 days from invoice date. Late payments subject to 1.5% monthly service charge. Early payment discounts of 2% available within 10 days.\n\nSection 8.1 — Limitation of Liability\nThe total liability of either party shall not exceed USD 5,000,000, except for willful misconduct which shall be uncapped.\n\nSection 12 — Termination\nEither party may terminate with 60 days written notice. Immediate termination for material breach remains available.`
  )
  const { analyze, analyzing, clauses } = useRedlineNowClauses()
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

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

  // Auto-analyze when text changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (leftText && rightText && !hasAnalyzed) {
        handleAnalyze()
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [leftText, rightText])

  const handleAnalyze = useCallback(async () => {
    if (!leftText.trim() || !rightText.trim()) return
    await analyze(leftText, rightText)
    setHasAnalyzed(true)
  }, [leftText, rightText, analyze])

  const handleExport = useCallback((format: string) => {
    // eslint-disable-next-line no-console
    console.log(`[QuickCompare] Export as ${format}`)
  }, [])

  // Simple line-by-line diff display
  const diffLines = useMemo(() => {
    const leftLines = leftText.split('\n')
    const rightLines = rightText.split('\n')
    const maxLen = Math.max(leftLines.length, rightLines.length)
    const result: { left: string; right: string; changed: boolean }[] = []

    for (let i = 0; i < maxLen; i++) {
      const l = leftLines[i] ?? ''
      const r = rightLines[i] ?? ''
      result.push({ left: l, right: r, changed: l !== r })
    }

    return result
  }, [leftText, rightText])

  const counts = useMemo(() => {
    const c = { substantive: 0, cosmetic: 0, critical: 0 }
    clauses.forEach((cl) => { c[cl.classification]++ })
    return c
  }, [clauses])

  return (
    <div ref={sectionRef} className="space-y-4">
      {/* Header */}
      <div className="animate-in flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-warm-amber" />
          <h3 className="font-body font-semibold text-[13px] text-soft-cream">Quick Compare</h3>
          <span className="font-mono text-[10px] text-muted-sand">— Real-time diff as you type</span>
        </div>
        <div className="flex items-center gap-3">
          {clauses.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-warm-amber bg-warm-amber/10 border border-warm-amber/20 px-2 py-0.5 rounded">
                {counts.substantive} substantive
              </span>
              <span className="font-mono text-[10px] text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded">
                {counts.cosmetic} cosmetic
              </span>
              <span className="font-mono text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded">
                {counts.critical} critical
              </span>
            </div>
          )}
          <ExportBar formats={['pdf', 'msg']} onExport={handleExport} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Text Areas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="animate-in grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="bg-surface-dark border border-subtle-line rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-subtle-line bg-surface-mid/50">
                <FileText size={14} className="text-muted-sand" />
                <span className="font-body text-[12px] text-soft-cream">Original Text</span>
              </div>
              <textarea
                value={leftText}
                onChange={(e) => { setLeftText(e.target.value); setHasAnalyzed(false) }}
                rows={16}
                className="w-full bg-obsidian px-4 py-3 font-mono text-[12px] text-soft-cream placeholder:text-muted-sand/50 outline-none resize-none focus:bg-obsidian/80 leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Modified */}
            <div className="bg-surface-dark border border-subtle-line rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-subtle-line bg-surface-mid/50">
                <FileText size={14} className="text-warm-amber" />
                <span className="font-body text-[12px] text-soft-cream">Modified Text</span>
              </div>
              <textarea
                value={rightText}
                onChange={(e) => { setRightText(e.target.value); setHasAnalyzed(false) }}
                rows={16}
                className="w-full bg-obsidian px-4 py-3 font-mono text-[12px] text-soft-cream placeholder:text-muted-sand/50 outline-none resize-none focus:bg-obsidian/80 leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Live Diff View */}
          <div className="animate-in bg-surface-dark border border-subtle-line rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-subtle-line bg-surface-mid/50">
              <div className="flex items-center gap-2">
                <ArrowRight size={14} className="text-warm-amber" />
                <span className="font-body text-[12px] text-soft-cream">Live Diff</span>
              </div>
              <span className="font-mono text-[10px] text-muted-sand">{diffLines.filter((d) => d.changed).length} changed lines</span>
            </div>
            <div className="overflow-auto max-h-[240px] p-3 space-y-0.5">
              {diffLines.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-start gap-2 px-2 py-1 rounded transition-all duration-150',
                    line.changed && 'bg-warm-amber/5 border border-warm-amber/10',
                    !line.changed && 'border border-transparent'
                  )}
                >
                  <span className="font-mono text-[10px] text-muted-sand/40 w-6 text-right flex-shrink-0 select-none">
                    {i + 1}
                  </span>
                  {line.changed ? (
                    <div className="flex-1 flex items-start gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-red-400/50 w-4 flex-shrink-0">−</span>
                      <span className="font-mono text-[11px] text-red-400/60 line-through flex-1">{line.left || ' '}</span>
                      <span className="font-mono text-[10px] text-emerald-400/50 w-4 flex-shrink-0">+</span>
                      <span className="font-mono text-[11px] text-emerald-400/60 flex-1">{line.right || ' '}</span>
                    </div>
                  ) : (
                    <span className="font-mono text-[11px] text-muted-sand/50 flex-1">{line.left}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Analysis */}
        <div className="animate-in lg:col-span-4 space-y-4">
          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className={cn(
              'w-full flex items-center justify-center gap-2 font-body font-semibold text-sm py-3 rounded-xl transition-all duration-200',
              analyzing
                ? 'bg-surface-mid text-muted-sand cursor-not-allowed'
                : 'bg-warm-amber text-obsidian hover:scale-[1.02]'
            )}
          >
            <Sparkles size={16} />
            {analyzing ? 'Analyzing...' : 'AI Analysis'}
          </button>

          {/* Classification Legend */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={11} className="text-red-400" />
              <span className="font-mono text-[10px] text-muted-sand">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Palette size={11} className="text-warm-amber" />
              <span className="font-mono text-[10px] text-muted-sand">Substantive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText size={11} className="text-sky-400" />
              <span className="font-mono text-[10px] text-muted-sand">Cosmetic</span>
            </div>
          </div>

          {/* Clause Cards */}
          <div className="space-y-2 max-h-[600px] overflow-auto pr-1">
            {clauses.length > 0 ? (
              clauses.map((clause) => (
                <DiffLine key={clause.id} clause={clause} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-surface-dark border border-subtle-line rounded-xl">
                <Sparkles size={32} className="text-muted-sand/20 mb-2" />
                <p className="font-body text-[13px] text-muted-sand/60 mb-1">No analysis yet</p>
                <p className="font-mono text-[10px] text-muted-sand/40">Edit text or click AI Analysis</p>
              </div>
            )}
          </div>

          {/* Email Summary Button */}
          {clauses.length > 0 && (
            <button
              onClick={() => {
                const body = clauses.map((c) => `[${c.classification.toUpperCase()}] ${c.oldText.slice(0, 50)}...`).join('\n')
                alert(`Subject: Contract Change Summary\n\n${body}`)
              }}
              className="w-full flex items-center justify-center gap-2 font-body text-[13px] text-soft-cream border border-subtle-line py-2.5 rounded-xl hover:border-warm-amber/30 hover:bg-warm-amber/5 transition-all"
            >
              <Mail size={14} />
              Generate Email Summary
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
