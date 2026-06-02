import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  Brain,
  PlugZap,
  FileMinus,
  Route,
  Mic,
  Shield,
  Layers,
  Activity,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  FileSearch,
  GitBranch,
  TrendingDown,
  Zap,
  ArrowRight,
  Server,
  Database,
  Lock,
  Globe,
  CreditCard,
  FileText,
  Handshake,
  Search,
  Send,
  CircleDot,
  Flag,
} from 'lucide-react'
import {
  systemLayers,
  stressResults,
  credibilityEntries,
  escalationItems,
  patternExtracts,
  driftEvents,
} from '@/data/quantMockData'
import {
  vosAgents,
  mexicoStressScenarios,
  pomeloTransactions,
  complianceObligations,
  riskFlags,
  nlQueryExamples,
  thresholdStatus,
  pepScreeningStatus,
  buildMexicoRadarData,
} from '@/data/vosData'
import type { StressResult } from '@/types/quant'
import type { VosAgent, ComplianceObligation, RiskFlag } from '@/types/vos'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────── helpers ─────────────────── */

function tierColor(tier: string): string {
  switch (tier) {
    case 'HIGHLY_RELIABLE': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    case 'STRONG': return 'text-sky-400 border-sky-400/30 bg-sky-400/10'
    case 'ACCEPTABLE': return 'text-warm-amber border-warm-amber/30 bg-warm-amber/10'
    case 'WEAK': return 'text-orange-400 border-orange-400/30 bg-orange-400/10'
    case 'HIGH_RISK': return 'text-red-400 border-red-400/30 bg-red-400/10'
    default: return 'text-muted-sand border-muted-sand/30 bg-muted-sand/10'
  }
}

function tierLabel(tier: string): string {
  return tier.replace(/_/g, ' ')
}

function priorityColor(p: string): string {
  switch (p) {
    case 'P0': return 'text-red-400 border-red-400/40 bg-red-400/15'
    case 'P1': return 'text-warm-amber border-warm-amber/40 bg-warm-amber/15'
    case 'P2': return 'text-sky-400 border-sky-400/40 bg-sky-400/15'
    default: return 'text-muted-sand'
  }
}

function recColor(rec: string): string {
  switch (rec) {
    case 'PROCEED': return 'text-emerald-400 border-emerald-400/40 bg-emerald-400/15'
    case 'HOLD': return 'text-warm-amber border-warm-amber/40 bg-warm-amber/15'
    case 'NO-GO': return 'text-red-400 border-red-400/40 bg-red-400/15'
    default: return 'text-muted-sand'
  }
}

function buildRadarData(stress: StressResult[]) {
  if (!stress.length) return []
  const dims = Object.keys(stress[0].dimensions)
  return dims.map((dim) => {
    const row: Record<string, string | number> = { dimension: dim }
    stress.forEach((s) => { row[`Scenario ${s.scenario}`] = s.dimensions[dim] ?? 0 })
    return row
  })
}

function severityColor(sev: string): string {
  switch (sev) {
    case 'CRITICAL': return 'text-red-400 border-red-400/40 bg-red-400/15'
    case 'HIGH': return 'text-warm-amber border-warm-amber/40 bg-warm-amber/15'
    case 'MEDIUM': return 'text-sky-400 border-sky-400/40 bg-sky-400/15'
    default: return 'text-muted-sand border-muted-sand/30 bg-muted-sand/10'
  }
}

function obligationStatusColor(status: string): string {
  switch (status) {
    case 'Active': return 'text-emerald-400 border-emerald-400/40 bg-emerald-400/15'
    case 'Due Soon': return 'text-warm-amber border-warm-amber/40 bg-warm-amber/15'
    case 'CRITICAL': return 'text-red-400 border-red-400/40 bg-red-400/15'
    case 'Scheduled': return 'text-sky-400 border-sky-400/40 bg-sky-400/15'
    default: return 'text-muted-sand border-muted-sand/30 bg-muted-sand/10'
  }
}

function getVosAgentIcon(icon: VosAgent['icon'], size = 20) {
  switch (icon) {
    case 'globe': return <Globe size={size} className="text-warm-amber" />
    case 'credit-card': return <CreditCard size={size} className="text-warm-amber" />
    case 'file-text': return <FileText size={size} className="text-warm-amber" />
    case 'handshake': return <Handshake size={size} className="text-warm-amber" />
    default: return <Globe size={size} className="text-warm-amber" />
  }
}

/* ─────────────────── Section 1: Hero ─────────────────── */

