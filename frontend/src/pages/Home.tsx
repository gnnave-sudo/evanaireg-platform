import Hero from '../sections/Hero'
import StatsBar from '../sections/StatsBar'
import Features from '../sections/Features'
import Architecture from '../sections/Architecture'
import Comparison from '../sections/Comparison'
import Installation from '../sections/Installation'

export default function Home() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <Features />
      <Architecture />
      <Comparison />
      <Installation />
    </div>
  )
}
