import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Network,
  Sparkles,
  GitBranch,
  Building2,
  Landmark,
  Users,
  MousePointerClick,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import LoadingOverlay from '@/sections/workbench/shared/LoadingOverlay'
import ExportBar from '@/sections/workbench/shared/ExportBar'
import ChatPanel from '@/sections/workbench/shared/ChatPanel'
import { useChartGenerate, useChartRefine } from '@/hooks/useJamieAPI'
import type { ChartNode, ChartEdge } from '@/hooks/useJamieAPI'

gsap.registerPlugin(ScrollTrigger)

const chartTypes = [
  { value: 'ownership' as const, label: 'Ownership', icon: GitBranch },
  { value: 'lbo' as const, label: 'LBO Structure', icon: Building2 },
  { value: 'fund' as const, label: 'Fund Structure', icon: Landmark },
  { value: 'org' as const, label: 'Org Chart', icon: Users },
]

const mockDescription = `Holdings Ltd (Cayman Islands) owns 100% of Cayman SPV, which in turn owns 85% of Operating Co (Delaware). Fund I LP and Fund II LP are feeder funds into the Cayman SPV with 45% and 30% indirect ownership respectively. Management holds 15% of Operating Co directly. Operating Co has two wholly-owned subsidiaries: Subsidiary A (US operations) and Subsidiary B (European operations).`

function getNodeColor(type: ChartNode['type']): string {
  switch (type) {
    case 'entity': return '#E8A838'
    case 'spv': return '#38bdf8'
    case 'fund': return '#10b981'
    case 'person': return '#f472b6'
    default: return '#9B968B'
  }
}

