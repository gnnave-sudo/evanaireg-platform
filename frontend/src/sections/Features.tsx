import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

gsap.registerPlugin(ScrollTrigger)

/* ===== Feature Icons ===== */
function BrainIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M24 8C16 8 10 14 10 22C10 28 14 34 20 36V40H28V36C34 34 38 28 38 22C38 14 32 8 24 8Z" stroke="#E8A838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="20" r="2" fill="#E8A838"/>
      <circle cx="30" cy="20" r="2" fill="#E8A838"/>
      <path d="M16 26C18 29 21 30 24 30C27 30 30 29 32 26" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 8V6" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 10L34 8" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 10L14 8" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function PlugIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="16" y="4" width="6" height="12" rx="2" stroke="#E8A838" strokeWidth="2"/>
      <rect x="26" y="4" width="6" height="12" rx="2" stroke="#E8A838" strokeWidth="2"/>
      <path d="M12 20H36V26C36 32.627 30.627 38 24 38C17.373 38 12 32.627 12 26V20Z" stroke="#E8A838" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M24 38V44" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 44H30" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function CompressIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M16 16L8 24L16 32" stroke="#E8A838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M32 16L40 24L32 32" stroke="#E8A838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 8L20 40" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="18" y="4" width="12" height="24" rx="6" stroke="#E8A838" strokeWidth="2"/>
      <path d="M10 22V24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24V22" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 38V44" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 44H32" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function RouteIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="16" cy="16" r="6" stroke="#E8A838" strokeWidth="2"/>
      <circle cx="32" cy="32" r="6" stroke="#E8A838" strokeWidth="2"/>
      <circle cx="32" cy="12" r="4" stroke="#E8A838" strokeWidth="2"/>
      <path d="M21 13L28 12" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 20L28 28" stroke="#E8A838" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M24 4L8 12V22C8 33.046 15.046 42.64 24 46C32.954 42.64 40 33.046 40 22V12L24 4Z" stroke="#E8A838" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M18 24L22 28L30 20" stroke="#E8A838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ===== Sound Wave Animation ===== */
