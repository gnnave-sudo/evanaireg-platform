import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const techLayers = [
  {
    title: 'Rust Core',
    badge: '64.9%',
    items: ['Axum Web Framework', 'SQLite', 'Async Tokio', 'openhuman-core binary'],
    description: 'Backend — Rust Core',
  },
  {
    title: 'Frontend',
    badge: '30.6%',
    items: ['TypeScript / React', 'Tauri Desktop', 'CEF-based'],
    description: 'Frontend — Tauri + TypeScript',
  },
  {
    title: 'Voice',
    badge: 'STT / TTS',
    items: ['Whisper.rs STT', 'ElevenLabs TTS', 'Mascot Lip-sync', 'Google Meet Agent'],
    description: 'Voice Pipeline',
  },
  {
    title: 'AI Engine',
    badge: 'Multi-Model',
    items: ['Model Routing (reasoning/fast/vision)', 'Ollama Local AI', 'TokenJuice Compression'],
    description: 'AI & Routing',
  },
]

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Header animation
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

    // Diagram layers
    if (diagramRef.current) {
      const layers = diagramRef.current.querySelectorAll('.arch-layer')
      gsap.set(layers, { opacity: 0, scale: 0.97 })
      gsap.to(layers, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: diagramRef.current,
          start: 'top 70%',
          once: true,
        },
      })
    }

    // Tech stack layers
    if (layersRef.current) {
      const items = layersRef.current.querySelectorAll('.stack-layer')
      gsap.set(items, { opacity: 0, x: 40 })
      gsap.to(items, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: layersRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-near-black py-20 md:py-section-desktop border-t border-subtle-line relative z-10"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16">
          {/* Left Column */}
          <div>
            {/* Section Header */}
            <div ref={headerRef} className="mb-12">
              <div className="font-mono text-caption text-warm-amber uppercase mb-4">
                // Architecture
              </div>
              <h2 className="font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
                Built in Rust.<br />Powered by Intelligence.
              </h2>
              <p className="font-body text-body-lg text-muted-sand max-w-[480px] leading-relaxed">
                A modern stack designed for speed, security, and scale. Every layer optimized for AI-native workflows.
              </p>
            </div>

            {/* Architecture Diagram */}
            <div ref={diagramRef} className="relative max-w-[640px]">
              <img
                src="/architecture-diagram.png"
                alt="OpenHuman Architecture Diagram"
                className="w-full rounded-xl"
              />
              {/* Overlay layers */}
              <div className="absolute bottom-[8%] left-[8%] right-[30%] arch-layer group cursor-pointer">
                <div className="bg-amber-core border border-warm-amber/20 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="font-mono text-xs text-warm-amber">Axum · SQLite · Tokio</span>
                </div>
              </div>
              <div className="absolute top-[38%] left-[8%] right-[35%] arch-layer group cursor-pointer">
                <div className="bg-amber-core border border-warm-amber/20 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="font-mono text-xs text-warm-amber">Model Routing · Ollama</span>
                </div>
              </div>
              <div className="absolute top-[8%] left-[8%] right-[35%] arch-layer group cursor-pointer">
                <div className="bg-amber-core border border-warm-amber/20 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="font-mono text-xs text-warm-amber">Tauri · TypeScript</span>
                </div>
              </div>
              <div className="absolute top-[15%] right-[5%] bottom-[20%] w-[22%] arch-layer group cursor-pointer">
                <div className="bg-amber-core border border-warm-amber/20 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-1/2 -translate-y-1/2 right-0 whitespace-nowrap">
                  <span className="font-mono text-xs text-warm-amber">Whisper · ElevenLabs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div ref={layersRef} className="flex flex-col justify-center">
            {techLayers.map((layer) => (
              <div
                key={layer.title}
                className="stack-layer bg-surface-dark border-l-[3px] border-muted-sand hover:border-l-warm-amber hover:bg-surface-mid hover:translate-x-1 rounded-r-xl p-5 mb-3 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-body font-semibold text-lg text-soft-cream">
                    {layer.description}
                  </h3>
                  <span className="font-mono text-xs text-warm-amber bg-amber-core px-2.5 py-1 rounded-full">
                    {layer.badge}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span key={item} className="font-mono text-[13px] text-muted-sand">
                      {item}
                    </span>
                  )).reduce((acc, el, i, arr) => (
                    acc.concat(el, i < arr.length - 1 ? <span key={`sep-${i}`} className="text-muted-sand">·</span> : [])
                  ), [] as React.ReactNode[])}
                </div>
              </div>
            ))}

            {/* Version Badge */}
            <div className="mt-6">
              <span className="font-mono text-caption text-warm-amber">v0.53.50</span>
              <span className="block font-mono text-caption text-muted-sand-50 mt-1">
                GPL-3.0 License
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
