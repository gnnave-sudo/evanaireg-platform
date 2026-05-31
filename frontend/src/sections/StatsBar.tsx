import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 16.7, suffix: 'k', label: 'GitHub Stars', highlight: false },
  { value: 1.5, suffix: 'k', label: 'Forks', highlight: false },
  { value: 71, suffix: '', label: 'Contributors', highlight: false },
  { value: 118, suffix: '+', label: 'Integrations', highlight: true },
  { value: 9, suffix: '', label: 'Supported Locales', highlight: false },
  { value: 80, suffix: '%', label: 'Cost Reduction', highlight: true },
]

function AnimatedCounter({ value, suffix, highlight }: { value: number; suffix: string; highlight: boolean }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1500
          const start = performance.now()
          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(1, elapsed / duration)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Number((eased * value).toFixed(value < 10 ? 0 : 1)))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className={`font-mono font-medium text-[28px] md:text-[36px] ${highlight ? 'text-warm-amber' : 'text-soft-cream'}`}>
 {count}{suffix}
    </span>
  )
}

export default function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.stat-block')

    if (prefersReducedMotion()) {
      items.forEach((el) => { (el as HTMLElement).style.opacity = '1' })
      return
    }

    gsap.set(items, { opacity: 0, y: 20 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="bg-near-black border-t border-subtle-line py-12 md:py-12 relative z-10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-block flex flex-col items-center text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} highlight={stat.highlight} />
              <span className="font-body text-sm text-muted-sand mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