function SoundWave() {
  return (
    <div className="flex items-end justify-center gap-1 h-[60px] w-[100px] mx-auto mt-6">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-warm-amber rounded-full origin-bottom animate-sound-bar"
          style={{
            height: '40px',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ===== Model Routing Visual ===== */
function RoutingVisual() {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {['Reasoning', 'Fast', 'Vision'].map((label, i) => (
        <div
          key={label}
          className={`font-body font-medium text-xs px-4 py-1.5 rounded-2xl transition-colors duration-500 ${
            i === 0
              ? 'bg-[rgba(232,168,56,0.15)] text-warm-amber'
              : 'bg-surface-mid text-muted-sand'
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  )
}

/* ===== Lock Animation ===== */
function LockVisual() {
  return (
    <div className="flex items-center justify-center mt-6">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4L8 12V22C8 33.046 15.046 42.64 24 46C32.954 42.64 40 33.046 40 22V12L24 4Z" stroke="#E8A838" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="18" y="22" width="12" height="10" rx="2" stroke="#E8A838" strokeWidth="2"/>
        <path d="M20 22V18C20 15.791 21.791 14 24 14C26.209 14 28 15.791 28 18V22" stroke="#E8A838" strokeWidth="2"/>
      </svg>
    </div>
  )
}

/* ===== Integration Marquee ===== */
const integrations = [
  'Gmail', 'Notion', 'GitHub', 'Slack', 'Stripe', 'Calendar',
  'Drive', 'Linear', 'Jira', 'WhatsApp', 'Matrix', 'Discord',
]

function IntegrationMarquee() {
  return (
    <div className="overflow-hidden h-12 mt-6 relative">
      <div className="flex animate-marquee">
        {[...integrations, ...integrations].map((name, i) => (
          <div key={i} className="flex items-center gap-2 px-3 whitespace-nowrap">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-muted-sand">
              <rect x="4" y="4" width="24" height="24" rx="6" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1"/>
            </svg>
            <span className="font-mono text-data text-muted-sand">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    icon: <BrainIcon />,
    title: 'Memory Trees',
    description:
      'Local-first knowledge base. All your data — canonicalized into \u22643k token Markdown chunks, scored, and folded into hierarchical summary trees. Stored in SQLite on your machine. Same chunks become .md files in an Obsidian-compatible vault.',
    tag: 'Local-First',
    visual: 'image',
    image: '/memory-tree-visual.png',
    imageAlt: 'Memory Tree visualization',
  },
  {
    icon: <PlugIcon />,
    title: '118+ Integrations',
    description:
      'Gmail, Notion, GitHub, Slack, Stripe, Calendar, Drive, Linear, Jira, WhatsApp, Matrix, and more. One-click OAuth. Every 20 minutes, fresh data flows into your memory tree. No prompts. No polling loops.',
    tag: 'Auto-Fetch',
    visual: 'marquee',
  },
  {
    icon: <CompressIcon />,
    title: 'TokenJuice',
    description:
      'Smart token compression. Every tool call, scrape, and email runs through compression before touching any LLM. HTML \u2192 Markdown, URL shortening, deduping. CJK, emoji, multi-byte text preserved grapheme-by-grapheme. Reduces cost and latency by up to 80%.',
    tag: '80% Savings',
    visual: 'image',
    image: '/tokenjuice-visual.png',
    imageAlt: 'TokenJuice visualization',
  },
  {
    icon: <MicIcon />,
    title: 'Native Voice',
    description:
      'Whisper STT in. ElevenLabs TTS out. Mascot lip-sync animation. Live Google Meet agent participation. Locale-aware voice with multilingual LLM replies. Your AI doesn\'t just type \u2014 it speaks.',
    tag: 'Multilingual',
    visual: 'soundwave',
  },
  {
    icon: <RouteIcon />,
    title: 'Model Routing',
    description:
      'Built-in routing sends each task to the right LLM \u2014 reasoning, fast, or vision \u2014 under one subscription. Optional local AI via Ollama. No API key sprawl. No vendor juggling. Intelligence, routed.',
    tag: 'One Subscription',
    visual: 'routing',
  },
  {
    icon: <ShieldIcon />,
    title: 'Privacy First',
    description:
      'End-to-end encrypted messaging. Workflow data stays on-device in local SQLite. Sandboxing via Landlock on Linux. Self-hostable via Docker. Your data never leaves your control unless you choose.',
    tag: 'Encrypted',
    visual: 'lock',
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    if (prefersReducedMotion()) {
      const allEls = sectionRef.current.querySelectorAll('.header-anim, .feature-card')
      allEls.forEach((el) => { (el as HTMLElement).style.opacity = '1' })
      return
    }

    // Header animation
    const headerEls = headerRef.current.querySelectorAll('.header-anim')
    gsap.set(headerEls, { opacity: 0, y: 30 })
    gsap.to(headerEls, {
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

    // Card animations
    const cards = gridRef.current.querySelectorAll('.feature-card')
    gsap.set(cards, { opacity: 0, y: 50 })
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 75%',
        once: true,
      },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-obsidian py-20 md:py-section-desktop relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16">
          <div className="header-anim font-mono text-caption text-warm-amber uppercase mb-4">
            // Core Capabilities
          </div>
          <h2 className="header-anim font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
            Built for Intelligence
          </h2>
          <p className="header-anim font-body text-body-lg text-muted-sand max-w-[600px] leading-relaxed">
            Six powerful systems. One seamless experience. OpenHuman combines everything your AI needs to think, remember, and act.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  tag,
  visual,
  image,
  imageAlt,
}: {
  icon: React.ReactNode
  title: string
  description: string
  tag: string
  visual: string
  image?: string
  imageAlt?: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="feature-card group relative bg-surface-dark rounded-2xl border border-subtle-line p-10 transition-all duration-300 hover:border-[rgba(232,168,56,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(232,168,56,0.06), transparent 70%), #15151C',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className="mb-5">{icon}</div>

      {/* Tag */}
      <span className="inline-block font-mono text-caption text-warm-amber bg-[rgba(232,168,56,0.12)] px-3 py-1 rounded-xl mb-4">
        {tag}
      </span>

      {/* Title */}
      <h3 className="font-body font-semibold text-h3 text-soft-cream mb-3">{title}</h3>

      {/* Description */}
      <p className="font-body text-body-sm text-muted-sand leading-relaxed mb-6">{description}</p>

      {/* Visual */}
      <div className="mt-auto overflow-hidden rounded-lg">
        {visual === 'image' && image && (
          <img
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            className={`w-full h-40 object-cover rounded-lg transition-transform duration-400 ${
              hovered ? 'scale-105' : 'scale-100'
            }`}
          />
        )}
        {visual === 'marquee' && <IntegrationMarquee />}
        {visual === 'soundwave' && <SoundWave />}
        {visual === 'routing' && <RoutingVisual />}
        {visual === 'lock' && <LockVisual />}
      </div>
    </div>
  )
}
