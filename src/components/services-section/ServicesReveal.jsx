import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ScrollStack, { ScrollStackItem } from './ServicesScrollStack.jsx'
import { loanServices } from '../../data/loan-services-data.js'

const SERVICE_CARD_COLORS = [
  { background: '#ffffff', color: 'var(--navy)', tone: 'light' },
  { background: 'var(--gold)', color: 'var(--navy)', tone: 'gold' },
  { background: 'color-mix(in srgb, var(--navy) 9%, white)', color: 'var(--navy)', tone: 'light' },
  { background: '#18356f', color: '#ffffff', border: '1px solid rgba(198, 146, 20, 0.36)', tone: 'dark' },
]

const SERVICE_BUTTON_STYLES = {
  navy: {
    background: 'var(--navy)',
    color: '#ffffff',
    hoverBackground: 'var(--navy-deep)',
    focusOutline: 'var(--gold)',
    shadow: '0 5px 16px rgba(16, 34, 77, 0.14)',
    hoverShadow: '0 8px 20px rgba(16, 34, 77, 0.2)',
  },
  navyOnGold: {
    background: 'var(--navy)',
    color: '#ffffff',
    hoverBackground: 'var(--navy-deep)',
    focusOutline: 'var(--navy)',
    shadow: '0 5px 16px rgba(16, 34, 77, 0.14)',
    hoverShadow: '0 8px 20px rgba(16, 34, 77, 0.2)',
  },
  gold: {
    background: 'var(--gold)',
    color: 'var(--navy)',
    hoverBackground: '#d6ad52',
    focusOutline: '#ffffff',
    shadow: '0 5px 16px rgba(198, 146, 20, 0.24)',
    hoverShadow: '0 8px 20px rgba(198, 146, 20, 0.3)',
  },
}

const imageByService = {
  'home-loan': { src: '/services/home.png', alt: 'Home loan property', imagePosition: 'center 40%' },
  'car-loan': { src: '/services/car.png', alt: 'Car loan vehicle', imagePosition: 'center 60%' },
  'personal-loan': { src: '/services/personal.png', alt: 'Personal loan', imagePosition: 'center 60%' },
  'business-loan': { src: '/services/business.png', alt: 'Business loan', imagePosition: 'center' },
}

const serviceOrder = ['home-loan', 'car-loan', 'personal-loan', 'business-loan']

const serviceCards = serviceOrder.map((id, index) => {
  const service = loanServices.find((item) => item.id === id)
  return {
    id: service.id,
    number: String(index + 1).padStart(2, '0'),
    tag: service.category,
    title: service.name,
    description: service.intro,
    stats: [
      { label: 'Indicative rate', value: service.rate.replaceAll('â€“', '–') },
      { label: 'Indicative tenure', value: service.tenure.replaceAll('â€“', '–') },
    ],
    image: imageByService[id],
    href: `/services/${service.id}`,
    ...SERVICE_CARD_COLORS[index],
    imageFirst: index % 2 === 0,
  }
})

