import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Play,
  Shield,
  Scale,
  Gavel,
  MapPin,
  Target,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileEdit,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import LoadingOverlay from '@/sections/workbench/shared/LoadingOverlay'
import StatusBadge from '@/sections/workbench/shared/StatusBadge'
import { useSimulationRun, useAmendments } from '@/hooks/useJamieAPI'
import type { SimulationAgent } from '@/hooks/useJamieAPI'

gsap.registerPlugin(ScrollTrigger)

const scenarios = [
  { value: 'negotiation', label: 'Negotiation Simulation', icon: Scale },
  { value: 'arbitration', label: 'Arbitration Hearing', icon: Gavel },
  { value: 'stress_test', label: 'Stress Test', icon: AlertTriangle },
]

const stanceOptions = ['Aggressive', 'Balanced', 'Conciliatory']
const focusOptions = ['Liability', 'IP Rights', 'Termination', 'Payment Terms', 'Data Protection']
const jurisdictions = ['Delaware', 'New York', 'California', 'England & Wales', 'Singapore']

function AgentCard({ agent, index }: { agent: SimulationAgent; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        'bg-surface-dark border rounded-xl p-4 transition-all duration-300',
        expanded ? 'border-warm-amber/30' : 'border-subtle-line hover:border-warm-amber/20'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', agent.color.replace('text-', 'bg-').replace('400', '500/10'))}>
          {agent.role === 'Opposing Counsel' && <Shield size={18} className={agent.color} />}
          {agent.role === 'Business Advocate' && <Scale size={18} className={agent.color} />}
          {agent.role === 'Arbiter' && <Gavel size={18} className={agent.color} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-body font-semibold text-[13px] text-soft-cream">{agent.role}</h4>
          <p className={cn('font-mono text-[11px]', agent.color)}>Score: {agent.score}/100</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-sand hover:text-soft-cream transition-colors"
        >
          <ChevronDown
            size={16}
            className={cn('transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>
      </div>

      <p className="font-body text-[12px] text-muted-sand mb-2">{agent.position}</p>

      {/* Score bar */}
      <div className="w-full h-1.5 bg-obsidian rounded-full overflow-hidden mb-2">
        <div
          className={cn('h-full rounded-full transition-all duration-700', agent.color.replace('text-', 'bg-'))}
          style={{ width: `${agent.score}%` }}
        />
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-subtle-line space-y-2">
          {agent.arguments.map((arg, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={cn('mt-1 w-1 h-1 rounded-full flex-shrink-0', agent.color.replace('text-', 'bg-'))} />
              <p className="font-body text-[12px] text-muted-sand">{arg}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SimulateTab() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scenario, setScenario] = useState('negotiation')
  const [stance, setStance] = useState('Balanced')
  const [focusAreas, setFocusAreas] = useState<string[]>(['Liability', 'Termination'])
  const [jurisdiction, setJurisdiction] = useState('Delaware')
  const { run, loading, result } = useSimulationRun()
  const { amendment, generate: generateAmendment } = useAmendments()

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

  const toggleFocus = useCallback((area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }, [])

  const handleRun = useCallback(async () => {
    const sim = await run({ scenario, stance, jurisdiction })
    if (sim) {
      await generateAmendment(sim.id)
    }
  }, [scenario, stance, jurisdiction, run, generateAmendment])

  const gaugeColor = result
    ? result.recommendation === 'PROCEED'
      ? 'text-emerald-400'
      : result.recommendation === 'HOLD'
        ? 'text-warm-amber'
        : 'text-red-400'
    : 'text-muted-sand'

  return (
    <div ref={sectionRef} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Scenario Config */}
        <div className="animate-in lg:col-span-4 bg-surface-dark border border-subtle-line rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-warm-amber" />
            <h3 className="font-body font-semibold text-[13px] text-soft-cream">Scenario Config</h3>
          </div>

          {/* Scenario Dropdown */}
          <div>
            <label className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-1.5 block">Simulation Type</label>
            <div className="relative">
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-obsidian border border-subtle-line rounded-lg px-3 py-2.5 font-body text-[13px] text-soft-cream outline-none focus:border-warm-amber/40 appearance-none cursor-pointer"
              >
                {scenarios.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-sand pointer-events-none" />
            </div>
          </div>

          {/* Stance */}
          <div>
            <label className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-1.5 block">Opposing Counsel Stance</label>
            <div className="flex gap-2">
              {stanceOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setStance(s)}
                  className={cn(
                    'flex-1 font-body text-[12px] py-2 rounded-lg border transition-all duration-200',
                    stance === s
                      ? 'bg-warm-amber/10 border-warm-amber/30 text-warm-amber'
                      : 'bg-obsidian border-subtle-line text-muted-sand hover:text-soft-cream'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <label className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-1.5 block">Focus Areas</label>
            <div className="flex flex-wrap gap-1.5">
              {focusOptions.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleFocus(area)}
                  className={cn(
                    'font-mono text-[11px] px-2.5 py-1 rounded-md border transition-all duration-200',
                    focusAreas.includes(area)
                      ? 'bg-warm-amber/10 border-warm-amber/30 text-warm-amber'
                      : 'bg-obsidian border-subtle-line text-muted-sand hover:text-soft-cream'
                  )}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Jurisdiction */}
          <div>
            <label className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-1.5 block">Jurisdiction</label>
            <div className="relative">
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-obsidian border border-subtle-line rounded-lg px-3 py-2.5 font-body text-[13px] text-soft-cream outline-none focus:border-warm-amber/40 appearance-none cursor-pointer"
              >
                {jurisdictions.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
              <MapPin size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-sand pointer-events-none" />
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={loading}
            className={cn(
              'w-full flex items-center justify-center gap-2 font-body font-semibold text-sm py-3 rounded-lg transition-all duration-200',
              loading
                ? 'bg-surface-mid text-muted-sand cursor-not-allowed'
                : 'bg-warm-amber text-obsidian hover:scale-[1.02]'
            )}
          >
            <Play size={16} />
            {loading ? 'Running Simulation...' : 'Run Simulation'}
          </button>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-8 space-y-4">
          {/* Loading overlay or Agent Cards */}
          <div className="animate-in relative bg-surface-dark border border-subtle-line rounded-xl p-5 min-h-[380px]">
            {loading && (
              <LoadingOverlay
                message="Running multi-agent simulation..."
                subMessage={`${scenario} scenario with ${stance} stance in ${jurisdiction}`}
              />
            )}

            <div className="flex items-center gap-2 mb-4">
              <Scale size={16} className="text-warm-amber" />
              <h3 className="font-body font-semibold text-[13px] text-soft-cream">Agent Positions</h3>
              {result && (
                <span className="ml-auto font-mono text-[11px] text-muted-sand">
                  Sim #{result.id.slice(-6)}
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-3">
                {result.agents.map((agent, i) => (
                  <AgentCard key={agent.role} agent={agent} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-center">
                <Scale size={48} className="text-muted-sand/15 mb-3" />
                <p className="font-body text-[14px] text-muted-sand/60 mb-1">Configure and run a simulation</p>
                <p className="font-mono text-[11px] text-muted-sand/40">AI agents will analyze positions and generate recommendations</p>
              </div>
            )}
          </div>

          {/* Risk Gauge + Recommendation */}
          {result && (
            <div className="animate-in grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risk Score */}
              <div className="bg-surface-dark border border-subtle-line rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-warm-amber" />
                  <h4 className="font-body font-semibold text-[13px] text-soft-cream">Risk Assessment</h4>
                </div>

                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#1C1C26" strokeWidth="10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke={result.overallRisk > 60 ? '#ef4444' : result.overallRisk > 35 ? '#E8A838' : '#10b981'}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.overallRisk / 100) * 314} 314`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn('font-mono text-3xl font-bold', gaugeColor)}>{result.overallRisk}%</span>
                      <span className="font-mono text-[10px] text-muted-sand uppercase">Risk</span>
                    </div>
                  </div>
                </div>

                {/* Risk factors */}
                <div className="space-y-2">
                  {result.riskFactors.map((rf) => (
                    <div key={rf.label} className="flex items-center gap-2">
                      <span className="font-body text-[11px] text-muted-sand flex-1">{rf.label}</span>
                      <div className="w-20 h-1.5 bg-obsidian rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            rf.score > 60 ? 'bg-red-400' : rf.score > 35 ? 'bg-warm-amber' : 'bg-emerald-400'
                          )}
                          style={{ width: `${rf.score}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted-sand w-6 text-right">{rf.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation + Amendment */}
              <div className="space-y-4">
                <div className="bg-surface-dark border border-subtle-line rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {result.recommendation === 'PROCEED' && <CheckCircle size={16} className="text-emerald-400" />}
                    {result.recommendation === 'HOLD' && <AlertTriangle size={16} className="text-warm-amber" />}
                    {result.recommendation === 'NO-GO' && <XCircle size={16} className="text-red-400" />}
                    <h4 className="font-body font-semibold text-[13px] text-soft-cream">Recommendation</h4>
                  </div>
                  <StatusBadge status={result.recommendation} size="lg" className="mb-3" />
                  <p className="font-body text-[12px] text-muted-sand leading-relaxed">
                    {result.recommendation === 'PROCEED' && 'Conditions are favorable. Proceed with signing while monitoring data protection compliance obligations.'}
                    {result.recommendation === 'HOLD' && 'Some risk factors require clarification. Request amendments on liability cap and termination provisions before proceeding.'}
                    {result.recommendation === 'NO-GO' && 'Multiple critical risk factors identified. Renegotiate key terms before executing this agreement.'}
                  </p>
                </div>

                {amendment && (
                  <div className="bg-surface-dark border border-subtle-line rounded-xl p-5 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <FileEdit size={16} className="text-warm-amber" />
                      <h4 className="font-body font-semibold text-[13px] text-soft-cream">Amendment Preview</h4>
                    </div>
                    <pre className="font-mono text-[11px] text-muted-sand whitespace-pre-wrap leading-relaxed max-h-[180px] overflow-auto pr-2">
                      {amendment}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
