import HeroSection from '../components/home/HeroSection'
import StatsCounter from '../components/home/StatsCounter'
import FeaturedSpeakers from '../components/home/FeaturedSpeakers'
import AgendaPreview from '../components/home/AgendaPreview'
import SponsorsSection from '../components/home/SponsorsSection'
import AnimatedSection from '../components/ui/AnimatedSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <AnimatedSection animation="fadeIn" duration={800}>
        <StatsCounter />
      </AnimatedSection>

      <AnimatedSection animation="slideRight" duration={1000} threshold={0.2}>
        <FeaturedSpeakers />
      </AnimatedSection>

      <AnimatedSection animation="slideLeft" duration={1000} threshold={0.2}>
        <AgendaPreview />
      </AnimatedSection>

      <AnimatedSection animation="fadeUp" duration={800} threshold={0.2}>
        <SponsorsSection />
      </AnimatedSection>
    </>
  )
}
