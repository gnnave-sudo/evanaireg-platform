import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Table2,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Microscope,
  Brain,
  Cpu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import LoadingOverlay from '@/sections/workbench/shared/LoadingOverlay'
import ExportBar from '@/sections/workbench/shared/ExportBar'
import { useSchemaDefine, useTabularExtract, useTabularVerify } from '@/hooks/useJamieAPI'
import type { TabularColumn } from '@/hooks/useJamieAPI'

gsap.registerPlugin(ScrollTrigger)

const columnTypes = ['text', 'number', 'date', 'boolean'] as const

export default function TabularTab() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [nlInput, setNlInput] = useState('')
  const [columns, setColumns] = useState<TabularColumn[]>([
    { name: 'Clause Type', type: 'text', constraint: 'required' },
    { name: 'Governing Law', type: 'text' },
    { name: 'Liability Cap (USD)', type: 'number', constraint: 'required' },
    { name: 'Termination Notice (days)', type: 'number' },
    { name: 'IP Assignment', type: 'text' },
    { name: 'Data Protection', type: 'boolean' },
  ])
  const [selectedModel, setSelectedModel] = useState('gemini-2.5')
  const { defineFromNL, columns: _aiColumns } = useSchemaDefine()
  const { extract, loading: extracting, data: tabularData } = useTabularExtract()
  const { verify, verifying, result: verifyResult } = useTabularVerify()
  const [editingCol, setEditingCol] = useState<number | null>(null)
  const [newCol, setNewCol] = useState<TabularColumn>({ name: '', type: 'text', constraint: 'none' })
  const [showAddCol, setShowAddCol] = useState(false)

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

  const handleNLSchema = useCallback(async () => {
    if (!nlInput.trim()) return
    const cols = await defineFromNL(nlInput)
    setColumns(cols)
  }, [nlInput, defineFromNL])

  const handleExtract = useCallback(async () => {
    await extract(['msa-v1'], columns, selectedModel)
  }, [extract, columns, selectedModel])

  const handleVerify = useCallback(async () => {
    if (!tabularData) return
    await verify('tabular-1')
  }, [tabularData, verify])

  const addColumn = useCallback(() => {
    if (!newCol.name.trim()) return
    setColumns((prev) => [...prev, { ...newCol, name: newCol.name.trim() }])
    setNewCol({ name: '', type: 'text', constraint: 'none' })
    setShowAddCol(false)
  }, [newCol])

  const removeColumn = useCallback((idx: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const handleExport = useCallback((format: string) => {
    // eslint-disable-next-line no-console
    console.log(`[Tabular] Export as ${format}`)
  }, [])

  const verification = tabularData?.verification ?? verifyResult
  const rows = tabularData?.rows ?? []

  return (
    <div ref={sectionRef} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Schema Builder */}
        <div className="animate-in lg:col-span-4 bg-surface-dark border border-subtle-line rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Table2 size={16} className="text-warm-amber" />
            <h3 className="font-body font-semibold text-[13px] text-soft-cream">Schema Builder</h3>
          </div>

          {/* NL Input */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-muted-sand uppercase tracking-wider">Natural Language Schema</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                placeholder="e.g., Extract governing law, liability cap, termination notice"
                className="flex-1 bg-obsidian border border-subtle-line rounded-lg px-3 py-2 font-body text-[12px] text-soft-cream placeholder:text-muted-sand/50 outline-none focus:border-warm-amber/40"
                onKeyDown={(e) => e.key === 'Enter' && handleNLSchema()}
              />
              <button
                onClick={handleNLSchema}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-warm-amber/10 border border-warm-amber/20 flex items-center justify-center text-warm-amber hover:bg-warm-amber/20 transition-all"
              >
                <Sparkles size={14} />
              </button>
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-1.5 block">Extraction Model</label>
            <div className="flex gap-2">
              {[
                { value: 'gemini-2.5', label: 'Gemini 2.5', icon: Brain },
                { value: 'gemini-3.0', label: 'Gemini 3.0', icon: Cpu },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedModel(m.value)}
                  className={cn(
                    'flex items-center gap-1.5 font-mono text-[11px] px-3 py-2 rounded-lg border transition-all duration-200',
                    selectedModel === m.value
                      ? 'bg-warm-amber/10 border-warm-amber/30 text-warm-amber'
                      : 'bg-obsidian border-subtle-line text-muted-sand hover:text-soft-cream'
                  )}
                >
                  <m.icon size={13} />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-[10px] text-muted-sand uppercase tracking-wider">Columns ({columns.length})</label>
              <button
                onClick={() => setShowAddCol(!showAddCol)}
                className="flex items-center gap-1 font-mono text-[10px] text-warm-amber hover:text-soft-cream transition-colors"
              >
                <Plus size={12} />
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-auto pr-1">
              {columns.map((col, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-obsidian/50 rounded-lg border border-subtle-line group"
                >
                  <span className="font-mono text-[10px] text-muted-sand/50 w-4">{idx + 1}</span>
                  {editingCol === idx ? (
                    <input
                      autoFocus
                      value={col.name}
                      onChange={(e) => setColumns((prev) => prev.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))}
                      onBlur={() => setEditingCol(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingCol(null)}
                      className="flex-1 bg-obsidian border border-subtle-line rounded px-2 py-0.5 font-body text-[12px] text-soft-cream outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingCol(idx)}
                      className="flex-1 font-body text-[12px] text-soft-cream cursor-text"
                    >
                      {col.name}
                    </span>
                  )}
                  <span className="font-mono text-[9px] text-muted-sand uppercase">{col.type}</span>
                  {col.constraint === 'required' && <span className="font-mono text-[9px] text-red-400">*</span>}
                  <button
                    onClick={() => removeColumn(idx)}
                    className="opacity-0 group-hover:opacity-100 text-muted-sand hover:text-red-400 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>

            {showAddCol && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-warm-amber/5 rounded-lg border border-warm-amber/20">
                <input
                  autoFocus
                  value={newCol.name}
                  onChange={(e) => setNewCol((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Column name"
                  className="flex-1 bg-obsidian border border-subtle-line rounded px-2 py-1 font-body text-[12px] text-soft-cream placeholder:text-muted-sand/50 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addColumn()}
                />
                <select
                  value={newCol.type}
                  onChange={(e) => setNewCol((prev) => ({ ...prev, type: e.target.value as typeof columnTypes[number] }))}
                  className="bg-obsidian border border-subtle-line rounded px-2 py-1 font-mono text-[10px] text-soft-cream outline-none"
                >
                  {columnTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button onClick={addColumn} className="text-warm-amber hover:text-soft-cream transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Extract Button */}
          <button
            onClick={handleExtract}
            disabled={extracting}
            className={cn(
              'w-full flex items-center justify-center gap-2 font-body font-semibold text-sm py-2.5 rounded-lg transition-all duration-200',
              extracting
                ? 'bg-surface-mid text-muted-sand cursor-not-allowed'
                : 'bg-warm-amber text-obsidian hover:scale-[1.02]'
            )}
          >
            <Microscope size={16} />
            {extracting ? 'Extracting...' : 'Extract Data'}
          </button>
        </div>

        {/* Right: Data Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="animate-in relative bg-surface-dark border border-subtle-line rounded-xl p-4 min-h-[360px]">
            {extracting && <LoadingOverlay message="Extracting structured data..." subMessage={`Using ${selectedModel} model across 47 pages`} />}

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Table2 size={16} className="text-warm-amber" />
                <span className="font-body font-medium text-[13px] text-soft-cream">Extracted Data</span>
                {rows.length > 0 && (
                  <span className="font-mono text-[10px] text-muted-sand">{rows.length} rows</span>
                )}
              </div>
              {rows.length > 0 && (
                <ExportBar formats={['csv', 'excel', 'json']} onExport={handleExport} />
              )}
            </div>

            {rows.length > 0 ? (
              <div className="overflow-auto max-h-[360px]">
                <table className="w-full">
                  <thead className="sticky top-0">
                    <tr className="bg-surface-mid border-b border-subtle-line">
                      <th className="font-mono text-[10px] text-muted-sand uppercase tracking-wider text-left px-3 py-2 w-8">#</th>
                      {columns.map((col, i) => (
                        <th key={i} className="font-mono text-[10px] text-muted-sand uppercase tracking-wider text-left px-3 py-2 whitespace-nowrap">
                          {col.name}
                          {col.constraint === 'required' && <span className="text-red-400 ml-0.5">*</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, ri) => (
                      <tr key={row.id} className="border-b border-subtle-line/50 hover:bg-warm-amber/5 transition-colors">
                        <td className="font-mono text-[10px] text-muted-sand/50 px-3 py-2">{ri + 1}</td>
                        {columns.map((col, ci) => {
                          const val = row[col.name]
                          return (
                            <td key={ci} className="px-3 py-2">
                              {typeof val === 'boolean' ? (
                                val ? (
                                  <CheckCircle size={14} className="text-emerald-400" />
                                ) : (
                                  <XCircle size={14} className="text-red-400/60" />
                                )
                              ) : (
                                <span className="font-body text-[12px] text-soft-cream">
                                  {val?.toString() ?? <span className="text-muted-sand/30">—</span>}
                                </span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-center">
                <Table2 size={48} className="text-muted-sand/15 mb-3" />
                <p className="font-body text-[14px] text-muted-sand/60 mb-1">Define schema and extract</p>
                <p className="font-mono text-[11px] text-muted-sand/40">Use natural language or build column-by-column</p>
              </div>
            )}
          </div>

          {/* Verification Panel */}
          {verification && (
            <div className="animate-in bg-surface-dark border border-subtle-line rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Microscope size={16} className="text-warm-amber" />
                  <h4 className="font-body font-semibold text-[13px] text-soft-cream">Verification Results</h4>
                </div>
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="font-mono text-[11px] text-warm-amber bg-warm-amber/10 border border-warm-amber/20 px-3 py-1.5 rounded-lg hover:bg-warm-amber/20 transition-all"
                >
                  {verifying ? 'Verifying...' : 'Run Verification'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-surface-mid/50 rounded-lg border border-subtle-line">
                  <div className="font-mono text-xl font-bold text-soft-cream">{verification.passed + verification.failed}</div>
                  <div className="font-mono text-[10px] text-muted-sand uppercase">Total Checks</div>
                </div>
                <div className="text-center p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                  <div className="font-mono text-xl font-bold text-emerald-400">{verification.passed}</div>
                  <div className="font-mono text-[10px] text-emerald-400/70 uppercase flex items-center justify-center gap-1">
                    <CheckCircle size={10} /> Passed
                  </div>
                </div>
                <div className="text-center p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                  <div className="font-mono text-xl font-bold text-red-400">{verification.failed}</div>
                  <div className="font-mono text-[10px] text-red-400/70 uppercase flex items-center justify-center gap-1">
                    <XCircle size={10} /> Failed
                  </div>
                </div>
              </div>

              {verification.failures.length > 0 && (
                <div className="space-y-2 max-h-[160px] overflow-auto">
                  {verification.failures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-mono text-[10px] text-red-400 mb-0.5">
                          Row {f.row + 1} — {f.column}
                        </div>
                        <p className="font-body text-[11px] text-muted-sand">{f.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