function InteractiveChart({
  nodes,
  edges,
  selectedNodeId,
  onNodeClick,
}: {
  nodes: ChartNode[]
  edges: ChartEdge[]
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const zoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.5))
  const zoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4))
  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }))
  }
  const handleMouseUp = () => { isDragging.current = false }

  const svgWidth = 800
  const svgHeight = 460

  return (
    <div className="relative w-full h-[440px] bg-obsidian/50 rounded-lg border border-subtle-line overflow-hidden">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button onClick={zoomIn} className="w-8 h-8 rounded-lg bg-surface-dark border border-subtle-line flex items-center justify-center text-muted-sand hover:text-soft-cream hover:border-warm-amber/30 transition-all">
          <ZoomIn size={14} />
        </button>
        <button onClick={zoomOut} className="w-8 h-8 rounded-lg bg-surface-dark border border-subtle-line flex items-center justify-center text-muted-sand hover:text-soft-cream hover:border-warm-amber/30 transition-all">
          <ZoomOut size={14} />
        </button>
        <button onClick={reset} className="w-8 h-8 rounded-lg bg-surface-dark border border-subtle-line flex items-center justify-center text-muted-sand hover:text-soft-cream hover:border-warm-amber/30 transition-all">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* SVG */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#9B968B" opacity="0.5" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from)
            const toNode = nodes.find((n) => n.id === edge.to)
            if (!fromNode || !toNode) return null

            // Calculate edge start/end points at node boundaries
            const dx = toNode.x - fromNode.x
            const dy = toNode.y - fromNode.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const nodeRadius = 30
            const startX = fromNode.x + (dx / dist) * nodeRadius
            const startY = fromNode.y + (dy / dist) * nodeRadius
            const endX = toNode.x - (dx / dist) * nodeRadius
            const endY = toNode.y - (dy / dist) * nodeRadius

            return (
              <g key={i}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="rgba(155, 150, 139, 0.3)"
                  strokeWidth={1.5}
                />
                <text
                  x={(startX + endX) / 2}
                  y={(startY + endY) / 2 - 5}
                  fill="#9B968B"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {edge.label} {edge.ownership}%
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id
            return (
              <g
                key={node.id}
                onClick={(e) => { e.stopPropagation(); onNodeClick(node.id) }}
                className="cursor-pointer"
                filter={isSelected ? 'url(#glow)' : undefined}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 34 : 30}
                  fill={isSelected ? `${getNodeColor(node.type)}22` : '#15151C'}
                  stroke={getNodeColor(node.type)}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all duration-200"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  fill={getNodeColor(node.type)}
                  fontSize={isSelected ? 12 : 11}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={isSelected ? 700 : 500}
                  textAnchor="middle"
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + 46}
                  fill="#9B968B"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                  opacity={0.7}
                >
                  {node.type}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-surface-dark/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-subtle-line">
        {(['entity', 'spv', 'fund', 'person'] as const).map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getNodeColor(type) }} />
            <span className="font-mono text-[9px] text-muted-sand uppercase">{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChartsTab() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [description, setDescription] = useState(mockDescription)
  const [chartType, setChartType] = useState<'ownership' | 'lbo' | 'fund' | 'org'>('ownership')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const { generate, loading: generating, chart } = useChartGenerate()
  const { refine, refining } = useChartRefine()
  const [refineMessages, setRefineMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: Date }[]>([])

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

  const handleGenerate = useCallback(async () => {
    await generate(description, chartType)
  }, [description, chartType, generate])

  const handleRefine = useCallback(async (message: string) => {
    const userMsg = { id: `ref-${Date.now()}`, role: 'user' as const, content: message, timestamp: new Date() }
    setRefineMessages((prev) => [...prev, userMsg])

    if (chart) {
      const res = await refine(chart.type, message)
      const assistantMsg = {
        id: `ref-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: `${res.message}. The chart has been updated with your requested changes.`,
        timestamp: new Date(),
      }
      setRefineMessages((prev) => [...prev, assistantMsg])
    }
  }, [chart, refine])

  const handleExport = useCallback((format: string) => {
    // eslint-disable-next-line no-console
    console.log(`[Charts] Export as ${format}`)
  }, [])

  const nodes = chart?.nodes ?? []
  const edges = chart?.edges ?? []

  return (
    <div ref={sectionRef} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Input */}
        <div className="animate-in lg:col-span-4 bg-surface-dark border border-subtle-line rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Network size={16} className="text-warm-amber" />
            <h3 className="font-body font-semibold text-[13px] text-soft-cream">Structure Description</h3>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
            className="w-full bg-obsidian border border-subtle-line rounded-lg px-3 py-2.5 font-body text-[13px] text-soft-cream placeholder:text-muted-sand/50 outline-none focus:border-warm-amber/40 resize-none leading-relaxed"
          />

          {/* Chart Type Selector */}
          <div>
            <label className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-2 block">Chart Type</label>
            <div className="grid grid-cols-2 gap-2">
              {chartTypes.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => setChartType(ct.value)}
                  className={cn(
                    'flex items-center gap-2 font-body text-[12px] py-2.5 px-3 rounded-lg border transition-all duration-200',
                    chartType === ct.value
                      ? 'bg-warm-amber/10 border-warm-amber/30 text-warm-amber'
                      : 'bg-obsidian border-subtle-line text-muted-sand hover:text-soft-cream'
                  )}
                >
                  <ct.icon size={14} />
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className={cn(
              'w-full flex items-center justify-center gap-2 font-body font-semibold text-sm py-2.5 rounded-lg transition-all duration-200',
              generating
                ? 'bg-surface-mid text-muted-sand cursor-not-allowed'
                : 'bg-warm-amber text-obsidian hover:scale-[1.02]'
            )}
          >
            <Sparkles size={16} />
            {generating ? 'Generating Chart...' : 'Generate Chart'}
          </button>
        </div>

        {/* Right: Chart */}
        <div className="lg:col-span-8 space-y-4">
          <div className="animate-in relative bg-surface-dark border border-subtle-line rounded-xl p-4">
            {generating && <LoadingOverlay message="Generating structure chart..." subMessage="Parsing entities and relationships" />}

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitBranch size={16} className="text-warm-amber" />
                <span className="font-body font-medium text-[13px] text-soft-cream">
                  {chartTypes.find((c) => c.value === chartType)?.label} Chart
                </span>
              </div>
              {chart && (
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-muted-sand">
                    {nodes.length} nodes · {edges.length} edges
                  </span>
                  <ExportBar formats={['svg', 'png']} onExport={handleExport} />
                </div>
              )}
            </div>

            {chart ? (
              <InteractiveChart
                nodes={nodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                onNodeClick={setSelectedNodeId}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[440px] text-center bg-obsidian/30 rounded-lg border border-subtle-line border-dashed">
                <Network size={48} className="text-muted-sand/15 mb-3" />
                <p className="font-body text-[14px] text-muted-sand/60 mb-1">Describe your corporate structure</p>
                <p className="font-mono text-[11px] text-muted-sand/40">AI will generate an interactive ownership diagram</p>
              </div>
            )}

            {selectedNodeId && chart && (
              <div className="mt-3 p-3 bg-warm-amber/5 border border-warm-amber/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <MousePointerClick size={14} className="text-warm-amber" />
                  <span className="font-mono text-[11px] text-warm-amber">
                    Selected: {nodes.find((n) => n.id === selectedNodeId)?.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-sand">
                    ({nodes.find((n) => n.id === selectedNodeId)?.type})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Refinement Chat */}
      {chart && (
        <div className="animate-in">
          <ChatPanel
            title="Chart Refinement"
            placeholder="e.g., 'Add Cayman SPV between Holdings and Operating Co'"
            messages={refineMessages}
            onSendMessage={handleRefine}
            isLoading={refining}
            className="h-[300px]"
            showSuggestions={true}
          />
        </div>
      )}
    </div>
  )
}
