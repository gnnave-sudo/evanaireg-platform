import { useState, useRef, useEffect, Suspense, lazy } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GitCompare,
  FlaskConical,
  Table2,
  FileSignature,
  Network,
  Zap,
  Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/* Lazy-load tab components for code-splitting */
const RedlineTab = lazy(() => import('@/sections/workbench/tabs/RedlineTab'))
const SimulateTab = lazy(() => import('@/sections/workbench/tabs/SimulateTab'))
const TabularTab = lazy(() => import('@/sections/workbench/tabs/TabularTab'))
const SignaturesTab = lazy(() => import('@/sections/workbench/tabs/SignaturesTab'))
const ChartsTab = lazy(() => import('@/sections/workbench/tabs/ChartsTab'))
const QuickCompareTab = lazy(() => import('@/sections/workbench/tabs/QuickCompareTab'))

interface TabConfig {
  id: string
  label: string
  icon: typeof GitCompare
  component: React.ComponentType
}

const tabs: TabConfig[] = [
  { id: 'redline', label: 'Redline', icon: GitCompare, component: RedlineTab },
  { id: 'simulate', label: 'Simulate', icon: FlaskConical, component: SimulateTab },
  { id: 'tabular', label: 'Tabular', icon: Table2, component: TabularTab },
  { id: 'signatures', label: 'Signatures', icon: FileSignature, component: SignaturesTab },
  { id: 'charts', label: 'Charts', icon: Network, component: ChartsTab },
  { id: 'quick', label: 'Quick', icon: Zap, component: QuickCompareTab },
]

function TabFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center">
      <div className="relative mb-4">
        <div className="w-10 h-10 rounded-xl border-2 border-warm-amber/30 border-t-warm-amber animate-spin" />
      </div>
      <p className="font-body text-[14px] text-muted-sand">Loading tab...</p>
      <p className="font-mono text-[11px] text-muted-sand/50 mt-1">Initializing workbench module</p>
    </div>
  )
}

/* ─────────────────── Section Header ─────────────────── */

function WorkbenchHeader() {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      const el = headerRef.current!
      gsap.set(el, { opacity: 0, y: 30 })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
        once: true,
      })
    }, headerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="text-center mb-8 md:mb-10">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-warm-amber/10 border border-warm-amber/20 flex items-center justify-center">
          <Briefcase size={20} className="text-warm-amber" />
        </div>
      </div>
      <div className="font-mono text-[12px] font-medium text-warm-amber uppercase tracking-[0.08em] mb-3">
        Contract Workbench
      </div>
      <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.01em] text-soft-cream mb-3">
        Contract Lifecycle Intelligence
      </h2>
      <p className="font-body text-[16px] md:text-[18px] text-muted-sand max-w-[680px] mx-auto">
        Redline comparisons, multi-agent simulations, structured data extraction,
        signature analysis, and corporate structure visualization — powered by Jamie AI.
      </p>
    </div>
  )
}

/* ─────────────────── Main Component ─────────────────── */

export default function ContractWorkbench() {
  const [activeTab, setActiveTab] = useState('redline')
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const el = sectionRef.current!.querySelector('.workbench-tabs')
      if (el) {
        gsap.set(el, { opacity: 0, y: 20 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }),
          once: true,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component ?? RedlineTab

  return (
    <section
      ref={sectionRef}
      className="relative py-[80px] md:py-[120px] px-5 md:px-12 bg-obsidian"
      style={{
        background: `radial-gradient(ellipse at 70% 20%, rgba(232,168,56,0.06), transparent 60%), #0A0A0F`,
      }}
    >
      <div className="max-w-[1280px] mx-auto">
        <WorkbenchHeader />

        {/* Tab Navigation */}
        <div className="workbench-tabs mb-6">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-surface-dark border border-subtle-line rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 font-body text-[13px] px-4 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-warm-amber/10 text-warm-amber border border-warm-amber/20'
                      : 'text-muted-sand hover:text-soft-cream hover:bg-surface-mid/50 border border-transparent'
                  )}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative min-h-[400px]">
          <Suspense fallback={<TabFallback />}>
            <ActiveComponent />
          </Suspense>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="font-mono text-[11px] text-muted-sand/40">
            EvanAIRegPlatform Contract Workbench — All processing runs client-side with optional Jamie AI backend integration.
          </p>
          <p className="font-mono text-[10px] text-muted-sand/30 mt-1">
            Copyright &copy; 2026 Evan. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  )
}
