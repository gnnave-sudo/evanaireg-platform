import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const stats = [
  { number: '16.7k', label: 'Stars', highlight: false },
  { number: '1.5k', label: 'Forks', highlight: false },
  { number: '71', label: 'Contributors', highlight: false },
  { number: '118+', label: 'Integrations', highlight: true },
]

function AnimatedText({
  text,
  className,
  delay = 0,
  charDuration = 50,
  stagger = 30,
}: {
  text: string
  className: string
  delay?: number
  charDuration?: number
  stagger?: number
}) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const chars = el.querySelectorAll('.char')
    gsap.set(chars, { opacity: 0, y: 30 })
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: charDuration / 1000,
      stagger: stagger / 1000,
      delay,
      ease: 'power3.out',
    })
  }, [delay, charDuration, stagger])

  return (
    <span ref={containerRef} className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const labelRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Skip all animations for users who prefer reduced motion
      if (labelRef.current) labelRef.current.style.opacity = '1'
      if (subtitleRef.current) subtitleRef.current.style.opacity = '1'
      if (ctaRef.current) { ctaRef.current.style.opacity = '1'; ctaRef.current.style.transform = 'scale(1)' }
      if (statsRef.current) {
        statsRef.current.querySelectorAll('.stat-item').forEach((el) => {
          (el as HTMLElement).style.opacity = '1'
        })
      }
      return
    }

    // Label animation
    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0, y: 20 })
      gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power3.out' })
    }
    // Subtitle
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 })
      gsap.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 1.8, ease: 'power3.out' })
    }
    // CTAs
    if (ctaRef.current) {
      gsap.set(ctaRef.current, { opacity: 0, scale: 0.95 })
      gsap.to(ctaRef.current, { opacity: 1, scale: 1, duration: 0.6, delay: 2.1, ease: 'back.out(1.7)' })
    }
    // Stats
    if (statsRef.current) {
      const items = statsRef.current.querySelectorAll('.stat-item')
      gsap.set(items, { opacity: 0, y: 15 })
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        delay: 2.4,
        ease: 'power3.out',
      })
    }

    // Scroll fade
    const handleScroll = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const heroContent = document.getElementById('hero-content')
      if (!heroContent) return
      if (scrollY > vh * 0.5) {
        const t = Math.min(1, (scrollY - vh * 0.5) / (vh * 0.3))
        heroContent.style.opacity = String(1 - t * 0.7)
        heroContent.style.transform = `translateY(-${t * 40}px)`
      } else {
        heroContent.style.opacity = '1'
        heroContent.style.transform = 'translateY(0)'
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 md:px-12 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 30% 50%, rgba(232,168,56,0.12), transparent 70%), #0A0A0F`,
      }}
    >
      <div id="hero-content" className="relative z-10 flex flex-col items-center text-center max-w-[900px] mt-16">
        {/* Section Label */}
        <div ref={labelRef} className="font-mono text-caption text-warm-amber uppercase mb-6">
          // Open Source AI Super Intelligence
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-display md:text-display text-soft-cream mb-4">
          <AnimatedText text="OpenHuman" delay={0.6} charDuration={50} stagger={30} className="block" />
          <span className="block mt-2 text-[80%] font-medium text-warm-amber">
            <AnimatedText text="she can combine and ensure satisfaction" delay={1.1} charDuration={40} stagger={20} className="block" />
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-body-lg text-muted-sand max-w-[560px] mt-8 leading-relaxed"
        >
          Private, simple, and extremely powerful. 118+ integrations. Local-first. Your data stays yours.
        </p>

        {/* CTA Group */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 mt-12">
          <Link
            to="/install"
            className="font-body font-semibold text-sm bg-warm-amber text-obsidian px-8 py-[14px] rounded-[10px] transition-all duration-200 hover:scale-[1.03] hover:shadow-amber-glow-lg inline-flex items-center gap-2"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/tinyhumansai/openhuman"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body font-medium text-sm text-soft-cream border border-[rgba(240,237,230,0.15)] px-8 py-[14px] rounded-[10px] transition-all duration-200 hover:border-warm-amber hover:text-warm-amber hover:bg-[rgba(232,168,56,0.08)] inline-flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0.198C3.582 0.198 0 3.779 0 8.198C0 11.74 2.292 14.74 5.472 15.79C5.872 15.865 6.018 15.62 6.018 15.41C6.018 15.22 6.01 14.62 6.006 13.96C3.782 14.438 3.312 12.93 3.312 12.93C2.948 12.02 2.424 11.776 2.424 11.776C1.697 11.284 2.478 11.294 2.478 11.294C3.281 11.348 3.704 12.114 3.704 12.114C4.418 13.316 5.576 12.968 6.034 12.766C6.106 12.252 6.308 11.898 6.532 11.692C4.758 11.484 2.888 10.802 2.888 7.778C2.888 6.918 3.198 6.216 3.724 5.668C3.64 5.46 3.364 4.67 3.802 3.62C3.802 3.62 4.472 3.408 6 4.392C6.636 4.21 7.32 4.118 8 4.114C8.68 4.118 9.364 4.21 10.002 4.392C11.528 3.408 12.196 3.62 12.196 3.62C12.636 4.67 12.36 5.46 12.276 5.668C12.802 6.216 13.112 6.918 13.112 7.778C13.112 10.81 11.24 11.482 9.462 11.686C9.742 11.94 9.994 12.442 9.994 13.214C9.994 14.278 9.984 15.138 9.984 15.41C9.984 15.622 10.13 15.87 10.534 15.788C13.71 14.738 16 11.738 16 8.198C16 3.779 12.418 0.198 8 0.198Z" fill="currentColor"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>

      {/* Stats Row */}
      <div
        ref={statsRef}
        className="absolute bottom-16 md:bottom-20 left-0 right-0 z-10 flex items-center justify-center gap-8 md:gap-16 flex-wrap px-5"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="stat-item flex flex-col items-center text-center">
            <span className={`font-mono font-medium text-2xl md:text-[32px] ${stat.highlight ? 'text-warm-amber' : 'text-soft-cream'}`}>
              {stat.number}
            </span>
            <span className="font-mono text-caption text-muted-sand mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
