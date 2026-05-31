import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from 'recharts'
import {
  Layers,
  Activity,
  FileSearch,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react'
import { allMockData } from '@/data/quantMockData'
import type {
  StressResult,
  CredibilityEntry,
  PatternExtract,
  EscalationItem,
  DriftEvent,
  ControlInvestment,
  FactPacket,
} from '@/types/quant'

gsap.registerPlugin(ScrollTrigger)

/* ---------------------------- helpers ---------------------------- */

function statusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-500'
    case 'warning':
      return 'bg-warm-amber'
    case 'idle':
      return 'bg-muted-sand'
    default:
      return 'bg-muted-sand'
  }
}

function tierColor(tier: string): string {
  switch (tier) {
    case 'HIGHLY_RELIABLE':
      return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    case 'STRONG':
      return 'text-sky-400 border-sky-400/30 bg-sky-400/10'
    case 'ACCEPTABLE':
      return 'text-warm-amber border-warm-amber/30 bg-warm-amber/10'
    case 'WEAK':
      return 'text-orange-400 border-orange-400/30 bg-orange-400/10'
    case 'HIGH_RISK':
      return 'text-red-400 border-red-400/30 bg-red-400/10'
    default:
      return 'text-muted-sand border-muted-sand/30 bg-muted-sand/10'
  }
}

function tierBarColor(tier: string): string {
  switch (tier) {
    case 'HIGHLY_RELIABLE':
      return '#34d399'
    case 'STRONG':
      return '#38bdf8'
    case 'ACCEPTABLE':
      return '#E8A838'
    case 'WEAK':
      return '#fb923c'
    case 'HIGH_RISK':
      return '#f87171'
    default:
      return '#9B968B'
  }
}

function recColor(rec: string): string {
  switch (rec) {
    case 'PROCEED':
      return 'text-emerald-400 border-emerald-400/40 bg-emerald-400/15'
    case 'HOLD':
      return 'text-warm-amber border-warm-amber/40 bg-warm-amber/15'
    case 'NO-GO':
      return 'text-red-400 border-red-400/40 bg-red-400/15'
    default:
      return 'text-muted-sand'
  }
}

function priorityColor(p: string): string {
  switch (p) {
    case 'P0':
      return 'text-red-400 border-red-400/40 bg-red-400/15'
    case 'P1':
      return 'text-warm-amber border-warm-amber/40 bg-warm-amber/15'
    case 'P2':
      return 'text-sky-400 border-sky-400/40 bg-sky-400/15'
    default:
      return 'text-muted-sand'
  }
  }

function riskColor(level: string): string {
  switch (level) {
    case 'low':
      return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    case 'medium':
      return 'text-warm-amber border-warm-amber/30 bg-warm-amber/10'
    case 'high':
      return 'text-orange-400 border-orange-400/30 bg-orange-400/10'
    case 'critical':
      return 'text-red-400 border-red-400/30 bg-red-400/10'
    default:
      return 'text-muted-sand'
  }
}

function statusBadgeColor(status: string): string {
  switch (status) {
    case 'open':
      return 'text-red-400 bg-red-400/10'
    case 'in_progress':
      return 'text-warm-amber bg-warm-amber/10'
    case 'resolved':
      return 'text-emerald-400 bg-emerald-400/10'
    default:
      return 'text-muted-sand bg-muted-sand/10'
  }
}

function buildRadarData(stress: StressResult[]) {
  if (!stress.length) return []
  const dims = Object.keys(stress[0].dimensions)
  return dims.map((dim) => {
    const row: Record<string, string | number> = { dimension: dim }
    stress.forEach((s) => {
      row[`Scenario ${s.scenario}`] = s.dimensions[dim] ?? 0
    })
    return row
  })
}

function buildHeatmapData(stress: StressResult[]) {
  if (!stress.length) return []
  const dims = Object.keys(stress[0].dimensions)
  return dims.map((dim) => {
    const row: Record<string, string | number> = { dimension: dim }
    stress.forEach((s) => {
      row[`Scenario ${s.scenario}`] = s.dimensions[dim] ?? 0
    })
    return row
  })
}

function buildDriftData(events: DriftEvent[]) {
  return events
    .slice()
    .reverse()
    .map((e, i) => ({
      index: i + 1,
      label: e.productId.split('-').slice(1, 3).join('-'),
      previous: e.previousScore,
      current: e.currentScore,
      drift: e.driftMagnitude,
    }))
}

