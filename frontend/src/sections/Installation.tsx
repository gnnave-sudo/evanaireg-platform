import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Platform = 'macos' | 'windows' | 'docker'

const installCommands: Record<Platform, string> = {
  macos: 'curl -fsSL https://tinyhumans.ai/openhuman/scripts/install.sh | bash',
  windows: 'irm https://tinyhumans.ai/openhuman/scripts/install.ps1 | iex',
  docker: 'docker run -p 8080:8080 openhuman/openhuman:latest',
}

const platformLabels: Record<Platform, string> = {
  macos: 'macOS / Linux',
  windows: 'Windows',
  docker: 'Docker',
}

function AppleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M21.6 8.8C21.4 8.9 19.5 9.9 19.5 12.3C19.5 15.1 21.9 16 22 16C21.9 16.1 21.6 17.2 20.7 18.3C19.9 19.3 19.1 20.3 17.7 20.3C16.4 20.3 15.9 19.5 14.4 19.5C12.9 19.5 12.3 20.3 11.1 20.3C9.7 20.3 8.7 19.1 7.9 18.1C6.2 15.9 4.9 11.9 6.6 9.2C7.5 7.8 9 6.9 10.6 6.9C11.9 6.9 13 7.8 14 7.8C15 7.8 15.8 6.9 17.3 6.9C18.8 6.9 19.9 7.6 20.8 8.6C17.9 10.1 18.3 14.1 21.6 15.1L21.6 8.8Z" fill="currentColor"/>
      <path d="M15.8 5.5C16.5 4.7 17 3.5 16.9 2.4C15.8 2.5 14.6 3.1 13.9 3.9C13.3 4.6 12.7 5.8 12.8 6.9C14 7 15.1 6.4 15.8 5.5Z" fill="currentColor"/>
    </svg>
  )
}

function LinuxIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M19.2 20.3C18.8 20.1 18.4 20 18 19.8C18.1 19.4 18.3 19 18.3 18.5C18.3 17.8 18 17.1 17.5 16.5C17.8 15.8 18 15 18 14.2C18 11.5 16.1 9.3 13.8 9.3C11.5 9.3 9.6 11.5 9.6 14.2C9.6 15 9.8 15.8 10.1 16.5C9.6 17.1 9.3 17.8 9.3 18.5C9.3 19 9.5 19.4 9.6 19.8C9.2 20 8.8 20.1 8.4 20.3C6.5 21.2 5 22.6 5 24H22.6C22.6 22.6 21.1 21.2 19.2 20.3Z" fill="currentColor"/>
      <path d="M7.5 11.5C8.6 11.5 9.5 10.1 9.5 8.5C9.5 6.9 8.6 5.5 7.5 5.5C6.4 5.5 5.5 6.9 5.5 8.5C5.5 10.1 6.4 11.5 7.5 11.5Z" fill="currentColor"/>
    </svg>
  )
}

function WindowsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M3 5L12 3.7V12.5H3V5Z" fill="currentColor"/>
      <path d="M13 3.5L25 2V12.3H13V3.5Z" fill="currentColor"/>
      <path d="M3 13.5H12.5V22.2L3 20.8V13.5Z" fill="currentColor"/>
      <path d="M13 13.5H25V24L13 22.5V13.5Z" fill="currentColor"/>
    </svg>
  )
}

function DockerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M22.5 14.5H21V16H22.5V14.5Z" fill="currentColor"/>
      <path d="M20 14.5H18.5V16H20V14.5Z" fill="currentColor"/>
      <path d="M17.5 14.5H16V16H17.5V14.5Z" fill="currentColor"/>
      <path d="M20 12H18.5V13.5H20V12Z" fill="currentColor"/>
      <path d="M17.5 12H16V13.5H17.5V12Z" fill="currentColor"/>
      <path d="M15 16H13.5V17.5H15V16Z" fill="currentColor"/>
      <path d="M17.5 9.5H16V11H17.5V9.5Z" fill="currentColor"/>
      <path d="M15 11H13.5V12.5H15V11Z" fill="currentColor"/>
      <path d="M12.5 14.5H11V16H12.5V14.5Z" fill="currentColor"/>
      <path d="M12.5 11H11V12.5H12.5V11Z" fill="currentColor"/>
      <path d="M15 8H13.5V9.5H15V8Z" fill="currentColor"/>
      <path d="M12.5 6.5H11V8H12.5V6.5Z" fill="currentColor"/>
      <path d="M15 14.5H13.5V16H15V14.5Z" fill="currentColor"/>
      <path d="M10 14.5H8.5V16H10V14.5Z" fill="currentColor"/>
      <path d="M12.5 14.5H11V16H12.5V14.5Z" fill="currentColor"/>
      <path d="M10 11H8.5V12.5H10V11Z" fill="currentColor"/>
      <path d="M12.5 11H11V12.5H12.5V11Z" fill="currentColor"/>
      <path d="M10 8H8.5V9.5H10V8Z" fill="currentColor"/>
      <path d="M12.5 8H11V9.5H12.5V8Z" fill="currentColor"/>
      <path d="M10 5.5H8.5V7H10V5.5Z" fill="currentColor"/>
      <path d="M12.5 5.5H11V7H12.5V5.5Z" fill="currentColor"/>
      <path d="M8.5 14.5H7V16H8.5V14.5Z" fill="currentColor"/>
      <path d="M8.5 11H7V12.5H8.5V11Z" fill="currentColor"/>
      <path d="M8.5 8H7V9.5H8.5V8Z" fill="currentColor"/>
      <path d="M26 14.5C25 12.5 21.5 11 19 11C18.5 11 18 11 17.5 11.1C16.8 8.5 14.5 6.5 11.5 6.5C8 6.5 5 8.5 4 11.5C4.5 11.5 5 11.5 5.5 11.5C7 11.5 8 12 8.5 13C9 12.5 10 12 11.5 12C13 12 14 12.5 14.5 13.5C15 13 16 12.5 17.5 12.5C19 12.5 20 13 20.5 14C21 13.5 22 13 23.5 13C24.5 13 25.5 13.3 26 14.5Z" fill="currentColor"/>
    </svg>
  )
}

