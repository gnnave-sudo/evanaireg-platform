import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'

const externalLinks: Record<string, string> = {
  GitHub: 'https://github.com/evanairegplatform',
  Discord: 'https://discord.gg/evanairegplatform',
}

function FooterLink({ item, isExternal }: { item: string; isExternal: boolean }) {
  const href = isExternal ? externalLinks[item] : `/${item.toLowerCase()}`

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-sm text-muted-sand hover:text-soft-cream transition-colors duration-200"
      >
        {item}
      </a>
    )
  }

  return (
    <Link
      to={href}
      className="font-body text-sm text-muted-sand hover:text-soft-cream transition-colors duration-200"
    >
      {item}
    </Link>
  )
}

export default function Footer() {
  const [waving, setWaving] = useState(false)

  function handleMascotClick() {
    if (waving) return
    setWaving(true)
    setTimeout(() => setWaving(false), 600)
  }

  return (
    <footer className="bg-near-black border-t border-subtle-line relative z-10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 pt-20 pb-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="font-body font-semibold text-soft-cream text-lg">Evan</span>
              <span className="font-display font-bold text-soft-cream text-lg">AI</span>
              <span className="font-body font-semibold text-warm-amber text-lg ml-0.5">Reg</span>
              <span className="w-1 h-1 rounded-full bg-warm-amber ml-0.5 -mt-1.5" />
            </Link>
            <p className="font-body text-sm text-muted-sand leading-relaxed mb-3">
              Unified compliance and contract lifecycle platform. Regulatory intelligence powered by AI.
            </p>
            <Link
              to="/workbench"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-warm-amber bg-warm-amber/10 border border-warm-amber/20 px-3 py-1.5 rounded-lg hover:bg-warm-amber/20 transition-all"
            >
              <Briefcase size={12} />
              Contract Workbench
            </Link>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-body font-semibold text-sm text-soft-cream mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Integrations', 'Workbench', 'Changelog'].map((item) => (
                <li key={item}>
                  {item === 'Workbench' ? (
                    <Link
                      to="/workbench"
                      className="font-body text-sm text-muted-sand hover:text-soft-cream transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  ) : (
                    <FooterLink item={item} isExternal={false} />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-body font-semibold text-sm text-soft-cream mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'GitHub', 'Discord', 'Blog'].map((item) => {
                const isExternal = item === 'GitHub' || item === 'Discord'
                return (
                  <li key={item}>
                    <FooterLink item={item} isExternal={isExternal} />
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-body font-semibold text-sm text-soft-cream mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Careers', 'Contact', 'Privacy'].map((item) => (
                <li key={item}>
                  <FooterLink item={item} isExternal={false} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* GitHub Stats Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-subtle-line">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-sand">
                <path d="M8 0.198C3.582 0.198 0 3.779 0 8.198C0 11.74 2.292 14.74 5.472 15.79C5.872 15.865 6.018 15.62 6.018 15.41C6.018 15.22 6.01 14.62 6.006 13.96C3.782 14.438 3.312 12.93 3.312 12.93C2.948 12.02 2.424 11.776 2.424 11.776C1.697 11.284 2.478 11.294 2.478 11.294C3.281 11.348 3.704 12.114 3.704 12.114C4.418 13.316 5.576 12.968 6.034 12.766C6.106 12.252 6.308 11.898 6.532 11.692C4.758 11.484 2.888 10.802 2.888 7.778C2.888 6.918 3.198 6.216 3.724 5.668C3.64 5.46 3.364 4.67 3.802 3.62C3.802 3.62 4.472 3.408 6 4.392C6.636 4.21 7.32 4.118 8 4.114C8.68 4.118 9.364 4.21 10.002 4.392C11.528 3.408 12.196 3.62 12.196 3.62C12.636 4.67 12.36 5.46 12.276 5.668C12.802 6.216 13.112 6.918 13.112 7.778C13.112 10.81 11.24 11.482 9.462 11.686C9.742 11.94 9.994 12.442 9.994 13.214C9.994 14.278 9.984 15.138 9.984 15.41C9.984 15.622 10.13 15.87 10.534 15.788C13.71 14.738 16 11.738 16 8.198C16 3.779 12.418 0.198 8 0.198Z" fill="currentColor"/>
              </svg>
              <span className="font-mono text-caption text-muted-sand">2.4k stars</span>
            </div>
            <div className="font-mono text-caption text-muted-sand">380 forks</div>
            <div className="font-mono text-caption text-muted-sand">42 contributors</div>
          </div>
          <div className="font-mono text-caption text-muted-sand-50">
            EvanAIRegPlatform — Proprietary Software
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-subtle-line flex items-center justify-between">
          <p className="font-mono text-caption text-muted-sand-50">
            &copy; 2026 EvanAIRegPlatform. All rights reserved.
          </p>

          {/* Mascot Easter Egg */}
          <button
            onClick={handleMascotClick}
            className={`opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-pointer ${
              waving ? 'animate-mascot-wave' : ''
            }`}
            aria-label="Mascot easter egg"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" fill="#1C1C26" stroke="#E8A838" strokeWidth="1.5" />
              {/* Eyes */}
              <circle cx="17" cy="20" r="3" fill="#E8A838" />
              <circle cx="31" cy="20" r="3" fill="#E8A838" />
              {/* Smile */}
              <path d="M16 30C16 30 19 34 24 34C29 34 32 30 32 30" stroke="#E8A838" strokeWidth="1.5" strokeLinecap="round" />
              {/* Antenna */}
              <line x1="24" y1="4" x2="24" y2="8" stroke="#E8A838" strokeWidth="1.5" />
              <circle cx="24" cy="3" r="2" fill="#E8A838" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