/* -------------------------- Section 1: Hero -------------------------- */

function QuantHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
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
        tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.9)
      }
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.hero-stat')
        gsap.set(items, { opacity: 0, y: 15 })
        tl.to(items, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.2)
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const heroStats = [
    { value: '7', label: 'System Layers', icon: <Layers size={18} /> },
    { value: '4', label: 'Stress Agents', icon: <Activity size={18} /> },
    { value: '10', label: 'Risk Dimensions', icon: <ShieldCheck size={18} /> },
    { value: '5', label: 'LLM Providers', icon: <GitBranch size={18} /> },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 md:px-12 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 40% 40%, rgba(232,168,56,0.18), transparent 60%), #0A0A0F`,
      }}
    >
      <div className="relative z-10 flex flex-col items-center text-center max-w-[900px]">
        <div ref={labelRef} className="font-mono text-caption text-warm-amber uppercase mb-6">
          // Regulatory Intelligence
        </div>
        <h1
          ref={titleRef}
          className="font-display text-h1-mobile md:text-h1 text-soft-cream mb-4"
        >
          Quant Stack
          <span className="block mt-2 text-warm-amber text-[80%] font-medium">
            Regulatory Intelligence
          </span>
        </h1>
        <p
          ref={subRef}
          className="font-body text-body-lg text-muted-sand max-w-[600px] mt-6 leading-relaxed"
        >
          A 7-layer regulatory intelligence system -- from raw intake through stress simulation,
          pattern extraction, and credibility scoring. Automated. Explainable. Always on.
        </p>

        <div ref={statsRef} className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-14">
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="hero-stat flex flex-col items-center text-center gap-2"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-core border border-warm-amber/20 text-warm-amber">
                {s.icon}
              </div>
              <span className="font-mono font-medium text-[28px] text-soft-cream">
                {s.value}
              </span>
              <span className="font-mono text-caption text-muted-sand">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------- Section 2: System Status ----------------------- */