export default function Installation() {
  const [activeTab, setActiveTab] = useState<Platform>('macos')
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const platformsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

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

    if (tabsRef.current) {
      gsap.set(tabsRef.current, { opacity: 0, y: 20 })
      gsap.to(tabsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tabsRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }

    if (platformsRef.current) {
      const items = platformsRef.current.querySelectorAll('.platform-icon')
      gsap.set(items, { opacity: 0, y: 20 })
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: platformsRef.current,
          start: 'top 85%',
          once: true,
        },
      })
    }

    if (ctaRef.current) {
      gsap.set(ctaRef.current, { opacity: 0, scale: 0.95 })
      gsap.to(ctaRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
          once: true,
        },
      })
    }
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(installCommands[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 md:pt-section-desktop md:pb-[120px] border-t border-subtle-line relative z-10"
      style={{
        background: `radial-gradient(circle at 80% 100%, rgba(232,168,56,0.12), transparent 70%), linear-gradient(180deg, #0F0F14 0%, #121018 100%)`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 text-center">
        {/* Section Header */}
        <div ref={headerRef}>
          <div className="font-mono text-caption text-warm-amber uppercase mb-4">
            // Get Started
          </div>
          <h2 className="font-display text-h1-mobile md:text-h1 text-soft-cream mb-4">
            Ready to Meet Your AI?
          </h2>
          <p className="font-body text-body-lg text-muted-sand max-w-[480px] mx-auto leading-relaxed">
            Install in minutes. Private by default. Powerful from day one.
          </p>
        </div>

        {/* Install Method Tabs */}
        <div ref={tabsRef} className="mt-12 flex justify-center">
          <div className="inline-flex bg-surface-dark rounded-xl p-1">
            {(Object.keys(platformLabels) as Platform[]).map((platform) => (
              <button
                key={platform}
                onClick={() => setActiveTab(platform)}
                className={`font-body font-medium text-sm px-8 py-3 rounded-[10px] transition-all duration-200 ${
                  activeTab === platform
                    ? 'bg-warm-amber text-obsidian'
                    : 'text-muted-sand bg-transparent hover:text-soft-cream'
                }`}
              >
                {platformLabels[platform]}
              </button>
            ))}
          </div>
        </div>

        {/* Code Block */}
        <div className="mt-6 max-w-[640px] mx-auto">
          <div className="relative bg-surface-dark border border-subtle-line rounded-2xl p-8 text-left hover:border-[rgba(232,168,56,0.15)] transition-colors duration-200">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 font-body font-medium text-xs text-muted-sand hover:text-warm-amber transition-colors duration-200 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7L6 10L11 4" stroke="#E8A838" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-warm-amber">Copied!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
                    <rect x="5" y="1" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Code */}
            <pre className="font-mono text-sm text-soft-cream overflow-x-auto pr-16">
              <code>{installCommands[activeTab]}</code>
            </pre>
          </div>
        </div>

        {/* Alternative CTA */}
        <p className="mt-5 font-body text-body-sm text-muted-sand">
          Or visit{' '}
          <a href="https://tinyhumans.ai/openhuman" className="text-warm-amber hover:underline transition-all duration-200">
            tinyhumans.ai/openhuman
          </a>{' '}
          to download directly
        </p>

        {/* Platform Badges */}
        <div ref={platformsRef} className="flex items-center justify-center gap-8 mt-12">
          {[
            { icon: <AppleIcon />, label: 'macOS' },
            { icon: <LinuxIcon />, label: 'Linux' },
            { icon: <WindowsIcon />, label: 'Windows' },
            { icon: <DockerIcon />, label: 'Docker' },
          ].map((p) => (
            <div
              key={p.label}
              className="platform-icon flex flex-col items-center gap-2 text-muted-sand hover:text-warm-amber transition-colors duration-200 cursor-default"
            >
              {p.icon}
              <span className="font-body text-xs text-muted-sand-50">{p.label}</span>
            </div>
          ))}
        </div>

        {/* Final CTA Button */}
        <div ref={ctaRef} className="mt-12 relative inline-block">
          {/* Pulsing glow */}
          <div
            className="absolute inset-0 rounded-[10px] animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(232,168,56,0.3), transparent 70%)',
              transform: 'scale(1.2)',
            }}
          />
          <a
            href="https://github.com/tinyhumansai/openhuman"
            target="_blank"
            rel="noopener noreferrer"
            className="relative font-body font-semibold text-base bg-warm-amber text-obsidian px-10 py-4 rounded-[10px] transition-all duration-200 hover:scale-105 hover:shadow-amber-glow-lg inline-flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0.5L9.8 5.9H15.5L10.8 9.1L12.6 14.5L8 11.3L3.4 14.5L5.2 9.1L0.5 5.9H6.2L8 0.5Z" fill="#0A0A0F"/>
            </svg>
            Join 16,700+ Developers on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
