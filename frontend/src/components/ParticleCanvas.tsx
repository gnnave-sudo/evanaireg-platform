import { useRef, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  baseOpacity: number
  angle: number
  angleSpeed: number
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getDPR() {
  return Math.min(window.devicePixelRatio || 1, 2)
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animRef = useRef<number>(0)
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 640
    const PARTICLE_COUNT = isMobile ? 30 : 60
    const CONNECTION_DIST = 120
    const MOUSE_RADIUS = 150
    const reducedMotion = getReducedMotion()
    const dpr = getDPR()

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Init particles
    particlesRef.current = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      particlesRef.current.push({
        x, y,
        baseX: x,
        baseY: y,
        size: 2 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: 0.3 + Math.random() * 0.5,
        baseOpacity: 0.3 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: 0.005 + Math.random() * 0.01,
      })
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 }
    }
    function handleScroll() {
      scrollRef.current = window.scrollY
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', resize)

    function draw() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const scrollY = scrollRef.current
      const vh = window.innerHeight

      // Calculate opacity based on scroll position
      let globalAlpha = 0.8
      if (scrollY > vh * 1.5) {
        globalAlpha = 0.15
      } else if (scrollY > vh) {
        const t = (scrollY - vh) / (vh * 0.5)
        globalAlpha = 0.8 - t * 0.65
      }

      const particles = particlesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (!reducedMotion) {
          // Update angle for organic movement
          p.angle += p.angleSpeed
          p.x += p.speedX + Math.sin(p.angle) * 0.2
          p.y += p.speedY + Math.cos(p.angle * 0.7) * 0.2

          // Wrap around edges
          if (p.x < -10) p.x = window.innerWidth + 10
          if (p.x > window.innerWidth + 10) p.x = -10
          if (p.y < -10) p.y = window.innerHeight + 10
          if (p.y > window.innerHeight + 10) p.y = -10
        }

        // Mouse interaction
        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        let size = p.size
        let opacity = p.baseOpacity * globalAlpha

        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
          opacity = Math.min(1, (p.baseOpacity + force * 0.5) * globalAlpha)
          size = p.size * (1 + force * 0.5)
        }

        // Draw particle with glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 168, 56, ${opacity})`
        ctx.fill()

        // Glow
        if (opacity > 0.2) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(232, 168, 56, ${opacity * 0.15})`
          ctx.fill()
        }
      }

      // Draw connections
      if (!reducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i]
            const p2 = particles[j]
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < CONNECTION_DIST) {
              const alpha = (1 - dist / CONNECTION_DIST) * 0.08 * globalAlpha
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(232, 168, 56, ${alpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }

          // Connect to mouse
          const p = particles[i]
          const dx = mx - p.x
          const dy = my - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            const alpha = (1 - dist / MOUSE_RADIUS) * 0.15 * globalAlpha
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mx, my)
            ctx.strokeStyle = `rgba(232, 168, 56, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      if (motionMQ.matches) {
        ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }
    motionMQ.addEventListener('change', handleMotionChange)

    return () => {
      cancelAnimationFrame(animRef.current)
      motionMQ.removeEventListener('change', handleMotionChange)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}