function HeroSection() {
  const labelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 20 })
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
      }
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 30 })
        tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.5)
      }
      if (subRef.current) {
        gsap.set(subRef.current, { opacity: 0, y: 20 })
        tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.9)
      }
      if (tagRef.current) {
        gsap.set(tagRef.current, { opacity: 0, y: 15 })
        tl.to(tagRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.2)
      }
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.stat-item')
        gsap.set(items, { opacity: 0, y: 15 })
        tl.to(items, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.5)
      }
    })
    return () => ctx.revert()
  }, [])

  const stats = [
    { number: '4', label: 'Vos Agents', highlight: true },
    { number: '7', label: 'Quant Layers', highlight: false },
    { number: '4', label: 'Stress Agents', highlight: false },
    { number: '118+', label: 'Integrations', highlight: true },
    { number: '80%', label: 'Token Compression', highlight: true },
  ]

  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 md:px-12 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 30% 50%, rgba(232,168,56,0.12), transparent 70%), #0A0A0F`,
      }}
    >
      <div className="relative z-10 flex flex-col items-center text-center max-w-[900px] mt-16">
        {/* Label */}
        <div ref={labelRef} className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-6">
          EvanAIRegPlatform — Unified Compliance &amp; Contract Lifecycle
        </div>

        {/* Title */}
        <h1 ref={titleRef} className="font-display text-[72px] md:text-[120px] leading-[0.95] tracking-[-0.03em] text-soft-cream mb-4">
          <span className="block">EvanAI</span>
        </h1>

        {/* Subtitle */}
        <p ref={subRef} className="font-body text-[20px] md:text-[28px] text-warm-amber font-medium mb-4">
          Regulatory Intelligence, Powered by AI
        </p>

        {/* Tagline */}
        <div ref={tagRef} className="font-display text-[18px] md:text-[22px] text-muted-sand italic mb-10">
          she can combine and ensure satisfaction
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#installation"
            className="font-body font-semibold text-sm bg-warm-amber text-obsidian px-8 py-[14px] rounded-[10px] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(232,168,56,0.25)] inline-flex items-center gap-2"
          >
            <Zap size={16} />
            Get Started
          </a>
          <a
            href="#stack"
            className="font-body font-medium text-sm text-soft-cream border border-[rgba(240,237,230,0.15)] px-8 py-[14px] rounded-[10px] transition-all duration-200 hover:border-warm-amber hover:text-warm-amber hover:bg-[rgba(232,168,56,0.08)] inline-flex items-center gap-2"
          >
            <Layers size={16} />
            Explore the Stack
          </a>
        </div>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        className="absolute bottom-16 md:bottom-20 left-0 right-0 z-10 flex items-center justify-center gap-8 md:gap-16 flex-wrap px-5"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="stat-item flex flex-col items-center text-center">
            <span className={`font-mono font-medium text-2xl md:text-[32px] ${stat.highlight ? 'text-warm-amber' : 'text-soft-cream'}`}>
              {stat.number}
            </span>
            <span className="font-mono text-[11px] text-muted-sand mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────── Section 2: AI Engine ─────────────────── */

const aiCapabilities = [
  {
    icon: Brain,
    title: 'Memory Trees',
    subtitle: 'Regulatory Knowledge Base',
    description:
      'Local-first knowledge base. All regulatory data canonicalized into Markdown chunks, scored, and folded into hierarchical summary trees. Powers the Pattern Extraction layer.',
    badge: 'L3 Pattern Intelligence',
  },
  {
    icon: PlugZap,
    title: '118+ Auto-Fetch Integrations',
    subtitle: 'Live Regulatory Feed',
    description:
      'Gmail, Notion, GitHub, Slack, regulatory feeds. One-click OAuth. Auto-pulls fresh regulatory data every 20 minutes. Powers L0 Raw Input and L1 Intake.',
    badge: 'L0-L1 Pipeline',
  },
  {
    icon: FileMinus,
    title: 'TokenJuice',
    subtitle: 'Smart Document Compression',
    description:
      'Every regulatory document, email, and memo runs through token compression before LLM analysis. HTML to Markdown, deduping, CJK preservation. 80% cost/latency reduction.',
    badge: 'L2 Stress Lab Input',
  },
  {
    icon: Route,
    title: 'Model Routing',
    subtitle: 'Intelligent LLM Selection',
    description:
      'Built-in routing sends each regulatory analysis to the right LLM — reasoning for complex interpretation, fast for routine checks, vision for document review. One subscription.',
    badge: 'L2-L6 All Layers',
  },
  {
    icon: Mic,
    title: 'Native Voice',
    subtitle: 'Voice-Powered Briefings',
    description:
      'Whisper STT in, ElevenLabs TTS out. Ask EvanAIRegPlatform about regulatory risk via voice. Mascot lip-sync for briefings. Joins compliance calls as a participant.',
    badge: 'L5 Output Delivery',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    subtitle: 'Client-Confidential by Design',
    description:
      'End-to-end encrypted. Workflow data stays on-device. Local SQLite. Sandboxing. Self-hostable. Your regulatory data never leaves your infrastructure.',
    badge: 'L6 Learning + All',
  },
]

function AIEngineSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.ai-card')
        gsap.set(cards, { opacity: 0, y: 40 })
        ScrollTrigger.create({
          trigger: cardsRef.current,
          start: 'top 80%',
          onEnter: () =>
            gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12 bg-obsidian">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">AI Engine</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            AI Capabilities Powering the Quant Stack
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Six core AI technologies, each integrated into specific layers of the Quant Stack for end-to-end regulatory intelligence.
          </p>
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCapabilities.map((cap) => {
            const Icon = cap.icon
            return (
              <div
                key={cap.title}
                className="ai-card group relative bg-surface-dark border border-subtle-line rounded-xl p-6 transition-all duration-300 hover:border-warm-amber/40 hover:bg-[rgba(232,168,56,0.04)] hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-warm-amber/10 border border-warm-amber/20 flex items-center justify-center">
                    <Icon size={20} className="text-warm-amber" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body font-semibold text-[16px] text-soft-cream leading-tight">
                      {cap.title}
                    </h3>
                    <p className="font-body text-[13px] text-warm-amber mt-0.5">{cap.subtitle}</p>
                  </div>
                </div>
                <p className="font-body text-[14px] text-muted-sand leading-relaxed mb-4">
                  {cap.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center font-mono text-[11px] font-medium text-warm-amber bg-warm-amber/10 border border-warm-amber/20 px-2.5 py-1 rounded-full">
                    {cap.badge}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── Section 3 (NEW): Vos Agent Panel ─────────────────── */

function VosAgentPanel() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.vos-card')
        gsap.set(cards, { opacity: 0, y: 40 })
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 80%',
          onEnter: () =>
            gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12" style={{ background: '#0F0F14' }}>
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">Vos Agents</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            Compliance Agents
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Four specialised agents monitoring Vortex Pay across regulatory intelligence, transactions, reporting, and corporate compliance.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vosAgents.map((agent) => (
            <div
              key={agent.id}
              className="vos-card group relative bg-surface-dark border border-subtle-line rounded-xl p-6 transition-all duration-300 hover:border-warm-amber/40 hover:bg-[rgba(232,168,56,0.04)] hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-warm-amber/10 border border-warm-amber/20 flex items-center justify-center">
                  {getVosAgentIcon(agent.icon, 20)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-body font-semibold text-[16px] text-soft-cream leading-tight">
                      {agent.shortName}
                    </h3>
                    <span className="font-mono text-[10px] text-muted-sand">— {agent.name}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-[11px] text-emerald-400">{agent.status}</span>
                    </span>
                    <span className="font-mono text-[11px] text-warm-amber">
                      {agent.statLabel}: {agent.statValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="font-body text-[13px] text-muted-sand leading-relaxed mb-4">
                {agent.description}
              </p>

              {/* Tools */}
              <div className="flex flex-wrap gap-1.5">
                {agent.tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-mono text-[10px] text-muted-sand bg-obsidian border border-subtle-line px-2 py-0.5 rounded-md transition-all duration-200 group-hover:border-warm-amber/20"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── Section 4: 7-Layer Pipeline ─────────────────── */

const layerDescriptions: Record<string, string> = {
  'L0 Raw Input': 'Raw regulatory data ingestion from 118+ sources',
  'L1 Intake': 'Document normalization and deduplication via TokenJuice',
  'L2 Stress Lab': '4-agent adversarial simulation on every matter',
  'L3 Patterns': 'Pattern extraction powered by Memory Trees',
  'L4 Alignment': 'Cross-layer regulatory alignment checks',
  'L5 Outputs': 'Voice briefings, reports, and regulatory filings',
  'L6 Learning': 'Continuous model improvement from outcomes',
  'CS Credibility': 'Counsel scoring across 6 dimensions',
}

const layerToAIFeature: Record<string, string> = {
  'L0 Raw Input': '118+ Integrations',
  'L1 Intake': 'TokenJuice',
  'L2 Stress Lab': 'Model Routing',
  'L3 Patterns': 'Memory Trees',
  'L4 Alignment': 'Model Routing',
  'L5 Outputs': 'Native Voice',
  'L6 Learning': 'Privacy First',
  'CS Credibility': 'Model Routing',
}

function PipelineSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const pipelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (pipelineRef.current) {
        const items = pipelineRef.current.querySelectorAll('.layer-item')
        gsap.set(items, { opacity: 0, x: -20 })
        ScrollTrigger.create({
          trigger: pipelineRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(items, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12" style={{ background: '#0F0F14' }}>
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">7-Layer Pipeline</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            From Raw Input to Regulatory Intelligence
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Every piece of regulatory data flows through seven processing layers, powered by AI at each step.
          </p>
        </div>

        <div ref={pipelineRef} className="space-y-3">
          {systemLayers.map((layer, idx) => (
            <div
              key={layer.id}
              className="layer-item group flex flex-col md:flex-row md:items-center gap-3 md:gap-6 bg-surface-dark border border-subtle-line rounded-xl px-5 py-4 transition-all duration-200 hover:border-warm-amber/30"
            >
              {/* Layer ID */}
              <div className="flex items-center gap-3 md:w-[200px] flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-warm-amber/10 border border-warm-amber/20 flex items-center justify-center">
                  <span className="font-mono text-[12px] font-bold text-warm-amber">{layer.id}</span>
                </div>
                <div>
                  <div className="font-body font-semibold text-[14px] text-soft-cream leading-tight">{layer.name}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[11px] text-emerald-400">{layer.status}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 md:min-w-0">
                <p className="font-body text-[13px] text-muted-sand leading-relaxed">
                  {layerDescriptions[layer.name]}
                </p>
              </div>

              {/* Throughput */}
              <div className="flex items-center gap-2 md:w-[100px] flex-shrink-0">
                <Activity size={14} className="text-muted-sand" />
                <span className="font-mono text-[12px] text-muted-sand">{layer.throughput}</span>
              </div>

              {/* AI Feature Badge */}
              <div className="flex items-center gap-2 md:w-[140px] flex-shrink-0 justify-end">
                <span className="inline-flex items-center font-mono text-[10px] font-medium text-warm-amber bg-warm-amber/10 border border-warm-amber/20 px-2 py-0.5 rounded-full">
                  {layerToAIFeature[layer.name]}
                </span>
                {idx < systemLayers.length - 1 && (
                  <ChevronRight size={14} className="text-muted-sand hidden md:block" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


/* ─────────────────── Section 5 (NEW): NL Command Center ─────────────────── */

function NLCommandCenter() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (contentRef.current) {
        const items = contentRef.current.querySelectorAll('.nl-item')
        gsap.set(items, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top 80%',
          onEnter: () =>
            gsap.to(items, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12 bg-obsidian">
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">Natural Language Interface</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            Ask EvanAIRegPlatform Anything
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Query Vos agents using natural language. Draft reports, check statuses, monitor obligations — all through conversational commands.
          </p>
        </div>

        <div ref={contentRef} className="max-w-[720px] mx-auto">
          {/* Input Area */}
          <div className="nl-item bg-surface-dark border border-subtle-line rounded-xl p-4 mb-8 transition-all duration-300 hover:border-warm-amber/30">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-muted-sand flex-shrink-0" />
              <input
                type="text"
                readOnly
                placeholder="e.g., 'What AML filings are due in 30 days?' or 'Check transaction TX-0042 for threshold status'"
                className="flex-1 bg-transparent font-body text-[14px] text-soft-cream placeholder:text-muted-sand/50 outline-none"
              />
              <button className="flex-shrink-0 w-9 h-9 rounded-lg bg-warm-amber/10 border border-warm-amber/20 flex items-center justify-center transition-all duration-200 hover:bg-warm-amber/20">
                <Mic size={16} className="text-warm-amber" />
              </button>
              <button className="flex-shrink-0 w-9 h-9 rounded-lg bg-warm-amber text-obsidian flex items-center justify-center transition-all duration-200 hover:scale-[1.05]">
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Example Queries */}
          <div className="nl-item space-y-3 mb-8">
            <div className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-3">Example queries</div>
            {nlQueryExamples.map((ex, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 p-3 bg-surface-dark border border-subtle-line rounded-lg transition-all duration-200 hover:border-warm-amber/30 cursor-pointer"
              >
                <span className="flex-1 font-body text-[13px] text-muted-sand group-hover:text-soft-cream transition-colors duration-200">
                  &ldquo;{ex.query}&rdquo;
                </span>
                <span className="font-mono text-[10px] text-warm-amber bg-warm-amber/10 border border-warm-amber/20 px-2 py-0.5 rounded">
                  {ex.procedure}
                </span>
              </div>
            ))}
          </div>

          {/* Powered by */}
          <div className="nl-item flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-[11px] text-muted-sand">Powered by:</span>
            <span className="font-mono text-[11px] text-soft-cream bg-surface-dark border border-subtle-line px-3 py-1 rounded-md">
              AI Voice Engine
            </span>
            <span className="font-mono text-[11px] text-soft-cream bg-surface-dark border border-subtle-line px-3 py-1 rounded-md">
              LLM Engine
            </span>
            <span className="font-mono text-[11px] text-soft-cream bg-surface-dark border border-subtle-line px-3 py-1 rounded-md">
              Gemini 2.5 Pro
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── Section 6: Live Dashboard ─────────────────── */

function StressLabWidget() {
  const radarData = buildRadarData(stressResults)
  const current = stressResults[0]

  return (
    <div className="bg-surface-dark border border-subtle-line rounded-xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-warm-amber" />
          <h3 className="font-body font-semibold text-[15px] text-soft-cream">Stress Lab Results</h3>
        </div>
        <span className={`font-mono text-[11px] font-medium px-2 py-0.5 rounded border ${recColor(current?.recommendation ?? 'HOLD')}`}>
          {current?.recommendation ?? 'HOLD'}
        </span>
      </div>

      <div className="flex-1" style={{ minHeight: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
            <PolarGrid stroke="rgba(240,237,230,0.08)" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#9B968B', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Scenario 1"
              dataKey="Scenario 1"
              stroke="#E8A838"
              fill="#E8A838"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Scenario 2"
              dataKey="Scenario 2"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.1}
              strokeWidth={1.5}
            />
            <Tooltip
              contentStyle={{
                background: '#1C1C26',
                border: '1px solid rgba(240,237,230,0.1)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#F0EDE6', fontFamily: 'JetBrains Mono, monospace' }}
              itemStyle={{ color: '#9B968B', fontFamily: 'JetBrains Mono, monospace' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-subtle-line">
        <p className="font-body text-[13px] text-muted-sand leading-relaxed line-clamp-2">
          {current?.businessAdvocate}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-mono text-[11px] text-muted-sand">Risk: {current?.overallRisk}%</span>
          <span className="font-mono text-[11px] text-muted-sand">{current?.id}</span>
        </div>
      </div>
    </div>
  )
}

function CredibilityWidget() {
  const top3 = [...credibilityEntries].sort((a, b) => b.weightedScore - a.weightedScore).slice(0, 3)

  return (
    <div className="bg-surface-dark border border-subtle-line rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} className="text-warm-amber" />
        <h3 className="font-body font-semibold text-[15px] text-soft-cream">Credibility Leaderboard</h3>
      </div>
      <div className="space-y-3">
        {top3.map((entry, idx) => (
          <div key={entry.id} className="flex items-center gap-3 p-3 bg-obsidian/50 rounded-lg border border-subtle-line/50">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-warm-amber/10 border border-warm-amber/20 flex items-center justify-center">
              <span className="font-mono text-[11px] font-bold text-warm-amber">{idx + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body font-medium text-[13px] text-soft-cream truncate">
                {entry.counselName}
              </div>
              <div className="font-mono text-[10px] text-muted-sand mt-0.5">{entry.matterId}</div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="font-mono text-[14px] font-bold text-soft-cream">{entry.weightedScore}</span>
              <span className={`font-mono text-[9px] font-medium px-1.5 py-0.5 rounded border ${tierColor(entry.tier)}`}>
                {tierLabel(entry.tier)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EscalationsWidget() {
  return (
    <div className="bg-surface-dark border border-subtle-line rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} className="text-warm-amber" />
        <h3 className="font-body font-semibold text-[15px] text-soft-cream">Active Escalations</h3>
      </div>
      <div className="space-y-3">
        {escalationItems.map((item) => (
          <div key={item.id} className="p-3 bg-obsidian/50 rounded-lg border border-subtle-line/50">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`font-mono text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityColor(item.priority)}`}>
                {item.priority}
              </span>
              <span className="font-body font-medium text-[13px] text-soft-cream truncate">{item.title}</span>
            </div>
            <p className="font-body text-[12px] text-muted-sand leading-relaxed line-clamp-2 mb-2">
              {item.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted-sand">{item.jurisdiction}</span>
              <span className="font-mono text-[10px] text-warm-amber">Due: {item.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PatternsWidget() {
  const latest = patternExtracts[0]

  return (
    <div className="bg-surface-dark border border-subtle-line rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <FileSearch size={18} className="text-warm-amber" />
        <h3 className="font-body font-semibold text-[15px] text-soft-cream">Pattern Alerts</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-obsidian/50 rounded-lg border border-subtle-line/50">
          <div className="font-mono text-[10px] text-warm-amber mb-1">{latest?.jurisdiction}</div>
          <div className="font-body font-medium text-[13px] text-soft-cream mb-2">{latest?.productType}</div>
          <div className="space-y-1.5">
            <div>
              <div className="font-mono text-[9px] text-muted-sand uppercase mb-1">Risk Drivers</div>
              {latest?.riskDrivers.slice(0, 2).map((r, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <ChevronRight size={10} className="text-red-400 flex-shrink-0" />
                  <span className="font-body text-[12px] text-muted-sand">{r}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-mono text-[9px] text-muted-sand uppercase mb-1">Control Weaknesses</div>
              {latest?.controlWeaknesses.slice(0, 2).map((c, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <ChevronRight size={10} className="text-orange-400 flex-shrink-0" />
                  <span className="font-body text-[12px] text-muted-sand">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DriftWidget() {
  const latest = driftEvents[0]

  return (
    <div className="bg-surface-dark border border-subtle-line rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown size={18} className="text-warm-amber" />
        <h3 className="font-body font-semibold text-[15px] text-soft-cream">Drift Tracker</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-obsidian/50 rounded-lg border border-subtle-line/50">
          <div className="font-mono text-[10px] text-warm-amber mb-1">{latest?.productId}</div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <span className="font-mono text-[14px] text-muted-sand line-through">{latest?.previousScore}</span>
              <ArrowRight size={12} className="text-muted-sand" />
              <span className="font-mono text-[14px] text-red-400 font-bold">{latest?.currentScore}</span>
            </div>
            <span className="font-mono text-[11px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
              +{latest?.driftMagnitude}
            </span>
          </div>
          <p className="font-body text-[12px] text-muted-sand leading-relaxed">
            {latest?.postureChange}
          </p>
        </div>
      </div>
    </div>
  )
}

function DashboardSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (gridRef.current) {
        const panels = gridRef.current.querySelectorAll('.dash-panel')
        gsap.set(panels, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(panels, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12 bg-obsidian">
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">Live Dashboard</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            Operational Intelligence
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Real-time visibility into stress lab results, credibility scoring, active escalations, pattern extraction, and drift tracking.
          </p>
        </div>

        <div ref={gridRef} className="space-y-6">
          {/* Top Row: 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="dash-panel">
              <StressLabWidget />
            </div>
            <div className="dash-panel">
              <CredibilityWidget />
            </div>
          </div>
          {/* Bottom Row: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="dash-panel">
              <EscalationsWidget />
            </div>
            <div className="dash-panel">
              <PatternsWidget />
            </div>
            <div className="dash-panel">
              <DriftWidget />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


/* ─────────────────── Section 7 (NEW): Mexico Stress Lab ─────────────────── */

function MexicoStressLab() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const radarRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const mexicoRadarData = buildMexicoRadarData(mexicoStressScenarios)

  const radarColors = [
    { stroke: '#E8A838', fill: '#E8A838', fillOpacity: 0.2, strokeWidth: 2 },
    { stroke: '#38bdf8', fill: '#38bdf8', fillOpacity: 0.15, strokeWidth: 1.5 },
    { stroke: '#a78bfa', fill: '#a78bfa', fillOpacity: 0.12, strokeWidth: 1.5 },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (radarRef.current) {
        gsap.set(radarRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: radarRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(radarRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.mexico-card')
        gsap.set(cards, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: cardsRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12" style={{ background: '#0F0F14' }}>
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">LFPIORPI Stress Lab</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            Mexico Regulatory Scenarios
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Three Mexico LFPIORPI scenarios evaluated by 4-agent adversarial simulation for Vortex Pay compliance.
          </p>
        </div>

        {/* Radar Chart */}
        <div ref={radarRef} className="max-w-[720px] mx-auto mb-12">
          <div className="bg-surface-dark border border-subtle-line rounded-xl p-5">
            <div className="flex items-center justify-center gap-6 mb-4 flex-wrap">
              {mexicoStressScenarios.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: radarColors[i].stroke, opacity: 0.8 }}
                  />
                  <span className="font-mono text-[11px] text-muted-sand">Scenario {i + 1}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={mexicoRadarData} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid stroke="rgba(240,237,230,0.08)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#9B968B', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                {mexicoStressScenarios.map((_, i) => (
                  <Radar
                    key={i}
                    name={`Scenario ${i + 1}`}
                    dataKey={mexicoStressScenarios[i].name}
                    stroke={radarColors[i].stroke}
                    fill={radarColors[i].fill}
                    fillOpacity={radarColors[i].fillOpacity}
                    strokeWidth={radarColors[i].strokeWidth}
                  />
                ))}
                <Tooltip
                  contentStyle={{
                    background: '#1C1C26',
                    border: '1px solid rgba(240,237,230,0.1)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#F0EDE6', fontFamily: 'JetBrains Mono, monospace' }}
                  itemStyle={{ color: '#9B968B', fontFamily: 'JetBrains Mono, monospace' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scenario Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mexicoStressScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="mexico-card bg-surface-dark border border-subtle-line rounded-xl p-6 transition-all duration-300 hover:border-warm-amber/30"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-[11px] text-warm-amber mb-1">{scenario.id}</div>
                  <h3 className="font-body font-semibold text-[14px] text-soft-cream leading-tight">
                    {scenario.name}
                  </h3>
                </div>
                <span className={`font-mono text-[11px] font-medium px-2 py-0.5 rounded border ${recColor(scenario.recommendation)}`}>
                  {scenario.recommendation}
                </span>
              </div>

              {/* Risk Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-muted-sand uppercase">Overall Risk</span>
                  <span className="font-mono text-[13px] font-bold text-soft-cream">{scenario.overallRisk}/100</span>
                </div>
                <div className="w-full h-1.5 bg-obsidian rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      scenario.overallRisk >= 70 ? 'bg-red-400' : scenario.overallRisk >= 50 ? 'bg-warm-amber' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${scenario.overallRisk}%` }}
                  />
                </div>
              </div>

              {/* Agent Positions */}
              <div className="space-y-2.5 mb-4">
                {[
                  { label: 'Business Advocate', text: scenario.businessAdvocate },
                  { label: 'Compliance Reviewer', text: scenario.complianceReviewer },
                  { label: 'Regulator Proxy', text: scenario.regulatorProxy },
                  { label: 'Neutral Adjudicator', text: scenario.neutralAdjudicator },
                ].map((pos) => (
                  <div key={pos.label}>
                    <div className="font-mono text-[9px] text-muted-sand uppercase mb-0.5">{pos.label}</div>
                    <p className="font-body text-[11px] text-muted-sand leading-relaxed line-clamp-2">
                      {pos.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Dimension Scores */}
              <div className="pt-3 border-t border-subtle-line">
                <div className="font-mono text-[9px] text-muted-sand uppercase mb-2">Dimension Scores</div>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(scenario.dimensions).map(([dim, val]) => (
                    <div key={dim} className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-sand">{dim}</span>
                      <span className={`font-mono text-[10px] font-medium ${val >= 70 ? 'text-red-400' : val >= 50 ? 'text-warm-amber' : 'text-emerald-400'}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── Section 8 (NEW): Pomelo Transaction Monitor ─────────────────── */

function PomeloTransactionMonitor() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (tableRef.current) {
        gsap.set(tableRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: tableRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(tableRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (statusRef.current) {
        const items = statusRef.current.querySelectorAll('.status-item')
        gsap.set(items, { opacity: 0, y: 20 })
        ScrollTrigger.create({
          trigger: statusRef.current,
          start: 'top 85%',
          onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12 bg-obsidian">
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">Transaction Monitoring</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            Pomelo Transaction Feed
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Real-time Pomelo webhook monitoring with threshold tracking, PEP screening, and aviso generation.
          </p>
        </div>

        {/* Transaction Table */}
        <div ref={tableRef} className="bg-surface-dark border border-subtle-line rounded-xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-3 border-b border-subtle-line">
            <div className="flex items-center gap-2">
              <CircleDot size={16} className="text-emerald-400 animate-pulse" />
              <h3 className="font-body font-semibold text-[14px] text-soft-cream">Latest Transactions</h3>
            </div>
            <span className="font-mono text-[10px] text-muted-sand">Auto-updating every 3s</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-subtle-line">
                  <th className="text-left font-mono text-[10px] text-muted-sand uppercase tracking-wider px-5 py-3">TX-ID</th>
                  <th className="text-left font-mono text-[10px] text-muted-sand uppercase tracking-wider px-5 py-3">Amount</th>
                  <th className="text-left font-mono text-[10px] text-muted-sand uppercase tracking-wider px-5 py-3">Type</th>
                  <th className="text-left font-mono text-[10px] text-muted-sand uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left font-mono text-[10px] text-muted-sand uppercase tracking-wider px-5 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {pomeloTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-subtle-line/50 transition-colors duration-200 ${
                      tx.risk === 'FLAG' ? 'bg-warm-amber/5' : 'hover:bg-surface-mid/30'
                    }`}
                  >
                    <td className="px-5 py-3 font-mono text-[12px] text-soft-cream">{tx.id}</td>
                    <td className="px-5 py-3 font-mono text-[12px] text-soft-cream">{tx.amount}</td>
                    <td className="px-5 py-3 font-body text-[13px] text-muted-sand">{tx.type}</td>
                    <td className="px-5 py-3">
                      <span className={`font-mono text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                        tx.status === 'Settled' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                        tx.status === 'Pending' ? 'text-warm-amber border-warm-amber/30 bg-warm-amber/10' :
                        'text-red-400 border-red-400/30 bg-red-400/10'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[11px] font-medium ${
                          tx.risk === 'CLEAR' ? 'text-emerald-400' : 'text-warm-amber'
                        }`}>
                          {tx.risk}
                        </span>
                        {tx.thresholdRef && (
                          <span className="font-mono text-[9px] text-warm-amber bg-warm-amber/10 border border-warm-amber/20 px-1.5 py-0.5 rounded">
                            {tx.thresholdRef}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Bar */}
        <div ref={statusRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="status-item bg-surface-dark border border-subtle-line rounded-xl p-4">
            <div className="font-mono text-[10px] text-muted-sand uppercase mb-2">Threshold Tracker</div>
            <div className="font-body text-[13px] text-soft-cream mb-1">
              {thresholdStatus.label}:{' '}
              <span className="font-mono text-warm-amber">
                {thresholdStatus.unit} {thresholdStatus.current.toLocaleString()} / {thresholdStatus.unit} {thresholdStatus.limit.toLocaleString()}
              </span>
              <span className="font-mono text-[10px] text-muted-sand ml-1">({thresholdStatus.umaNote})</span>
            </div>
            <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full bg-red-400"
                style={{ width: `${Math.min(thresholdStatus.percentage, 100)}%` }}
              />
            </div>
            <span className="font-mono text-[12px] text-red-400 font-medium">
              {thresholdStatus.percentage}% of threshold
            </span>
          </div>
          <div className="status-item bg-surface-dark border border-subtle-line rounded-xl p-4">
            <div className="font-mono text-[10px] text-muted-sand uppercase mb-2">PEP Screening</div>
            <div className="flex items-center gap-4">
              <div>
                <div className="font-body text-[13px] text-soft-cream">Last scan</div>
                <div className="font-mono text-[12px] text-emerald-400">{pepScreeningStatus.lastScan}</div>
              </div>
              <div className="w-px h-8 bg-subtle-line" />
              <div>
                <div className="font-body text-[13px] text-soft-cream">Matches</div>
                <div className="font-mono text-[12px] text-emerald-400 font-medium">
                  {pepScreeningStatus.matches}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── Section 9 (NEW): Compliance Calendar ─────────────────── */

function ComplianceCalendar() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (listRef.current) {
        const items = listRef.current.querySelectorAll('.cal-item')
        gsap.set(items, { opacity: 0, x: -20 })
        ScrollTrigger.create({
          trigger: listRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(items, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12" style={{ background: '#0F0F14' }}>
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">Compliance Calendar</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            Obligations & Deadlines
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            11 regulatory obligations tracked across SAT, UIF, CNBV, and Pomelo with automated status monitoring.
          </p>
        </div>

        <div ref={listRef} className="max-w-[900px] mx-auto space-y-2">
          {complianceObligations.map((obl: ComplianceObligation) => (
            <div
              key={obl.id}
              className="cal-item group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-surface-dark border border-subtle-line rounded-lg px-4 py-3 transition-all duration-200 hover:border-warm-amber/20"
            >
              {/* Status Badge */}
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center font-mono text-[10px] font-medium px-2 py-0.5 rounded border ${obligationStatusColor(obl.status)}`}>
                  {obl.status}
                </span>
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="font-body font-medium text-[13px] text-soft-cream leading-tight">
                  {obl.name}
                </div>
                {obl.detail && (
                  <div className="font-mono text-[10px] text-warm-amber mt-0.5">{obl.detail}</div>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 flex-wrap">
                <span className="font-mono text-[10px] text-muted-sand">{obl.frequency}</span>
                <span className="font-mono text-[10px] text-muted-sand">{obl.deadline}</span>
                <span className="font-mono text-[10px] text-muted-sand bg-obsidian border border-subtle-line px-2 py-0.5 rounded">
                  {obl.owner}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── Section 10 (NEW): Critical Risk Flags ─────────────────── */

function CriticalRiskFlags() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.risk-card')
        gsap.set(cards, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(cards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] md:py-[160px] px-5 md:px-12 bg-obsidian">
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">Risk Registry</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            Critical Risk Flags
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Seven hardcoded Vos risk flags tracked across revenue, settlement, legal, and regulatory dimensions.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {riskFlags.map((risk: RiskFlag) => (
            <div
              key={risk.id}
              className="risk-card bg-surface-dark border border-subtle-line rounded-xl p-5 transition-all duration-300 hover:border-warm-amber/30 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Flag size={14} className={
                  risk.severity === 'CRITICAL' ? 'text-red-400' :
                  risk.severity === 'HIGH' ? 'text-warm-amber' : 'text-sky-400'
                } />
                <span className="font-mono text-[11px] text-muted-sand">{risk.id}</span>
              </div>

              <p className="font-body text-[13px] text-soft-cream leading-relaxed mb-4">
                {risk.risk}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded border ${severityColor(risk.severity)}`}>
                  {risk.severity}
                </span>
                <span className="font-mono text-[10px] text-muted-sand bg-obsidian border border-subtle-line px-2 py-0.5 rounded">
                  {risk.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


/* ─────────────────── Section 11: Technology Stack ─────────────────── */

function StackSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
      if (diagramRef.current) {
        const blocks = diagramRef.current.querySelectorAll('.stack-block')
        gsap.set(blocks, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: diagramRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(blocks, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="stack" className="relative py-[120px] md:py-[160px] px-5 md:px-12" style={{ background: '#0F0F14' }}>
      <div className="max-w-[1280px] mx-auto">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">Architecture</div>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
            Unified Technology Stack
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[640px] mx-auto">
            Three integrated layers: React frontend, AI Engine in Rust, and the Quant Stack in Python.
          </p>
        </div>

        <div ref={diagramRef} className="max-w-[720px] mx-auto space-y-4">
          {/* Layer 1: Frontend */}
          <div className="stack-block relative bg-surface-dark border border-warm-amber/30 rounded-xl p-6">
            <div className="absolute -top-3 left-6 bg-[#0F0F14] px-2">
              <span className="font-mono text-[10px] text-warm-amber uppercase tracking-wider">Frontend</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Globe size={20} className="text-warm-amber" />
              <h3 className="font-body font-semibold text-[16px] text-soft-cream">EvanAIRegPlatform — Frontend</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React 19', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Recharts'].map((tech) => (
                <span key={tech} className="font-mono text-[11px] text-muted-sand bg-obsidian border border-subtle-line px-2 py-1 rounded-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-0.5 h-4 bg-warm-amber/30" />
              <ChevronRight size={14} className="text-warm-amber/50 rotate-90" />
              <div className="w-0.5 h-4 bg-warm-amber/30" />
            </div>
          </div>

          {/* Layer 2: AI Engine */}
          <div className="stack-block relative bg-surface-dark border border-warm-amber/40 rounded-xl p-6">
            <div className="absolute -top-3 left-6 bg-[#0F0F14] px-2">
              <span className="font-mono text-[10px] text-warm-amber uppercase tracking-wider">AI Engine</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Zap size={20} className="text-warm-amber" />
              <h3 className="font-body font-semibold text-[16px] text-soft-cream">AI Engine (Rust)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { label: 'Memory Trees', icon: Brain },
                { label: 'TokenJuice', icon: FileMinus },
                { label: 'Model Routing', icon: Route },
                { label: 'Voice', icon: Mic },
                { label: '118+ Integrations', icon: PlugZap },
                { label: 'Privacy', icon: Lock },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-2 bg-obsidian border border-subtle-line rounded-lg px-3 py-2">
                    <Icon size={14} className="text-warm-amber flex-shrink-0" />
                    <span className="font-mono text-[11px] text-muted-sand">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-0.5 h-4 bg-warm-amber/30" />
              <ChevronRight size={14} className="text-warm-amber/50 rotate-90" />
              <div className="w-0.5 h-4 bg-warm-amber/30" />
            </div>
          </div>

          {/* Layer 3: Quant Stack */}
          <div className="stack-block relative bg-surface-dark border border-warm-amber/30 rounded-xl p-6">
            <div className="absolute -top-3 left-6 bg-[#0F0F14] px-2">
              <span className="font-mono text-[10px] text-warm-amber uppercase tracking-wider">Quant Stack</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Server size={20} className="text-warm-amber" />
              <h3 className="font-body font-semibold text-[16px] text-soft-cream">Quant Stack (Python/FastAPI)</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['L0-L6 Pipeline', 'CS Credibility Scoring', '4-Agent Stress Lab', 'Hermes Patterns', 'FastAPI', 'SQLite'].map((tech) => (
                <span key={tech} className="font-mono text-[11px] text-muted-sand bg-obsidian border border-subtle-line px-2 py-1 rounded-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-0.5 h-4 bg-warm-amber/30" />
              <ChevronRight size={14} className="text-warm-amber/50 rotate-90" />
              <div className="w-0.5 h-4 bg-warm-amber/30" />
            </div>
          </div>

          {/* Layer 4: Data */}
          <div className="stack-block relative bg-surface-dark border border-subtle-line rounded-xl p-6">
            <div className="absolute -top-3 left-6 bg-[#0F0F14] px-2">
              <span className="font-mono text-[10px] text-muted-sand uppercase tracking-wider">Data Layer</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Database size={20} className="text-muted-sand" />
              <h3 className="font-body font-semibold text-[16px] text-soft-cream">Local Data & Models</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['SQLite', 'Ollama Local LLM', 'On-Device Storage', 'End-to-End Encrypted'].map((tech) => (
                <span key={tech} className="font-mono text-[11px] text-muted-sand bg-obsidian border border-subtle-line px-2 py-1 rounded-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── Section 12: Installation CTA ─────────────────── */

const installTabs = [
  { id: 'macos', label: 'macOS / Linux', command: 'curl -fsSL https://evanairegplatform.ai/install.sh | bash' },
  { id: 'windows', label: 'Windows', command: 'irm https://evanairegplatform.ai/install.ps1 | iex' },
  { id: 'docker', label: 'Docker', command: 'docker run -p 8000:8000 evanairegplatform/engine' },
  { id: 'github', label: 'GitHub', command: 'git clone https://github.com/evanairegplatform/frontend.git' },
]

function InstallationSection() {
  const [activeTab, setActiveTab] = useState('macos')
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.set(contentRef.current, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleCopy = () => {
    const cmd = installTabs.find((t) => t.id === activeTab)?.command ?? ''
    navigator.clipboard.writeText(cmd).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={sectionRef} id="installation" className="relative py-[120px] md:py-[160px] px-5 md:px-12 bg-obsidian">
      <div className="max-w-[1280px] mx-auto">
        <div ref={contentRef}>
          <div className="text-center mb-12">
            <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-4">Get Started</div>
            <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-4">
              Install EvanAIRegPlatform
            </h2>
            <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[560px] mx-auto">
              One command to get the full unified stack — AI Engine + Quant Stack + Platform Dashboard, running locally.
            </p>
          </div>

          {/* Tabs */}
          <div className="max-w-[640px] mx-auto">
            <div className="flex items-center gap-1 p-1 bg-surface-dark border border-subtle-line rounded-lg mb-4">
              {installTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setCopied(false) }}
                  className={`flex-1 font-body text-[13px] font-medium py-2 px-3 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-warm-amber text-obsidian'
                      : 'text-muted-sand hover:text-soft-cream'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Block */}
            <div className="relative bg-near-black border border-subtle-line rounded-xl p-5">
              <code className="font-mono text-[13px] md:text-[14px] text-soft-cream block pr-10">
                {installTabs.find((t) => t.id === activeTab)?.command}
              </code>
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-md text-muted-sand hover:text-soft-cream hover:bg-surface-mid transition-all duration-200"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-10">
              <a
                href="https://github.com/evanairegplatform"
                target="_blank"
                rel="noopener noreferrer"
                className="group font-body font-semibold text-sm bg-warm-amber text-obsidian px-8 py-[14px] rounded-[10px] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(232,168,56,0.25)] inline-flex items-center gap-2"
              >
                <GitBranch size={16} />
                View on GitHub
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── Main Component ─────────────────── */

export default function EvanAI() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <HeroSection />
      <AIEngineSection />
      <VosAgentPanel />
      <PipelineSection />
      <NLCommandCenter />
      <DashboardSection />
      <MexicoStressLab />
      <PomeloTransactionMonitor />
      <ComplianceCalendar />
      <CriticalRiskFlags />
      <StackSection />
      <InstallationSection />
    </div>
  )
}