function SystemStatus() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.anim-item')
    gsap.set(items, { opacity: 0, y: 30 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-near-black border-t border-subtle-line py-20 md:py-section-desktop relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="anim-item font-mono text-caption text-warm-amber uppercase mb-4">
          // System Status
        </div>
        <h2 className="anim-item font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
          Pipeline Health
        </h2>
        <p className="anim-item font-body text-body-lg text-muted-sand max-w-[560px] mb-12">
          Real-time throughput across all 8 system layers. Every pipeline stage monitored.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allMockData.systemLayers.map((layer) => (
            <div
              key={layer.id}
              className="anim-item group bg-surface-dark border border-subtle-line rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-warm-amber/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-data text-muted-sand">{layer.id}</span>
                <span
                  className={`w-2 h-2 rounded-full ${statusColor(layer.status)}`}
                  title={layer.status}
                />
              </div>
              <h3 className="font-body font-semibold text-base text-soft-cream mb-1">
                {layer.name}
              </h3>
              <div className="font-mono text-data text-warm-amber mb-2">{layer.throughput}</div>
              <div className="font-mono text-caption text-muted-sand-50">
                {new Date(layer.lastRun).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------- Section 3: Stress Lab Visualizer -------------------- */

function StressLabVisualizer() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.anim-item')
    gsap.set(items, { opacity: 0, y: 30 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    })
  }, [])

  const radarData = buildRadarData(allMockData.stressResults)
  const colors = ['#E8A838', '#9B968B']

  return (
    <section
      ref={sectionRef}
      className="bg-obsidian border-t border-subtle-line py-20 md:py-section-desktop relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="anim-item font-mono text-caption text-warm-amber uppercase mb-4">
          // Stress Lab
        </div>
        <h2 className="anim-item font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
          Stress Simulation
        </h2>
        <p className="anim-item font-body text-body-lg text-muted-sand max-w-[560px] mb-12">
          Multi-agent stress testing across 10 risk dimensions. Four independent agents converge on a
          risk-weighted recommendation.
        </p>

        {/* Scenario badges */}
        <div className="anim-item flex flex-wrap gap-4 mb-10">
          {allMockData.stressResults.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 bg-surface-dark border border-subtle-line rounded-xl px-5 py-3"
            >
              <div>
                <div className="font-mono text-caption text-muted-sand mb-1">
                  SCENARIO {s.scenario}
                </div>
                <div className="font-mono text-[28px] font-medium text-soft-cream">
                  {s.overallRisk}
                  <span className="text-muted-sand text-sm ml-1">/ 100</span>
                </div>
              </div>
              <div className={`font-mono text-caption px-3 py-1 rounded-full border ${recColor(s.recommendation)}`}>
                {s.recommendation}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Radar Chart */}
          <div className="anim-item bg-surface-dark border border-subtle-line rounded-2xl p-5 md:p-8">
            <h3 className="font-body font-semibold text-lg text-soft-cream mb-6">
              Risk Dimension Profile
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(240,237,230,0.08)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#9B968B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#9B968B', fontSize: 10 }}
                  axisLine={false}
                />
                {allMockData.stressResults.map((s, i) => (
                  <Radar
                    key={s.id}
                    name={`Scenario ${s.scenario}`}
                    dataKey={`Scenario ${s.scenario}`}
                    stroke={colors[i]}
                    fill={colors[i]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#15151C',
                    border: '1px solid rgba(240,237,230,0.1)',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    color: '#F0EDE6',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Positions */}
          <div className="anim-item space-y-4">
            <h3 className="font-body font-semibold text-lg text-soft-cream mb-2">
              Agent Positions
            </h3>
            {allMockData.stressResults.map((s) => (
              <div
                key={s.id}
                className="bg-surface-dark border border-subtle-line rounded-2xl p-5 space-y-4"
              >
                <div className="font-mono text-caption text-warm-amber uppercase">
                  Scenario {s.scenario} -- Overall: {s.overallRisk}
                </div>
                <div className="space-y-3">
                  <AgentCard
                    role="Business Advocate"
                    color="text-sky-400"
                    text={s.businessAdvocate}
                  />
                  <AgentCard
                    role="Compliance Reviewer"
                    color="text-warm-amber"
                    text={s.complianceReviewer}
                  />
                  <AgentCard
                    role="Regulator Proxy"
                    color="text-orange-400"
                    text={s.regulatorProxy}
                  />
                  <AgentCard
                    role="Neutral Adjudicator"
                    color="text-emerald-400"
                    text={s.neutralAdjudicator}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AgentCard({
  role,
  color,
  text,
}: {
  role: string
  color: string
  text: string
}) {
  return (
    <div className="border-l-2 border-subtle-line pl-4 py-1">
      <div className={`font-mono text-caption ${color} uppercase mb-1`}>{role}</div>
      <p className="font-body text-body-sm text-muted-sand leading-relaxed">{text}</p>
    </div>
  )
}

/* ----------------------- Section 4: Credibility Leaderboard ----------------------- */

function CredibilityLeaderboard() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.anim-item')
    gsap.set(items, { opacity: 0, y: 30 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    })
  }, [])

  const sorted = [...allMockData.credibilityEntries].sort(
    (a, b) => b.weightedScore - a.weightedScore
  )

  return (
    <section
      ref={sectionRef}
      className="bg-near-black border-t border-subtle-line py-20 md:py-section-desktop relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="anim-item font-mono text-caption text-warm-amber uppercase mb-4">
          // Credibility Scoring
        </div>
        <h2 className="anim-item font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
          Counsel Leaderboard
        </h2>
        <p className="anim-item font-body text-body-lg text-muted-sand max-w-[560px] mb-12">
          Multi-dimensional credibility assessment across 6 quality dimensions. Ranked by weighted
          composite score.
        </p>

        <div className="anim-item space-y-4">
          {sorted.map((entry, idx) => (
            <CredibilityRow key={entry.id} entry={entry} rank={idx + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CredibilityRow({ entry, rank }: { entry: CredibilityEntry; rank: number }) {
  const dimNames = Object.keys(entry.dimensions)
  const barColor = tierBarColor(entry.tier)

  return (
    <div className="anim-item bg-surface-dark border border-subtle-line rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-warm-amber/20 hover:-translate-y-1">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Rank */}
        <div className="flex items-center gap-3 min-w-[60px]">
          <span className="font-mono text-h3 text-warm-amber">#{rank}</span>
        </div>

        {/* Name + Tier */}
        <div className="min-w-[200px] flex-1">
          <h4 className="font-body font-semibold text-base text-soft-cream mb-1">
            {entry.counselName}
          </h4>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-caption px-2 py-0.5 rounded-full border ${tierColor(entry.tier)}`}>
              {entry.tier}
            </span>
            <span className="font-mono text-caption text-muted-sand-50">{entry.matterId}</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="min-w-[160px] md:w-[200px]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-caption text-muted-sand">Score</span>
            <span className="font-mono text-data font-medium text-soft-cream">
              {entry.weightedScore.toFixed(1)}
            </span>
          </div>
          <div className="w-full h-2 bg-surface-mid rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${entry.weightedScore}%`, backgroundColor: barColor }}
            />
          </div>
        </div>

        {/* Dimension mini-bars */}
        <div className="flex-1 grid grid-cols-3 md:grid-cols-6 gap-3">
          {dimNames.map((dim) => {
            const val = entry.dimensions[dim] ?? 0
            return (
              <div key={dim} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-muted-sand truncate" title={dim}>
                  {dim}
                </span>
                <div className="w-full h-1.5 bg-surface-mid rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${val}%`, backgroundColor: barColor }}
                  />
                </div>
                <span className="font-mono text-[10px] text-soft-cream">{val}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ----------------------- Section 5: Pattern Explorer ----------------------- */

function PatternExplorer() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.anim-item')
    gsap.set(items, { opacity: 0, y: 30 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-obsidian border-t border-subtle-line py-20 md:py-section-desktop relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="anim-item font-mono text-caption text-warm-amber uppercase mb-4">
          // Pattern Extraction
        </div>
        <h2 className="anim-item font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
          Pattern Explorer
        </h2>
        <p className="anim-item font-body text-body-lg text-muted-sand max-w-[560px] mb-12">
          Automatically extracted regulatory patterns from enforcement actions, licence conditions,
          and guidance publications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allMockData.patternExtracts.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PatternCard({ pattern }: { pattern: PatternExtract }) {
  return (
    <div className="anim-item group bg-surface-dark border border-subtle-line rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-warm-amber/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2 mb-4">
        <FileSearch size={16} className="text-warm-amber" />
        <span className="font-mono text-caption text-warm-amber truncate">{pattern.jurisdiction}</span>
      </div>

      <h3 className="font-body font-semibold text-lg text-soft-cream mb-4">
        {pattern.productType}
      </h3>

      {/* Risk Drivers */}
      <div className="mb-4">
        <div className="font-mono text-caption text-muted-sand uppercase mb-2">Risk Drivers</div>
        <div className="flex flex-wrap gap-2">
          {pattern.riskDrivers.map((rd) => (
            <span
              key={rd}
              className="font-mono text-[11px] text-red-300 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded"
            >
              {rd}
            </span>
          ))}
        </div>
      </div>

      {/* Obligations */}
      <div className="mb-4">
        <div className="font-mono text-caption text-muted-sand uppercase mb-2">
          Recurrent Obligations
        </div>
        <ul className="space-y-1">
          {pattern.recurrentObligations.map((ob) => (
            <li key={ob} className="font-body text-body-sm text-muted-sand flex items-start gap-2">
              <ShieldCheck size={12} className="text-warm-amber mt-1 shrink-0" />
              {ob}
            </li>
          ))}
        </ul>
      </div>

      {/* Control Weaknesses */}
      <div>
        <div className="font-mono text-caption text-muted-sand uppercase mb-2">
          Control Weaknesses
        </div>
        <ul className="space-y-1">
          {pattern.controlWeaknesses.map((cw) => (
            <li key={cw} className="font-body text-body-sm text-muted-sand flex items-start gap-2">
              <AlertTriangle size={12} className="text-orange-400 mt-1 shrink-0" />
              {cw}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ----------------------- Section 6: Risk Heatmap ----------------------- */

function RiskHeatmap() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.anim-item')
    gsap.set(items, { opacity: 0, y: 30 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    })
  }, [])

  const heatmapData = buildHeatmapData(allMockData.stressResults)

  return (
    <section
      ref={sectionRef}
      className="bg-near-black border-t border-subtle-line py-20 md:py-section-desktop relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="anim-item font-mono text-caption text-warm-amber uppercase mb-4">
          // Risk Heatmap
        </div>
        <h2 className="anim-item font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
          Dimension Heatmap
        </h2>
        <p className="anim-item font-body text-body-lg text-muted-sand max-w-[560px] mb-12">
          Comparative risk scores across all 10 dimensions for each stress scenario.
        </p>

        <div className="anim-item bg-surface-dark border border-subtle-line rounded-2xl p-5 md:p-8">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={heatmapData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,237,230,0.06)" />
              <XAxis
                dataKey="dimension"
                tick={{ fill: '#9B968B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(240,237,230,0.06)' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#9B968B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(240,237,230,0.06)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#15151C',
                  border: '1px solid rgba(240,237,230,0.1)',
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                  color: '#F0EDE6',
                }}
              />
              {allMockData.stressResults.map((s, i) => (
                <Bar
                  key={s.id}
                  dataKey={`Scenario ${s.scenario}`}
                  fill={i === 0 ? '#E8A838' : '#9B968B'}
                  fillOpacity={0.85}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

/* -------------------- Section 7: Escalations & Controls -------------------- */

function EscalationsControl() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.anim-item')
    gsap.set(items, { opacity: 0, y: 30 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-obsidian border-t border-subtle-line py-20 md:py-section-desktop relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="anim-item font-mono text-caption text-warm-amber uppercase mb-4">
          // Escalations & Controls
        </div>
        <h2 className="anim-item font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
          Action Centre
        </h2>
        <p className="anim-item font-body text-body-lg text-muted-sand max-w-[560px] mb-12">
          Active escalation items requiring attention, paired with recommended control investments
          and their projected risk reduction impact.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Escalations */}
          <div className="anim-item space-y-4">
            <h3 className="font-body font-semibold text-lg text-soft-cream flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-warm-amber" />
              Active Escalations
            </h3>
            {allMockData.escalationItems.map((item) => (
              <EscalationCard key={item.id} item={item} />
            ))}
          </div>

          {/* Controls */}
          <div className="anim-item space-y-4">
            <h3 className="font-body font-semibold text-lg text-soft-cream flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-emerald-400" />
              Control Investments
            </h3>
            {allMockData.controlInvestments.map((ctrl, i) => (
              <ControlCard key={i} ctrl={ctrl} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function EscalationCard({ item }: { item: EscalationItem }) {
  return (
    <div className="bg-surface-dark border border-subtle-line rounded-2xl p-5 transition-all duration-300 hover:border-warm-amber/20">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-caption px-2 py-0.5 rounded border ${priorityColor(item.priority)}`}>
            {item.priority}
          </span>
          <span className={`font-mono text-[11px] px-2 py-0.5 rounded ${statusBadgeColor(item.status)}`}>
            {item.status.replace('_', ' ')}
          </span>
        </div>
        <span className="font-mono text-caption text-muted-sand">{item.jurisdiction}</span>
      </div>
      <h4 className="font-body font-semibold text-base text-soft-cream mb-1">{item.title}</h4>
      <p className="font-body text-body-sm text-muted-sand leading-relaxed mb-3">
        {item.description}
      </p>
      <div className="font-mono text-caption text-warm-amber">Due: {item.dueDate}</div>
    </div>
  )
}

function ControlCard({ ctrl }: { ctrl: ControlInvestment }) {
  return (
    <div className="bg-surface-dark border border-subtle-line rounded-2xl p-5 transition-all duration-300 hover:border-emerald-400/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-body font-semibold text-base text-soft-cream">{ctrl.controlName}</h4>
        <span className="font-mono text-caption text-warm-amber bg-amber-core px-2 py-0.5 rounded-full">
          #{ctrl.priority}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="font-mono text-caption text-muted-sand mb-1">Est. Cost</div>
          <div className="font-mono text-data text-soft-cream">{ctrl.estimatedCost}</div>
        </div>
        <div>
          <div className="font-mono text-caption text-muted-sand mb-1">Risk Reduction</div>
          <div className="font-mono text-data text-emerald-400">-{ctrl.riskReduction}%</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {ctrl.jurisdictions.map((j) => (
          <span
            key={j}
            className="font-mono text-[11px] text-muted-sand bg-surface-mid px-2 py-0.5 rounded"
          >
            {j}
          </span>
        ))}
      </div>

      <div className="mt-3 w-full h-2 bg-surface-mid rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-700"
          style={{ width: `${ctrl.riskReduction * 2}%` }}
        />
      </div>
    </div>
  )
}

/* ----------------------- Section 8: Drift Timeline ----------------------- */

function DriftTimeline() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.anim-item')
    gsap.set(items, { opacity: 0, y: 30 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    })
  }, [])

  const driftData = buildDriftData(allMockData.driftEvents)

  return (
    <section
      ref={sectionRef}
      className="bg-near-black border-t border-subtle-line py-20 md:py-section-desktop relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="anim-item font-mono text-caption text-warm-amber uppercase mb-4">
          // Regulatory Drift
        </div>
        <h2 className="anim-item font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
          Drift Timeline
        </h2>
        <p className="anim-item font-body text-body-lg text-muted-sand max-w-[560px] mb-12">
          Posture score shifts driven by regulatory events. Track how enforcement actions and
          guidance changes impact product risk profiles over time.
        </p>

        <div className="anim-item bg-surface-dark border border-subtle-line rounded-2xl p-5 md:p-8 mb-10">
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={driftData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="prevGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9B968B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9B968B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="currGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8A838" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E8A838" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,237,230,0.06)" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#9B968B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(240,237,230,0.06)' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#9B968B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(240,237,230,0.06)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#15151C',
                  border: '1px solid rgba(240,237,230,0.1)',
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                  color: '#F0EDE6',
                }}
              />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="#9B968B"
                fill="url(#prevGradient)"
                strokeWidth={2}
                name="Previous Score"
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#E8A838"
                fill="url(#currGradient)"
                strokeWidth={2}
                name="Current Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Drift event cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allMockData.driftEvents.map((event) => (
            <DriftCard key={event.id} event={event} />
          ))}
        </div>

        {/* Fact packets */}
        <div className="anim-item mt-12">
          <h3 className="font-body font-semibold text-lg text-soft-cream flex items-center gap-2 mb-6">
            <FileSearch size={18} className="text-warm-amber" />
            Recent Fact Packets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allMockData.factPackets.map((fp) => (
              <FactPacketCard key={fp.id} fp={fp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DriftCard({ event }: { event: DriftEvent }) {
  return (
    <div className="anim-item bg-surface-dark border border-subtle-line rounded-2xl p-5 transition-all duration-300 hover:border-warm-amber/20">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown size={14} className="text-red-400" />
        <span className="font-mono text-caption text-red-400">+{event.driftMagnitude} pts</span>
        <span className="font-mono text-caption text-muted-sand ml-auto">{event.productId}</span>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="text-center">
          <div className="font-mono text-data text-muted-sand">{event.previousScore}</div>
          <div className="font-mono text-[10px] text-muted-sand-50">before</div>
        </div>
        <div className="flex-1 h-px bg-subtle-line relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t border-r border-warm-amber" />
        </div>
        <div className="text-center">
          <div className="font-mono text-data text-warm-amber">{event.currentScore}</div>
          <div className="font-mono text-[10px] text-muted-sand-50">after</div>
        </div>
      </div>
      <p className="font-body text-body-sm text-muted-sand leading-relaxed">
        {event.postureChange}
      </p>
    </div>
  )
}

function FactPacketCard({ fp }: { fp: FactPacket }) {
  return (
    <div className="anim-item bg-surface-dark border border-subtle-line rounded-xl p-4 transition-all duration-300 hover:border-warm-amber/20">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-caption text-warm-amber">{fp.regulator}</span>
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${riskColor(fp.riskLevel)}`}>
          {fp.riskLevel}
        </span>
      </div>
      <div className="font-body text-sm text-soft-cream mb-1">{fp.activityType}</div>
      <div className="font-mono text-[11px] text-muted-sand mb-2">{fp.productClass}</div>
      <div className="font-mono text-caption text-muted-sand-50">{fp.jurisdiction}</div>
    </div>
  )
}

/* -------------------------- Footer Note -------------------------- */

function DashboardFooter() {
  return (
    <section className="bg-obsidian border-t border-subtle-line py-8 relative z-10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-caption text-muted-sand">
            Last updated: real-time | Data source: Evan Legal Quant Stack v2.0
          </span>
        </div>
        <span className="font-mono text-caption text-muted-sand-50">
          Evan Legal Quantitative Regulatory Intelligence
        </span>
      </div>
    </section>
  )
}

/* -------------------------- Main Page -------------------------- */

export default function QuantDashboard() {
  return (
    <div>
      <QuantHero />
      <SystemStatus />
      <StressLabVisualizer />
      <CredibilityLeaderboard />
      <PatternExplorer />
      <RiskHeatmap />
      <EscalationsControl />
      <DriftTimeline />
      <DashboardFooter />
    </div>
  )
}
