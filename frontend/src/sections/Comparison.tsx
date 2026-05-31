import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const rows = [
  { feature: 'Open Source', claude: 'Proprietary', openclaw: 'MIT', hermes: 'MIT', openhuman: 'GPL-3.0' },
  { feature: 'Simple Setup', claude: 'Desktop + CLI', openclaw: 'Terminal-only', hermes: 'Terminal-only', openhuman: 'Clean UI, minutes' },
  { feature: 'Cost Model', claude: 'Sub + add-ons', openclaw: 'BYO models', hermes: 'BYO models', openhuman: 'One sub + TokenJuice' },
  { feature: 'Memory System', claude: 'Chat-scoped', openclaw: 'Plugin-reliant', hermes: 'Self-learning', openhuman: 'Memory Tree + Obsidian' },
  { feature: 'Integrations', claude: 'Few', openclaw: 'BYO', hermes: 'BYO', openhuman: '118+ via OAuth' },
  { feature: 'Auto-fetch', claude: 'Cross', openclaw: 'Cross', hermes: 'Cross', openhuman: 'Check (20-min sync)' },
  { feature: 'API Sprawl', claude: 'Extra keys', openclaw: 'BYOK', hermes: 'Multi-vendor', openhuman: 'One account' },
  { feature: 'Model Routing', claude: 'Single model', openclaw: 'Manual', hermes: 'Manual', openhuman: 'Check (Built-in)' },
  { feature: 'Native Tools', claude: 'Code-only', openclaw: 'Code-only', hermes: 'Code-only', openhuman: 'Check (Code + Voice + Search + Scraper)' },
  { feature: 'Local-First', claude: 'Cross', openclaw: 'Check', hermes: 'Check', openhuman: 'Check' },
  { feature: 'Desktop Mascot', claude: 'Cross', openclaw: 'Cross', hermes: 'Cross', openhuman: 'Check' },
]

function CheckMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block">
      <circle cx="10" cy="10" r="9" stroke="#E8A838" strokeWidth="1.5"/>
      <path d="M6 10L9 13L14 7" stroke="#E8A838" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CrossMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block">
      <circle cx="10" cy="10" r="9" stroke="rgba(155,150,139,0.5)" strokeWidth="1.5"/>
      <path d="M7 7L13 13M13 7L7 13" stroke="rgba(155,150,139,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function CellContent({ value }: { value: string }) {
  if (value === 'Check') return <CheckMark />
  if (value === 'Cross') return <CrossMark />
  return <span>{value}</span>
}

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    if (headerRef.current) {
      gsap.set(headerRef.current.children, { opacity: 0, y: 30 })
      gsap.to(headerRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }

    if (tableRef.current) {
      const rows = tableRef.current.querySelectorAll('.comp-row')
      gsap.set(rows, { opacity: 0, x: -20 })
      gsap.to(rows, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tableRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-obsidian py-20 md:py-section-desktop border-t border-subtle-line relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16">
          <div className="font-mono text-caption text-warm-amber uppercase mb-4">
            // Comparison
          </div>
          <h2 className="font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
            Why OpenHuman?
          </h2>
          <p className="font-body text-body-lg text-muted-sand max-w-[520px] leading-relaxed">
            See how we stack up. Open source, local-first, and designed to work out of the box.
          </p>
        </div>

        {/* Comparison Table */}
        <div
          ref={tableRef}
          className="overflow-x-auto"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)' }}
        >
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-surface-dark">
                <th className="font-mono font-medium text-[13px] text-muted-sand text-left px-6 py-4">
                  Feature
                </th>
                <th className="font-mono font-medium text-[13px] text-muted-sand text-center px-6 py-4">
                  Claude Cowork
                </th>
                <th className="font-mono font-medium text-[13px] text-muted-sand text-center px-6 py-4">
                  OpenClaw
                </th>
                <th className="font-mono font-medium text-[13px] text-muted-sand text-center px-6 py-4">
                  Hermes Agent
                </th>
                <th className="font-mono font-semibold text-[13px] text-warm-amber text-center px-6 py-4">
                  OpenHuman
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className="comp-row border-t border-subtle-line hover:bg-[rgba(240,237,230,0.03)] transition-colors duration-150"
                >
                  <td className="font-body text-[15px] text-soft-cream px-6 py-[18px]">
                    {row.feature}
                  </td>
                  <td className="font-body text-[15px] text-muted-sand text-center px-6 py-[18px]">
                    <CellContent value={row.claude} />
                  </td>
                  <td className="font-body text-[15px] text-muted-sand text-center px-6 py-[18px]">
                    <CellContent value={row.openclaw} />
                  </td>
                  <td className="font-body text-[15px] text-muted-sand text-center px-6 py-[18px]">
                    <CellContent value={row.hermes} />
                  </td>
                  <td className="font-body font-medium text-[15px] text-soft-cream text-center px-6 py-[18px] bg-[rgba(232,168,56,0.06)]">
                    <CellContent value={row.openhuman} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Note */}
        <p className="font-mono text-caption text-muted-sand-50 mt-6">
          * All data accurate as of 2026. Competitor features subject to change.
        </p>
      </div>
    </section>
  )
}
