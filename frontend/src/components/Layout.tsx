import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ParticleCanvas from './ParticleCanvas'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh]">
      <ParticleCanvas />
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
