import PageHero from '../ui/PageHero'
import { MapPinIcon, CalendarIcon, LockIcon } from '../icons'
import heroImage from '../../assets/May 12, 2026, 10_28_12 AM.png'

const metaItems = [
  { icon: MapPinIcon, label: 'Bangalore, venue TBC' },
  { icon: CalendarIcon, label: 'July 2026' },
  { icon: LockIcon, label: 'Curated, closed-room gathering' },
]

export default function HeroSection() {
  return (
    <PageHero
      eyebrow="All Health Tech presents"
      accentEyebrow
      title="AllHealth X Tech"
      subtitle="A curated, closed-room gathering of the people building healthcare's future."
      primaryCta={{ to: '/register', label: 'Register to Attend' }}
      secondaryCta={{ to: '/contact', label: 'Partner With Us' }}
      meta={metaItems}
      fullHeight
      image={{
        src: heroImage,
        alt: 'Healthcare technology forum visual',
        quote: 'No generic panels. High-quality signal, decision-makers, and real collaboration.',
      }}
    />
  )
}
