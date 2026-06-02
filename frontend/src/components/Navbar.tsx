import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Briefcase } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Stack', href: '#stack' },
    { label: 'Dashboard', href: '/workbench', route: true },
    { label: 'Docs', href: 'https://docs.evanairegplatform.ai', external: true },
    { label: 'GitHub', href: 'https://github.com/evanairegplatform', external: true },
  ]

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      setMobileOpen(false)
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-subtle-line transition-all duration-300 ${
          scrolled
            ? 'bg-near-black/95 h-16'
            : 'bg-near-black/70 h-[72px]'
        }`}
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-5 md:px-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-body font-semibold text-soft-cream text-xl tracking-tight">
              Evan
            </span>
            <span className="font-display font-bold text-soft-cream text-xl tracking-tight">
              AI
            </span>
            <span className="font-body font-semibold text-warm-amber text-xl tracking-tight ml-0.5">
              Reg
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-warm-amber ml-0.5 -mt-2" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative font-body font-medium text-sm text-muted-sand hover:text-soft-cream transition-colors duration-200 py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-warm-amber transition-all duration-200 group-hover:w-full" />
                </a>
              ) : link.route ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="group relative font-body font-medium text-sm text-muted-sand hover:text-soft-cream transition-colors duration-200 py-1 flex items-center gap-1.5"
                >
                  <Briefcase size={14} />
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-warm-amber transition-all duration-200 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="group relative font-body font-medium text-sm text-muted-sand hover:text-soft-cream transition-colors duration-200 py-1 cursor-pointer"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-warm-amber transition-all duration-200 group-hover:w-full" />
                </a>
              )
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#installation"
              onClick={(e) => handleAnchorClick(e, '#installation')}
              className="font-body font-semibold text-sm bg-warm-amber text-obsidian px-6 py-3 rounded-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-amber-glow inline-block"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-muted-sand transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-muted-sand transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-muted-sand transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-obsidian flex flex-col items-center justify-center gap-8 animate-menu-enter">
          {navLinks.map((link, i) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-4xl text-soft-cream hover:text-warm-amber transition-colors duration-200 animate-menu-item"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </a>
            ) : link.route ? (
              <Link
                key={link.label}
                to={link.href}
                className="font-display text-4xl text-soft-cream hover:text-warm-amber transition-colors duration-200 flex items-center gap-3 animate-menu-item"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Briefcase size={28} />
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="font-display text-4xl text-soft-cream hover:text-warm-amber transition-colors duration-200 animate-menu-item"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="#installation"
            onClick={(e) => handleAnchorClick(e, '#installation')}
            className="mt-4 font-body font-semibold text-base bg-warm-amber text-obsidian px-8 py-4 rounded-lg"
          >
            Get Started
          </a>
        </div>
      )}
    </>
  )
}
