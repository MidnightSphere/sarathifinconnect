import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { loanServices } from '../../data/loan-services-data.js'
import Navbar from '../../components/navbar/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import LoanCard from './LoanCard.jsx'
import './ServicesPage.css'

const trustPoints = [
  { icon: 'lightning', label: 'Quick processing' },
  { icon: 'calendar', label: 'Flexible tenure' },
  { icon: 'shield', label: 'Trusted & secure' },
]

function TrustIcon({ name }) {
  const paths = {
    lightning: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    shield: <path d="m12 22 1.7-.8A11 11 0 0 0 20 11V5l-8-3-8 3v6a11 11 0 0 0 6.3 10.2L12 22Z M9 12l2 2 4-4" />,
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

function ServicesPage() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="services-page min-h-screen overflow-x-clip text-brand-navy">
      <Navbar />
      <main>
        <section className="services-hero relative isolate px-4 pt-28 pb-16 md:px-6 md:pt-36 md:pb-24" aria-labelledby="services-hero-title">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="min-w-0">
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-brand-gold/20 bg-white/80 px-4 text-sm font-bold uppercase tracking-[0.12em] text-brand-navy shadow-sm">
                <span aria-hidden="true" className="size-2 rounded-full bg-brand-gold" />
                Our services
              </span>
              <h1 id="services-hero-title" className="mb-0 mt-5 max-w-[570px] text-[clamp(2.25rem,5.2vw,4.125rem)] font-extrabold leading-[1.03] tracking-[-0.055em] text-brand-navy">
                Financial solutions for every stage of <span className="text-brand-gold">your journey.</span>
              </h1>
              <p className="mb-0 mt-5 max-w-xl text-base leading-relaxed text-brand-navy/70 md:text-lg">
                From your dream home to business growth, explore tailored loan options and get clear guidance at every step.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="#all-loans" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-navy px-7 text-base font-semibold text-white no-underline shadow-[0_8px_20px_rgba(11,31,77,0.14)] transition hover:-translate-y-0.5 hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold motion-reduce:transition-none">
                  Explore loan services <span aria-hidden="true">↓</span>
                </Link>
                <Link to="/#contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-navy/30 bg-white/70 px-7 text-base font-semibold text-brand-navy no-underline transition hover:-translate-y-0.5 hover:border-brand-navy hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold motion-reduce:transition-none">
                  Talk to an advisor
                </Link>
              </div>

              <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-5 gap-y-3 p-0" aria-label="Our service commitments">
                {trustPoints.map(({ icon, label }) => (
                  <li key={icon} className="inline-flex items-center gap-2.5 text-sm font-medium text-brand-navy/75">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-gold/15 text-brand-navy">
                      <TrustIcon name={icon} />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="services-hero-art relative mx-auto w-full max-w-md lg:max-w-none">
              <img
                src="/loan-pages-photos/service-hero-image.png"
                alt="A couple exploring their next milestone, with a home, car, and city in the background."
                fetchPriority="high"
                className="relative z-10 block h-auto w-full object-contain"
              />
            </div>
          </div>
        </section>

        <section className="bg-surface px-4 py-16 sm:px-6 md:py-24" aria-labelledby="services-title">
          <div id="all-loans" className="mx-auto max-w-7xl scroll-mt-24">
            <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
              <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-brand-gold/20 bg-white px-4 text-xs font-bold uppercase tracking-[0.14em] text-brand-navy">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-gold" />
                All loan services
              </span>
              <h2 id="services-title" className="mb-0 mt-4 text-3xl font-bold leading-tight tracking-[-0.04em] text-brand-navy md:text-5xl">
                Explore Our <span className="text-brand-gold">{loanServices.length} Loan Services</span>
              </h2>
              <p className="mx-auto mb-0 mt-4 max-w-2xl text-base leading-relaxed text-brand-navy/65 md:text-lg">
                Choose from a wide range of loan options designed for your personal and business needs.
              </p>
            </header>

            <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {loanServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="h-full"
                  initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LoanCard service={service} to={`/loans/${service.id}`} />
                </motion.div>
              ))}
            </div>

            <aside id="contact" className="mt-14 grid gap-6 rounded-3xl bg-brand-navy px-6 py-8 text-white md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-10">
              <div>
                <h3 className="m-0 text-2xl font-bold tracking-[-0.03em] md:text-3xl">Not sure which loan fits?</h3>
                <p className="mb-0 mt-2 text-base leading-relaxed text-white/75">Talk to an advisor for clear guidance.</p>
              </div>
              <Link to="/#contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gold px-7 text-base font-semibold text-brand-navy no-underline transition hover:-translate-y-0.5 hover:bg-brand-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none">
                Talk to an advisor <span aria-hidden="true">↗</span>
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ServicesPage