function ArrowIcon({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4.2 10h11.6m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WalletPlaceholder() {
  return (
    <div className="flex aspect-[4/3] max-h-[24rem] w-full self-start items-center justify-center rounded-2xl bg-gradient-to-br from-[#10224d] via-[#18356f] to-[#294780] text-white sm:aspect-[16/10] sm:max-w-[38.4rem] sm:justify-self-center lg:aspect-auto lg:h-full lg:max-h-none lg:max-w-none lg:min-h-[22rem] lg:self-stretch lg:justify-self-stretch" aria-label="Personal loan image placeholder">
      <svg aria-hidden="true" viewBox="0 0 64 64" className="size-16" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="9" y="17" width="46" height="34" rx="7" />
        <path d="M9 25h46M43 37h12" />
        <circle cx="43" cy="37" r="2" fill="currentColor" />
        <path d="M16 17v-4a4 4 0 0 1 4-4h27" />
      </svg>
    </div>
  )
}

function ServiceCard({ card }) {
  const isDark = card.tone === 'dark'
  const buttonStyle = isDark
    ? SERVICE_BUTTON_STYLES.gold
    : card.tone === 'gold'
      ? SERVICE_BUTTON_STYLES.navyOnGold
      : SERVICE_BUTTON_STYLES.navy
  const content = (
    <div className={`order-2 flex min-w-0 flex-col justify-center lg:order-1 ${card.imageFirst ? 'lg:order-2' : ''}`}>
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-[#10224d]/55'}`}>{card.number}</span>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${isDark ? 'border-white/20 bg-white/10 text-white/90' : 'border-[#10224d]/15 bg-white/35 text-[#10224d]/85'}`}>
          {card.tag}
        </span>
      </div>

      <h3 className="mb-3 text-3xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
        {card.title}<span className="text-[#c69214]">.</span>
      </h3>
      <p className={`mb-6 line-clamp-2 max-w-md text-base leading-relaxed opacity-80 lg:text-lg ${isDark ? 'text-white' : 'text-[#10224d]'}`}>
        {card.description}
      </p>

      <div className={`mb-6 flex max-w-md items-stretch ${isDark ? 'text-white' : 'text-[#10224d]'}`}>
        {card.stats.map((stat, index) => (
          <div key={stat.label} className={`min-w-0 flex-1 ${index > 0 ? `border-l pl-4 sm:pl-6 ${isDark ? 'border-white/20' : 'border-[#10224d]/20'} ml-4 sm:ml-6` : ''}`}>
            <strong className="block text-xl font-bold leading-tight sm:text-2xl">{stat.value}</strong>
            <span className={`mt-1 block text-xs font-medium normal-case ${isDark ? 'text-white/70' : 'text-[#10224d]/65'}`}>{stat.label}</span>
          </div>
        ))}
      </div>

      <Link
        to={card.href}
        style={{
          '--cta-background': buttonStyle.background,
          '--cta-hover-background': buttonStyle.hoverBackground,
          color: buttonStyle.color,
          '--cta-shadow': buttonStyle.shadow,
          '--cta-hover-shadow': buttonStyle.hoverShadow,
          '--cta-focus-outline': buttonStyle.focusOutline,
        }}
        className="group mt-0 inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-[var(--cta-background)] px-6 py-2 text-sm font-bold no-underline shadow-[var(--cta-shadow)] transition-all duration-200 hover:bg-[var(--cta-hover-background)] hover:shadow-[var(--cta-hover-shadow)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--cta-focus-outline)] active:scale-[0.98]"
      >
        Explore {card.title}
        <ArrowIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  )

  const image = card.image ? (
    <img
      src={card.image.src}
      alt={card.image.alt}
      loading="lazy"
      decoding="async"
      style={{ objectPosition: card.image.imagePosition || 'center' }}
      className={`order-1 aspect-[4/3] max-h-[24rem] w-full self-start rounded-2xl object-cover sm:aspect-[16/10] sm:max-w-[38.4rem] sm:justify-self-center lg:order-1 lg:aspect-auto lg:h-full lg:max-h-none lg:max-w-none lg:min-h-[22rem] lg:self-stretch lg:justify-self-stretch ${card.imageFirst ? '' : 'lg:order-2'}`}
    />
  ) : <WalletPlaceholder />

  return (
    <ScrollStackItem
      itemClassName="h-[38rem] rounded-[28px] p-4 sm:h-[48rem] sm:p-6 lg:h-[27rem] lg:p-8"
      style={{ background: card.background, color: card.color, border: card.border }}
    >
      <div className="grid h-full grid-cols-1 content-start items-start gap-4 sm:gap-5 lg:grid-cols-2 lg:content-stretch lg:items-stretch lg:gap-12">
        {card.imageFirst ? <>{image}{content}</> : <>{content}{image}</>}
      </div>
    </ScrollStackItem>
  )
}

function ServicesReveal() {
  const revealRef = useRef(null)
  const reducedMotion = useReducedMotion() ?? false
  const { hash } = useLocation()
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches)
  const { scrollYProgress } = useScroll({ target: revealRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 })
  const circleClip = useTransform(progress, [0, 0.7], ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'])
  const copyOpacity = useTransform(progress, [0.6, 0.84], [0, 1])
  const copyY = useTransform(progress, [0.6, 0.84], [18, 0])

  useLayoutEffect(() => {
    if (hash === '#services') progress.jump(0.97)
  }, [hash, progress])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return (
    <section className="relative isolate m-0 mb-20 bg-transparent px-4 pb-16 text-white md:pb-24" id="services" style={{ '--navy': '#10224d', '--navy-deep': '#0b1f4d', '--gold': '#c69214' }} aria-labelledby="services-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[-1] rounded-b-[1.75rem] bg-[var(--navy-deep)] md:rounded-b-[2.5rem]" />
      <div ref={revealRef} className={reducedMotion ? 'relative' : 'relative h-[250svh]'} aria-label="Services introduction reveal">
        <div
          id="services-content"
          className="pointer-events-none absolute"
          style={{ top: reducedMotion ? 0 : 'calc((100% - 100svh) * 0.97)' }}
          aria-hidden="true"
        />
        {reducedMotion ? (
          <div className="mx-auto flex min-h-[22rem] w-full max-w-6xl flex-col items-center justify-center pb-10 text-center">
            <ServicesRevealCopy />
          </div>
        ) : (
          <div className="sticky top-0 -mx-4 grid h-svh w-[calc(100%+2rem)] place-items-center bg-white sm:-mx-6 sm:w-[calc(100%+3rem)]">
            <motion.div className="absolute inset-0 z-0 bg-[var(--navy-deep)]" style={{ clipPath: circleClip }} aria-hidden="true" />
            <motion.div
              className="relative z-[1] flex w-full flex-col items-center justify-center gap-4 px-6 py-8 text-center text-white"
              style={{ opacity: copyOpacity, y: copyY }}
            >
              <ServicesRevealCopy />
            </motion.div>
          </div>
        )}
      </div>

      <ScrollStack
        useWindowScroll
        smoothScroll={false}
        stackPosition={isMobile ? '100px' : '110px'}
        itemStackDistance={isMobile ? 14 : 18}
        itemDistance={105}
        itemScale={0.04}
        baseScale={0.88}
        dimAmount={0.12}
        holdDistance={180}
        className="relative left-1/2 mx-auto !w-[94vw] max-w-[90rem] -translate-x-1/2 overflow-x-clip"
        innerClassName="px-[clamp(0.25rem,1vw,1rem)]"
      >
        {serviceCards.map((card) => <ServiceCard key={card.id} card={card} />)}
      </ScrollStack>
      <p className="mx-auto mb-0 mt-8 w-[94%] max-w-3xl px-2 text-center text-xs leading-relaxed text-white/70 md:mt-12 sm:text-sm">
        * Indicative references from the supplied loan guide only. Rates, tenure, charges, and eligibility vary by lender and applicant; confirm current terms directly with a lender.
      </p>
    </section>
  )
}

function ServicesRevealCopy() {
  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d6ad52]">Our Loans</span>
      <h2 id="services-heading" className="m-0 max-w-[840px] text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.035em]">
        Loans built around your goals.
      </h2>
      <p className="m-0 max-w-[650px] text-sm leading-7 text-white/80 sm:text-base">
        Choose from home, car, personal and business loans, with clear guidance from application to approval.
      </p>
      <Link to="/services" className="group mt-1 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#c69214] px-6 py-2 text-sm font-bold text-white no-underline transition-colors hover:bg-[#c69214] hover:text-[#10224d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#c69214]">
        Explore more services
        <ArrowIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  )
}

export default ServicesReveal
